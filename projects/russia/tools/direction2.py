"""Direction for chapters 2-10 (beats s03..s11). Merged into tools/direction.json, then run make_beats.py.
Row: id: (shot, type, date, em, sfx, extra) — date None = keep previous; '-' = hide tag."""
import json, os
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S, T, I, HO = 'STORY', 'STORY', 'INSERT', 'HOST'
Q = {'quiet': True}
R = {}
def d(ids, shot, typ=T, date=None, em=None, sfx=None, **extra):
    for i, bid in enumerate(ids.split()):
        e = {'shot': shot, 'type': typ}
        if date is not None and i == 0: e['date'] = None if date == '-' else date
        if em and em[i]: e['em'] = em[i] if isinstance(em[i], list) else [em[i]]
        if sfx and sfx[i]: e['sfx'] = sfx[i]
        e.update(extra)
        R[bid] = e

# ---------------------------------------------------------------- Chapter 2: The Moneybag and the Tsars
d('s03b01', 'c2_1147', HO, 1147, [['1147.']], [[['paper', 'w:records', 0.5]]])
d('s03b02 s03b03', 'c2_woodtown', T, None, [['nothing'], ['wooden']], None, amb='birds')
d('s03b04', 'c2_clever', HO, None, [['clever.']], [[['ding', 'w:clever', 0.5]]])
d('s03b05 s03b07', 'c2_kalita', T, 1325, [['trust'], ['share.']], [[['coins', 'w:tribute', 0.5]], [['kaching', 'w:share', 0.5]]])
d('s03b08 s03b09', 'c2_moneybag', T, None, [['Kalita.'], ['Moneybag.']], [[['pop', 'w:Kalita', 0.5]], [['coins', 'w:Moneybag', 0.5]]], gag=False)
R['s03b09']['gag'] = True
d('s03b10 s03b11', 'c2_influence', I, None, [['land,'], ['Church']], [[['pop', 'w:land', 0.4], ['pop', 'w:influence', 0.4]], [['ding', 'w:Church', 0.4]]])
d('s03b12 s03b13', 'c2_working', HO, None, [['defying'], ['working']], [[['clang', 'w:defying', 0.3]], [['coins', 'w:working', 0.4]]])
d('s03b14', 'c2_stoppay', T, 1480, [['stopped']], [[['slam', 'w:stopped', 0.4]]])
d('s03b15 s03b16 s03b17 s03b18', 'c2_ugra', T, None, [['Ugra'], ['Neither'], ['withdrew.'], ['without']], [None, None, [['gallop', 'w:withdrew', 0.3]], None], amb='wind')
d('s03b19', 'c2_eagle', I, None, [['double-headed']], [[['pop', 'w:eagle', 0.5]]])
d('s03b20 s03b21 s03b22', 'c2_thirdrome', I, 1453, [['fell'], ['Moscow'], ['Third']], [[['thud', 'w:fell', 0.4]], [['pop', 'w:Moscow', 0.4]], [['ding', 'w:Rome', 0.5]]])
R['s03b21']['date'] = 1500
d('s03b23 s03b24', 'c2_crowned', T, 1547, [['Tsar'], ['Caesar.']], [[['drum', 'w:crowned', 0.4]], [['pop', 'w:Caesar', 0.5]]])
d('s03b25 s03b26 s03b27', 'c2_terrible', HO, None, [['Terrible.'], ['fearsome.'], ['both.']], [[['thud', 'w:Terrible', 0.4]], [['pop', 'w:fearsome', 0.4]], None])
d('s03b28 s03b29 s03b30', 'c2_terror', T, 1565, [['crushed'], ['terror'], ['son']], None, quiet=True)
R['s03b30']['date'] = 1581
d('s03b31 s03b32', 'c2_distance', HO, None, [['walls.'], ['distance.']], [None, [['whoosh', 'w:distance', 0.4]]])
d('s03b33 s03b34 s03b35', 'map:east', I, 1552, [['east.'], ['Kazan.'], ['Urals', 'Ural']], [[['whoosh', 'w:east', 0.4]], [['pop', 'w:Kazan', 0.5]], [['pop', 'w:Siberia', 0.5]]])
R['s03b35'].pop('em'); R['s03b35']['em'] = ['Ural']; R['s03b35']['date'] = 1582
d('s03b36 s03b37 s03b38', 'c2_sable', T, None, [['valuable'], ['sable.'], ['soft']], [None, [['pop', 'w:sable', 0.5]], [['coins', 'w:gold', 0.4]]], amb='wind')
d('s03b39 s03b40', 'c2_ostrog', T, None, [['pushed'], ['forts,']], [None, [['thud', 'w:forts', 0.4], ['coins', 'w:tribute', 0.3]]], amb='wind')
d('s03b41 s03b42', 'map:pacific', I, 1639, [['Pacific.'], ['continent.']], [[['ding', 'w:Pacific', 0.5]], None])
d('s03b43 s03b44 s03b45', 'c2_catch', HO, None, [['catch.'], ['land'], ['fix']], [[['boing', 'w:catch', 0.4]], None, None])

