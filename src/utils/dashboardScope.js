import { istYmd } from './istDates';

/** Stable integer seed for mock datasets: varies by IST calendar day + Today/Week/Month. */
export function datasetSeed(timeScope, at = new Date()) {
  const { y, m, d } = istYmd(at);
  const tag = timeScope === 'Today' ? 1 : timeScope === 'Week' ? 2 : 3;
  return y * 1_000_000 + m * 10_000 + d * 100 + tag;
}
