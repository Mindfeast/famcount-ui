export function createLinearScale(
  domain: [number, number],
  range: [number, number]
) {
  const [minDomain, maxDomain] = domain;
  const [minRange, maxRange] = range;
  const sizeOfDomain = maxDomain - minDomain;
  const sizeOfRange = maxRange - minRange;

  return function scale(value: number) {
    const positionInDomain = (value - minDomain) / sizeOfDomain;
    return minRange + positionInDomain * sizeOfRange;
  };
}