# ---------------------------------------------------------------- Chapter 3: The Chains
d('s04b01', 'c3_vanish', HO, 1598, [['vanished.']], [[['whoosh', 'w:vanished', 0.4]]])
d('s04b02 s04b03', 'c3_volcano', T, 1600, [['volcano'], ['cooled']], [[['rumble', 'w:volcano', 0.5]], None])
d('s04b04 s04b05', 'c3_famine', T, 1601, [['failed.'], ['millions']], None, quiet=True, amb='wind')
d('s04b06 s04b07 s04b08 s04b09', 'c3_troubles', T, 1605, [['died'], ['Rival'], ['Pretenders'], ['Foreign']], [None, [['clang', 'w:fought', 0.3]], [['pop', 'w:Pretenders', 0.4]], [['drum', 'w:armies', 0.4]]])
d('s04b10', 'c3_kremlin', T, 1610, [['Kremlin.']], [[['thud', 'w:occupied', 0.4]]])
d('s04b11', 'c3_minin', T, 1612, [['drove']], [[['drum', 'w:volunteer', 0.4]]])
d('s04b12 s04b13', 'c3_romanov', T, 1613, [['16-year-old,'], ['300']], [[['drum', 'w:Tsar', 0.4]], [['ding', 'w:300', 0.4]]])
d('s04b14 s04b15 s04b16', 'c3_walkaway', T, None, [['problem.'], ['huge'], ['walk']], [None, None, [['whoosh', 'w:forest', 0.3]]], amb='birds')
R['s04b14']['type'] = HO; R['s04b14']['shot'] = 'c3_problem'
d('s04b17 s04b18', 'c3_needs', T, None, [['workers.'], ['taxes.']], [[['pop', 'w:workers', 0.4]], [['coins', 'w:taxes', 0.4]]])
d('s04b19 s04b20 s04b21', 'c3_code', T, 1649, [['locked'], ['bound'], ['children.']], [[['clang', 'w:locked', 0.45]], [['clang', 'w:bound', 0.3]], None])
d('s04b22', 'c3_serfdom', I, None, [['serfdom,']], [[['scribble', 'w:centuries', 0.4]]])
d('s04b23 s04b24 s04b25 s04b26', 'c3_imagine', T, None, [['Imagine'], ['farm'], ['labour'], ['chains.']], [None, None, None, [['clang', 'w:chains', 0.3]]], quiet=True)
d('s04b27 s04b28 s04b29', 'c3_arith', HO, None, [['cruelty'], ['arithmetic.'], ['nobody']], [None, [['ding', 'w:arithmetic', 0.4]], None])
d('s04b30 s04b31', 'c3_peter', T, 1689, [['Great.'], ['enormous']], [[['drum', 'w:Peter', 0.4]], [['boing', 'w:eight', 0.4]]])
d('s04b32', 'c3_shipyard', T, 1697, [['incognito']], [[['clang', 'w:shipyard', 0.3]]])
d('s04b33', 'c3_navy', T, None, [['navy.']], [[['whoosh', 'w:navy', 0.3]]], amb='waves')
d('s04b34 s04b35', 'c3_beards', T, 1698, [['Western'], ['shave']], [None, [['slide_down', 'w:beards', 0.5]]])
R['s04b35']['gag'] = True
d('s04b36', 'c3_window', HO, None, [['window']], [[['pop', 'w:window', 0.4]]])
d('s04b37 s04b38 s04b39 s04b40 s04b41 s04b42', 'c3_swamp', T, 1703, [['Baltic'], ['swamp.'], ['conscripted'], ['died'], None, ['Petersburg.']], [None, [['slide_down', 'w:swamp', 0.4]], None, None, None, [['ding', 'w:Petersburg', 0.4]]], amb='wind')
for k in ('s04b39', 's04b40'): R[k]['quiet'] = True
d('s04b43 s04b44', 'c3_pattern', HO, None, [['miniature.'], ['lives.']], None)

