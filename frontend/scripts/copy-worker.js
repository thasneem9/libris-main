import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');
const dest = path.resolve(__dirname, '../public/pdf.worker.min.js');

async function copyWorker() {
  try {
    await fs.copyFile(src, dest);
    console.log('pdf.worker.min.js copied successfully');
  } catch (err) {
    console.error('Failed to copy pdf.worker.min.js:', err);
    process.exit(1);
  }
}

copyWorker();
