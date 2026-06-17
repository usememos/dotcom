export interface Clock {
  ts: number;
  counter: number;
  deviceId: string;
}

export function createClock(deviceId: string, ts = 0, counter = 0): Clock {
  return { ts, counter, deviceId };
}

export function compareClocks(a: Clock, b: Clock): number {
  if (a.ts !== b.ts) return a.ts < b.ts ? -1 : 1;
  if (a.counter !== b.counter) return a.counter < b.counter ? -1 : 1;
  if (a.deviceId !== b.deviceId) return a.deviceId < b.deviceId ? -1 : 1;
  return 0;
}

export function advanceClock(prev: Clock, now: number): Clock {
  const ts = Math.max(prev.ts, now);
  const counter = ts === prev.ts ? prev.counter + 1 : 0;
  return { ts, counter, deviceId: prev.deviceId };
}

export function receiveClock(local: Clock, remote: Clock, now: number): Clock {
  const ts = Math.max(local.ts, remote.ts, now);
  let counter: number;
  if (ts === local.ts && ts === remote.ts) counter = Math.max(local.counter, remote.counter) + 1;
  else if (ts === local.ts) counter = local.counter + 1;
  else if (ts === remote.ts) counter = remote.counter + 1;
  else counter = 0;
  return { ts, counter, deviceId: local.deviceId };
}
