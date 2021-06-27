export function cellNameToCellPosition(name: string): number {
  const nameCharCode = name.charCodeAt(0);
  const nameNumber = Number(name[1]);
  return (nameNumber - 1) * 8 + Math.abs(nameCharCode - 104);
}