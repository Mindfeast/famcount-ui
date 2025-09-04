export function getColor(index: number): string {
  const colors = [
    'rgb(33, 158, 188,1)',
    'rgb(144, 190, 109,1)',
    'rgb(255, 99, 132,1)',
    'rgb(54, 255, 235,1)',
    'rgb(248, 150, 30,1)',
    'rgb(67, 170, 139,1)',
    'rgb(249, 65, 68,1)',
  ];
  return colors[index % colors.length];
}