# ---------------------------------------------------------------- Chapter 4: The Empire That Won and Fell Behind
d('s05b01', 'c4_coup', HO, 1762, [['German-born']], [[['pop', 'w:throne', 0.4]]])
d('s05b02', 'c4_catherine', T, None, [['Great.']], [[['drum', 'w:Catherine', 0.4]]])
d('s05b03 s05b04 s05b05', 'map:catherine', I, 1772, [['west'], ['Poland.'], ['Crimea,']], [None, [['scribble', 'w:carving', 0.4]], [['pop', 'w:Crimea', 0.5]]])
R['s05b05']['date'] = 1783
d('s05b06 s05b07', 'map:alaska', I, 1799, [['Alaska.'], ['expensive']], [[['pop', 'w:Alaska', 0.5]], None])
d('s05b08 s05b09', 'c4_sale', T, 1867, [['$7.2'], ['two']], [[['kaching', 'w:million', 0.5]], [['boing', 'w:acre', 0.5]]])
R['s05b09']['gag'] = True
d('s05b10 s05b11 s05b12', 'c4_napoleon', T, 1812, [['Napoleon'], ['decisive'], ['refused']], [[['drum', 'w:invaded', 0.5]], [['ding', 'w:battle', 0.4]], [['boing', 'w:refused', 0.4]]])
d('s05b13', 'c4_scorched', T, None, [['burning']], None, amb='wind')
d('s05b14', 'map:napoleon', I, None, [['deeper']], None)
d('s05b15 s05b16', 'c4_moscow1812', T, None, [['empty.'], ['burning.']], [None, [['rumble', 'w:burning', 0.4]]], amb='wind')
d('s05b17', 'c4_waiting', T, None, [['never']], [[['ticks', 'w:waited', 0.4]]])
d('s05b18 s05b19 s05b20', 'c4_retreat', T, None, [['main'], ['shredded'], ['fraction']], None, quiet=True, amb='wind')
R['s05b19']['shot'] = R['s05b20']['shot'] = 'c4_causes'; R['s05b19']['type'] = R['s05b20']['type'] = I
d('s05b21', 'c4_paris', T, 1814, [['Paris.']], [[['drum', 'w:marched', 0.4]]])
d('s05b22', 'c4_twist', HO, None, [['cruel']], None)
d('s05b23 s05b24', 'c4_split', T, 1840, [['factories'], ['serfs.']], [[['whoosh', 'w:railways', 0.3]], None])
d('s05b25', 'c4_crimea', T, 1855, [['defeat']], [[['thud', 'w:defeat', 0.4]]], amb='waves')
d('s05b26', 'c4_emancipation', T, 1861, [['freed']], [[['clang', 'w:freed', 0.45]]])
d('s05b27 s05b28', 'c4_debt', T, None, [["didn't"], ['debt']], [None, [['paper', 'w:debt', 0.4]]])
d('s05b29', 'c4_1881', T, 1881, [['assassinated']], None, quiet=True)
d('s05b30', 'c4_train', T, None, [['pushed']], [[['whoosh', 0, 0.3]]])
d('s05b31 s05b32 s05b33', 'map:railway', I, 1891, [['Trans-Siberian'], ['9,000'], ['steel']], [None, [['ding', 'w:Pacific', 0.4]], None])
R['s05b33']['date'] = 1916
d('s05b34', 'c4_romanovs', T, None, [["couldn't"]], [[['thud', 'w:Romanovs', 0.4]]])

