#!/usr/bin/env python3
"""Write <dir>/<NAME>.psd from <dir>/rig.json + <dir>/parts/*.png + <dir>/preview.png.

A small, dependency-free PSD writer (numpy + Pillow): 8-bit RGB with transparency, layer groups
(folders) named like the rig, hidden layers kept hidden, each layer cropped to its own pixels and
RLE (PackBits) compressed. Opens in Photoshop, After Effects (import as composition, layers kept),
Character Animator, Krita, GIMP, Affinity and Photopea.
"""
import json, os, struct, sys
import numpy as np
from PIL import Image


def packbits(row: bytes) -> bytes:
    n = len(row)
    if n == 0:
        return b''
    if row.count(row[0]) == n:  # whole row is one value (common for transparent rows)
        out = bytearray()
        i = 0
        while i < n:
            k = min(128, n - i)
            if k == 1:
                out += bytes([0, row[0]])
            else:
                out += bytes([(257 - k) & 255, row[0]])
            i += k
        return bytes(out)
    out = bytearray()
    i = 0
    while i < n:
        j = i + 1
        while j < n and j - i < 128 and row[j] == row[i]:
            j += 1
        if j - i >= 3:
            out += bytes([(257 - (j - i)) & 255, row[i]])
            i = j
            continue
        # literal run: until a run of 3 starts or 128 bytes
        j = i
        while j < n and j - i < 128:
            if j + 2 < n and row[j] == row[j + 1] == row[j + 2]:
                break
            j += 1
        out += bytes([j - i - 1]) + row[i:j]
        i = j
    return bytes(out)


def rle_channel(ch: np.ndarray):
    """-> (row byte counts, packed data) for one channel (H×W uint8)."""
    rows = [packbits(r.tobytes()) for r in ch]
    return rows


def pascal(name: str) -> bytes:
    b = name.encode('ascii', 'replace')[:255]
    s = bytes([len(b)]) + b
    while len(s) % 4:
        s += b'\0'
    return s


def tagged(key: bytes, data: bytes) -> bytes:
    if len(data) % 2:
        data += b'\0'
    return b'8BIM' + key + struct.pack('>I', len(data)) + data


def luni(name: str) -> bytes:
    u = name.encode('utf-16-be')
    return tagged(b'luni', struct.pack('>I', len(name)) + u)


def layer_record(name, rect, chan_lens, hidden=False, lsct=None):
    top, left, bottom, right = rect
    rec = struct.pack('>iiiiH', top, left, bottom, right, 4)
    for cid, ln in zip((-1, 0, 1, 2), chan_lens):
        rec += struct.pack('>hI', cid, ln)
    flags = 0x08  # bit 3: bit 4 is meaningful
    if hidden:
        flags |= 0x02
    if lsct is not None:
        flags |= 0x10  # pixel data irrelevant to appearance (group markers)
    rec += b'8BIMnorm' + struct.pack('>BBBB', 255, 0, flags, 0)
    extra = struct.pack('>I', 0) + struct.pack('>I', 0) + pascal(name) + luni(name)
    if lsct is not None:
        extra += tagged(b'lsct', struct.pack('>I', lsct))
    rec += struct.pack('>I', len(extra)) + extra
    return rec


def channel_blob(chs):
    """chs: list of 4 arrays (A,R,G,B) of the cropped layer -> list of per-channel bytes."""
    blobs = []
    for ch in chs:
        if ch.size == 0:
            blobs.append(struct.pack('>H', 0))
            continue
        rows = rle_channel(ch)
        blobs.append(struct.pack('>H', 1) + b''.join(struct.pack('>H', len(r)) for r in rows) + b''.join(rows))
    return blobs


def main(d):
    rig = json.load(open(os.path.join(d, 'rig.json')))
    W, H = rig['width'], rig['height']
    records, datas = [], []

    def add_pixels(node):
        im = np.asarray(Image.open(os.path.join(d, node['file'])).convert('RGBA'))
        a = im[:, :, 3]
        ys, xs = np.nonzero(a)
        if len(ys) == 0:
            rect = (0, 0, 0, 0)
            chs = [np.zeros((0, 0), np.uint8)] * 4
        else:
            t, b, l, r = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            rect = (int(t), int(l), int(b), int(r))
            c = im[t:b, l:r]
            chs = [c[:, :, 3], c[:, :, 0], c[:, :, 1], c[:, :, 2]]
        blobs = channel_blob(chs)
        records.append(layer_record(node['name'], rect, [len(x) for x in blobs], node.get('hidden', False)))
        datas.append(b''.join(blobs))

    def add_marker(name, kind, hidden=False):
        blobs = [struct.pack('>H', 0)] * 4
        records.append(layer_record(name, (0, 0, 0, 0), [2, 2, 2, 2], hidden, lsct=kind))
        datas.append(b''.join(blobs))

    # PSD stores layers bottom-first. A group = divider (lsct 3) below its children, folder (lsct 1) above.
    def walk(node, top=False):
        if 'children' in node:
            add_marker('</Layer group>', 3)
            for c in node['children']:
                walk(c)
            add_marker(node['name'], 1, node.get('hidden', False))
        else:
            add_pixels(node)

    walk(rig['root'], True)

    layer_info = struct.pack('>h', -len(records)) + b''.join(records) + b''.join(datas)
    if len(layer_info) % 2:
        layer_info += b'\0'
    layer_info = struct.pack('>I', len(layer_info)) + layer_info
    lm = layer_info + struct.pack('>I', 0)  # no global layer mask
    lm = struct.pack('>I', len(lm)) + lm

    # composite (merged) image: RGBA, RLE
    comp = np.asarray(Image.open(os.path.join(d, 'preview.png')).convert('RGBA'))
    # un-premultiply against white is not needed; store straight colour, alpha as 4th channel
    chans = [comp[:, :, 0], comp[:, :, 1], comp[:, :, 2], comp[:, :, 3]]
    all_rows = [rle_channel(c) for c in chans]
    comp_data = struct.pack('>H', 1) + b''.join(struct.pack('>H', len(r)) for rows in all_rows for r in rows) + b''.join(r for rows in all_rows for r in rows)

    header = b'8BPS' + struct.pack('>H', 1) + b'\0' * 6 + struct.pack('>HIIHH', 4, H, W, 8, 3)
    out = header + struct.pack('>I', 0) + struct.pack('>I', 0) + lm + comp_data
    with open(os.path.join(d, rig['name'] + '.psd'), 'wb') as f:
        f.write(out)


if __name__ == '__main__':
    main(sys.argv[1])
