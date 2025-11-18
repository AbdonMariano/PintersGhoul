// Actualiza el array LocalImageModules en src/constants/Images.ts con los archivos actuales en assets/images
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const imagesDir = path.join(projectRoot, 'assets', 'images');
const imagesTsPath = path.join(projectRoot, 'src', 'constants', 'Images.ts');

function getImageFiles() {
  const all = fs.readdirSync(imagesDir, { withFileTypes: true });
  const files = all
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => !name.startsWith('_filelist'))
    .sort((a, b) => a.localeCompare(b));
  return files;
}

function buildRequireLines(files) {
  const prefix = "  require('../../assets/images/";
  const suffix = "'),";
  return files.map((f) => `${prefix}${f}${suffix}`).join('\n');
}

function updateImagesTs(files) {
  const ts = fs.readFileSync(imagesTsPath, 'utf8');
  const startMarker = 'export const LocalImageModules: number[] = [';
  const startIdx = ts.indexOf(startMarker);
  if (startIdx === -1) throw new Error('No se encontró el inicio del array LocalImageModules');
  const afterStartIdx = startIdx + startMarker.length;

  // Encontrar el cierre del array "]\n;" buscando el primer \n]; después del inicio
  const endIdx = ts.indexOf('\n];', afterStartIdx);
  if (endIdx === -1) throw new Error('No se encontró el cierre del array LocalImageModules');

  const before = ts.slice(0, afterStartIdx) + '\n';
  const after = ts.slice(endIdx + 3); // incluye \n]; por separado

  const body = buildRequireLines(files);
  const newContent = `${before}${body}\n];${after}`;

  fs.writeFileSync(imagesTsPath, newContent, 'utf8');
}

function main() {
  const files = getImageFiles();
  if (files.length === 0) {
    console.error('No se encontraron imágenes en', imagesDir);
    process.exit(1);
  }
  updateImagesTs(files);
  console.log('Actualizado LocalImageModules con', files.length, 'imágenes.');
}

if (require.main === module) {
  try { main(); } catch (e) { console.error(e); process.exit(1); }
}