# ---------------------------------------------------------------- Chapter 5: Collapse, and the Man of Steel
d('s06b01', 'c5_japan', HO, 1904, [['easy']], [[['pop', 'w:Japan', 0.4]]])
d('s06b02 s06b03', 'c5_tsushima', T, 1905, [['humiliating'], ['first']], [[['thud', 'w:defeat', 0.4]], None], amb='waves')
d('s06b04 s06b05', 'c5_ww1', T, 1914, [['World'], ['without']], [[['drum', 'w:War', 0.4]], None], amb='wind')
d('s06b06 s06b07', 'c5_petrograd', T, 1917, [['bread'], ['joined']], [[['drum', 'w:riots', 0.3]], [['pop', 'w:joined', 0.4]]])
d('s06b08', 'c5_abdicate', T, None, [['abdicated,']], [[['thud', 'w:abdicated', 0.4]]])
d('s06b09', 'c5_lenin', T, None, [['seized']], [[['drum', 'w:seized', 0.4]]])
d('s06b10', 'c5_ipatiev', T, 1918, [None], None, quiet=True)
d('s06b11', 'c5_civilwar', I, 1919, [['millions']], None, quiet=True)
d('s06b12', 'c5_ussr', T, 1922, [['Soviet']], [[['drum', 'w:born', 0.4]]])
d('s06b13', 'c5_stalin', T, 1924, [['Stalin']], [[['pop', 'w:Stalin', 0.4]]])
d('s06b14 s06b15', 'c5_industry', T, 1929, [['industrial'], ['lives.']], [[['clang', 'w:fast', 0.4]], None])
R['s06b15']['quiet'] = True
d('s06b16', 'c5_collective', T, 1930, [['seized']], None, quiet=True)
d('s06b17 s06b18', 'map:famine', I, 1932, [['famine'], ['Kazakhstan,']], None, quiet=True)
d('s06b19 s06b20 s06b21', 'c5_terror', T, 1937, [['Terror.'], ['enemies'], ['shot.']], None, quiet=True)
d('s06b22', 'c5_gulag', T, 1938, [['Gulag']], None, quiet=True, amb='wind')
d('s06b23 s06b24 s06b25', 'c5_contra', HO, None, [['contradiction'], ['too'], ['destroyed']], None, quiet=True)
d('s06b26 s06b27', 'c5_thinking', T, 1939, [['birth'], ['invasion.']], [None, [['drum', 'w:invasion', 0.4]]])
d('s06b28', 'c5_june41', I, 1941, [['June']], [[['thud', 'w:came', 0.5]]])

# ---------------------------------------------------------------- Chapter 6: The War That Spent 27 Million
d('s07b01', 'c6_barb', HO, 1941, [['Barbarossa.']], [[['rumble', 'w:launched', 0.4]]])
d('s07b02 s07b03 s07b04 s07b05 s07b06 s07b07', 'map:barbarossa', I, None, [['three'], ['overwhelmed.'], ['encircled.'], ['captured.'], ['Moscow.'], ['Leningrad.']],
  [[['rumble', 'w:poured', 0.4]], None, None, None, [['thud', 'w:Moscow', 0.4]], [['thud', 'w:Leningrad', 0.4]]])
d('s07b08 s07b09 s07b10', 'c6_siege', T, None, [['872'], ['Food'], ['wallpaper']], None, quiet=True, amb='wind')
d('s07b11 s07b12 s07b13 s07b14 s07b17 s07b18 s07b19 s07b20 s07b21', 'c6_tanya', T, 1941,
  [['Tanya'], ['eleven'], ['notebook,'], ['deaths'], None, None, None, ['few'], None], None, quiet=True)
