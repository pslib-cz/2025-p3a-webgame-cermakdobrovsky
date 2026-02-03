const buildingGlob = import.meta.glob('/public/images/buildings/**/*', { eager: false });
const availableFiles = Object.keys(buildingGlob);
const imageOverrides = new Map<string, string>();
export const setFixedImageForBuilding = (x: number, y: number, url: string) => {
  imageOverrides.set(`${x},${y}`, url);
};
export const getBuildingImageUrl = (originalUrl: string, x?: number, y?: number) => {
  if (x !== undefined && y !== undefined) {
    const key = `${x},${y}`;
    if (imageOverrides.has(key)) return imageOverrides.get(key)!;
  }
  let pathWithoutExt = originalUrl.replace(/\.[^/.]+$/, "");
  if (pathWithoutExt.startsWith('/')) pathWithoutExt = pathWithoutExt.slice(1);
  const targetPrefix = `/public/${pathWithoutExt}/`;
  const candidates = availableFiles.filter(path => path.startsWith(targetPrefix));
  if (candidates.length > 0) {
    let index = 0;
    if (x !== undefined && y !== undefined) {
      const hash = Math.abs((x * 18397) + (y * 20483));
      index = hash % candidates.length;
    } 
    else index = Math.floor(Math.random() * candidates.length);
    return candidates[index].replace('/public', '');
  }
  return originalUrl;
};