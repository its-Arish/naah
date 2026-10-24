/** One shot (= one beat) from timeline.json. */
export type Shot = {
  id: string; kind: string; from: number; dur: number; title?: string; n?: number;
  shot?: string; speaker?: string; section?: string;
  words?: { w: string; em: boolean; at: number }[]; gag?: boolean; date?: number | null; prevDate?: number | null; talkEnd?: number;
};