for k, y in (('s07b17', 1942),): R[k]['date'] = y
R['s07b21']['date'] = 1944
d('s07b22 s07b23', 'c6_candles', I, 1944, [['hundreds'], ['million.']], None, quiet=True)
d('s07b24', 'c6_size', HO, 1941, [['size']], None)
d('s07b25', 'map:evac', I, None, [['dismantled']], [[['whoosh', 'w:trains', 0.3]]])
d('s07b27 s07b28 s07b29', 'c6_factory', T, 1942, [['Workers'], ['east,'], ['tanks']], [None, [['clang', 'w:resumed', 0.3]], [['clang', 'w:tanks', 0.3]]], amb='wind')
d('s07b30 s07b31 s07b32 s07b33', 'c6_stalingrad', T, 1942, [['Stalingrad.'], ['house'], ['surrendered.'], ['tide']], [[['drum', 'w:Stalingrad', 0.4]], None, None, [['whoosh', 'w:turned', 0.4]]], quiet=True)
R['s07b32']['date'] = 1943
d('s07b34', 'c6_berlin', T, 1945, [['Berlin.']], [[['drum', 'w:Berlin', 0.4]]])
d('s07b35 s07b36 s07b37', 'c6_cost', I, None, [['staggering.'], ['27'], ['More']], None, quiet=True)
d('s07b38 s07b39', 'c6_lesson', HO, None, [['lesson'], ['Never']], [None, [['slam', 'w:exposed', 0.4]]])

# ---------------------------------------------------------------- Chapter 7: A Wall Made of Other Countries
d('s08b01', 'c7_after', HO, 1945, [['Eastern']], [[['pop', 'w:Europe', 0.4]]])
d('s08b02 s08b03 s08b04 s08b05 s08b06 s08b07', 'map:bloc', I, 1948, [['Poland.'], ['East'], ['Hungary.'], ['Romania.'], ['Bulgaria.'], ['buffer']],
  [[['pop', 'w:Poland', 0.4]], [['pop', 'w:Germany', 0.4]], [['pop', 'w:Hungary', 0.4]], [['pop', 'w:Romania', 0.4]], [['pop', 'w:Bulgaria', 0.4]], None])
d('s08b08 s08b09', 'c7_twoviews', I, None, [['security.'], ['repression']], [[['ding', 'w:security', 0.4]], None])
d('s08b10 s08b11', 'c7_super', T, None, [['worked,'], ['two']], [None, [['drum', 'w:superpowers', 0.4]]])
d('s08b12', 'c7_sputnik', T, 1957, [['Sputnik']], [[['blip', 'w:Sputnik', 0.5]]])
d('s08b13 s08b14', 'c7_gagarin', T, 1961, [['Gagarin'], ['century']], [[['rumble', 'w:orbit', 0.4]], [['ding', 'w:century', 0.4]]])
d('s08b15', 'c7_bomba', I, None, [['largest']], [[['rumble', 'w:detonated', 0.5]]])
d('s08b16 s08b17 s08b18', 'c7_economy', T, 1975, [['struggled.'], ['military'], ['Afghanistan,']], [None, [['drum', 'w:military', 0.3]], None])
R['s08b18']['date'] = 1979
d('s08b19 s08b20', 'c7_chernobyl', T, 1986, [['Chernobyl'], ['hide']], [[['thud', 'w:exploded', 0.4]], [['paper', 'w:hide', 0.4]]], quiet=True)
d('s08b21 s08b22', 'c7_gorby', T, 1987, [['reform'], ['down.']], [[['pop', 'w:reform', 0.4]], [['thud', 'w:down', 0.4]]])
d('s08b23', 'c7_flagdown', T, 1991, [['red']], [[['slide_down', 'w:down', 0.4]]], quiet=True)
d('s08b24 s08b25 s08b26', 'map:breakup', I, None, [['Fifteen'], ['largest.'], ['buffer']], [[['pops', 'w:countries', 0.4]], [['ding', 'w:largest', 0.4]], None])
d('s08b27 s08b28 s08b29', 'c7_borders', T, None, [['25'], ["hadn't"], ['borders']], [None, None, [['whoosh', 'w:borders', 0.4]]])
d('s08b30 s08b31 s08b32 s08b33 s08b34', 'c7_nineties', I, 1992, [['brutal.'], ['collapsed.'], ['vanished.'], ['fell'], ['dropped']],
  [None, [['slide_down', 'w:collapsed', 0.4]], [['whoosh', 'w:vanished', 0.4]], [['slide_down', 'w:fell', 0.3]], [['slide_down', 'w:dropped', 0.3]]], quiet=True)
