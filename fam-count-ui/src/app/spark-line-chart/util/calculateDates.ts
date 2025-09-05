export function getXType(
  points: { x: string | number | Date }[]
): 'year' | 'month' | 'day' | 'number' {
  const first = points[0]?.x;
  const asDate =
    typeof first === 'string'
      ? new Date(first)
      : first instanceof Date
      ? first
      : null;
  if (asDate && !isNaN(asDate.getTime())) {
    const last = points[points.length - 1]?.x;
    const lastDate =
      typeof last === 'string'
        ? new Date(last)
        : last instanceof Date
        ? last
        : null;
    if (!lastDate) return 'number';
    const diff = lastDate.getTime() - asDate.getTime();
    if (diff > 1000 * 60 * 60 * 24 * 365) return 'year';
    if (diff > 1000 * 60 * 60 * 24 * 28) return 'month';
    return 'day';
  }
  return 'number';
}

export function generateXTicks(
  points: { x: string | number | Date }[],
  xType: 'year' | 'month' | 'day' | 'number'
) {
  const ticks: (number | string | Date)[] = [];
  if (xType === 'year') {
    const years = points.map((p) =>
      typeof p.x === 'number' ? p.x : new Date(p.x).getFullYear()
    );
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const step = Math.max(1, Math.floor((maxYear - minYear) / 11));
    for (let y = minYear; y <= maxYear && ticks.length < 12; y += step) {
      ticks.push(y);
    }
    if (ticks.length < 12 && ticks[ticks.length - 1] !== maxYear)
      ticks.push(maxYear);
    return ticks.slice(0, 12);
  }
  if (xType === 'month') {
    // Show 12 months for the year in the data
    const dates = points.map((p) => new Date(p.x));
    const year = dates[0].getFullYear();
    for (let m = 0; m < 12; m++) {
      ticks.push(new Date(year, m, 1));
    }
    return ticks;
  }
  if (xType === 'day') {
    // Support up to 3 months of days, steps of 5 days
    const dates = points.map((p) => new Date(p.x));
    const start = new Date(dates[0].getFullYear(), dates[0].getMonth(), 1);
    const end = new Date(
      dates[dates.length - 1].getFullYear(),
      dates[dates.length - 1].getMonth() + 1,
      0
    );
    let current = new Date(start);
    while (current <= end) {
      ticks.push(new Date(current));
      current.setDate(current.getDate() + 5);
    }
    return ticks;
  }
  // fallback for numbers
  const xs = points.map((p) =>
    typeof p.x === 'number' ? p.x : new Date(p.x).getTime()
  );
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const step = (maxX - minX) / 11;
  for (let x = minX; x <= maxX && ticks.length < 12; x += step) {
    ticks.push(x);
  }
  if (ticks.length < 12 && ticks[ticks.length - 1] !== maxX) ticks.push(maxX);
  return ticks.slice(0, 12);
}

export function viewType(viewType: )