d('s08b35 s08b36', 'c7_gap', I, None, [['important.'], ['gap']], None)
d('s08b37 s08b38', 'c7_yeltsin', T, 1999, [['resigned.'], ['Putin.']], [[['thud', 'w:resigned', 0.4]], [['pop', 'w:Putin', 0.4]]])

# ---------------------------------------------------------------- Chapter 8: The Old Fear Returns
d('s09b01', 'c8_stability', HO, 2000, [['stability.']], [[['pop', 'w:stability', 0.4]]])
d('s09b02 s09b03 s09b04 s09b05', 'c8_recovery', I, 2003, [['energy'], ['recovered.'], ['centralised.'], ['influence']], [[['coins', 'w:prices', 0.4]], [['ding', 'w:recovered', 0.4]], [['pop', 'w:centralised', 0.4]], [['pop', 'w:influence', 0.4]]])
d('s09b06', 'c8_quote', T, 2005, [['catastrophe.']], [[['paper', 'w:called', 0.4]]])
d('s09b07 s09b08 s09b09 s09b10 s09b11', 'map:nato', I, 1999, [['western'], ['NATO.'], ['disappearing.'], ['choice'], ['independence.']], [None, [['pops', 'w:NATO', 0.4]], None, None, None])
R['s09b08']['date'] = 2004
d('s09b12 s09b13 s09b14', 'map:crimea', I, 2014, [['flashpoint.'], ['annexed'], ['refused']], [None, [['thud', 'w:annexed', 0.4]], None])
d('s09b15', 'map:invasion', I, 2022, [['full-scale']], [[['rumble', 'w:invasion', 0.4]]], quiet=True)
d('s09b16 s09b17 s09b18', 'c8_views', I, None, [['NATO'], ['unprovoked'], ['condemned']], [[['pop', 'w:pointed', 0.4]], [['pop', 'w:called', 0.4]], [['paper', 'w:condemned', 0.4]]])
d('s09b19', 'c8_largest', I, None, [['largest']], None, quiet=True)
d('s09b20 s09b21', 'c8_cities', T, None, [['flattened.'], ['displaced.']], None, quiet=True, amb='wind')
d('s09b22 s09b23 s09b24', 'c8_losses', I, 2024, [['enormous.'], ['million'], ['no']], None, quiet=True)
d('s09b25', 'map:wagner', I, 2023, [['revolt']], None)
d('s09b26 s09b27', 'map:kursk', I, 2024, [['Kursk'], ['first']], None)
d('s09b28 s09b29', 'c8_talks', T, 2026, [['still'], ['stalling.']], [None, [['boing', 'w:stalling', 0.3]]])
d('s09b30 s09b31', 'c8_oldfear', HO, None, [['old'], ['shoot']], None, quiet=True)

# ---------------------------------------------------------------- Chapter 9: The Bill Comes Due
d('s10b01 s10b02 s10b03', 'c9_remember', HO, '-', [['problem'], ['land.'], ['few']], [None, [['pop', 'w:land', 0.4]], [['pop', 'w:few', 0.4]]])
d('s10b04', 'c9_expand', I, None, [['expand,']], [[['whoosh', 'w:expand', 0.4]]])
d('s10b05 s10b06 s10b07 s10b08 s10b09', 'c9_spent', I, None, [['spent'], ['Serfs.'], ['Peasants.'], ['Prisoners.'], ['Soldiers.']], None, quiet=True)
d('s10b10 s10b11', 'c9_cradle', T, 2025, [["can't"], ['again.']], [[['rumble', 0, 0.3]], [['slam', 'w:again', 0.3]]], quiet=True)
d('s10b12 s10b13', 'c9_popline', I, None, [['148.7'], ['falling.']], [[['ding', 'w:1991', 0.4]], [['slide_down', 'w:falling', 0.4]]])
d('s10b14 s10b15 s10b16 s10b17', 'c9_births', I, 2024, [['1.22'], ['fewest'], ['worse.'], ['two']], [[['pop', 'w:births', 0.4]], [['thud', 'w:fewest', 0.4]], None, [['thud', 'w:centuries', 0.4]]])
R['s10b16']['date'] = 2025
d('s10b18 s10b19', 'c9_fertility', I, None, [['1.4'], ['2.1']], [[['pops', 'w:1.4', 0.4]], [['pop', 'w:2.1', 0.4]]])
d('s10b20 s10b21', 'c9_pyramid', I, None, [['gap'], ['fewer']], None)
d('s10b22', 'c9_leaving', T, None, [['emigration.']], None, quiet=True)
d('s10b23 s10b24', 'c9_forecast', I, None, [['130'], ['1897.']], [[['slide_down', 'w:fall', 0.4]], [['ding', 'w:1897', 0.4]]])
d('s10b25 s10b26 s10b27', 'c9_policy', T, None, [['noticed.'], ['traditional'], ['payments']], [None, [['pop', 'w:values', 0.4], ['pop', 'w:abortion', 0.4]], [['coins', 'w:payments', 0.4]]])
d('s10b28 s10b29', 'c9_stopped', I, None, [['dropping.'], ['stopped']], [[['slide_down', 'w:dropping', 0.4]], [['paper', 'w:stopped', 0.4]]])
d('s10b30 s10b31 s10b32 s10b33', 'map:fareast', I, None, [['east.'], ['four'], ['resources'], ['losing']], None, amb='wind')
d('s10b34 s10b35', 'c9_door', HO, None, [['appetite'], ['immigration.']], [None, [['pop', 'w:immigration', 0.4]]])

# ---------------------------------------------------------------- Conclusion
d('s11b01 s11b02', 'c10_chronicle', I, '-', [['chronicle,'], ['great']], [[['paper', 'w:chronicle', 0.4]], None])
d('s11b03 s11b04', 'c10_half', HO, None, [['first'], ['great']], [[['ding', 'w:holds', 0.4]], None])
d('s11b05', 'map:final', I, None, [['largest']], None)
d('s11b06 s11b07 s11b08 s11b09', 'c10_survived', I, None, [['Mongols.'], ['Poles.'], ['Napoleon.'], ['Hitler.']],
  [[['thud', 'w:Mongols', 0.4]], [['thud', 'w:Poles', 0.4]], [['thud', 'w:Napoleon', 0.4]], [['thud', 'w:Hitler', 0.4]]])
d('s11b10 s11b11 s11b12', 'c10_problem', HO, None, [['never'], ['enough'], ['cheapest']], None)
d('s11b13 s11b15', 'c10_quiet', T, None, [['No'], ['quieter.']], None, quiet=True, amb='wind')
d('s11b16 s11b17 s11b18 s11b19', 'c10_replace', I, None, [['moved.'], ['taken.'], ['rebuilt.'], ['generations']], [[['whoosh', 'w:moved', 0.3]], [['pop', 'w:taken', 0.3]], [['pop', 'w:rebuilt', 0.3]], None])
d('s11b20 s11b21', 'c10_who', T, None, [['land.'], ['who']], None, quiet=True, amb='wind')
d('s11b22 s11b23', 'c10_subscribe', HO, None, [['Subscribe'], ['next?']], [[['pop', 'w:Subscribe', 0.4]], None])

D = json.load(open(os.path.join(H, 'tools', 'direction.json')))
D.update(R)
json.dump(D, open(os.path.join(H, 'tools', 'direction.json'), 'w'), indent=1, ensure_ascii=False)
print(len(R), 'beats directed; total', len(D))
