import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultVal = '') {
  return new Promise((resolve) => {
    const query = defaultVal ? `${question} [${defaultVal}]: ` : `${question}: `;
    rl.question(query, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log('\n--- Create New Article Scaffolding for CYBER STATION ---\n');

  const titleEn = await ask('Article Title (EN)');
  const titleAr = await ask('Article Title (AR)');
  
  const defaultSlug = slugify(titleEn);
  const slug = await ask('Slug/Folder name', defaultSlug);
  
  const descEn = await ask('Description (EN)');
  const descAr = await ask('Description (AR)');
  
  const tagsEnInput = await ask('Tags (EN, comma separated)');
  const tagsArInput = await ask('Tags (AR, comma separated)');

  const tagsEn = tagsEnInput.split(',').map(t => `"${t.trim()}"`).join(', ');
  const tagsAr = tagsArInput.split(',').map(t => `"${t.trim()}"`).join(', ');
  
  const today = new Date().toISOString().split('T')[0];

  // Load templates
  const templatePathEn = path.join(__dirname, 'templates', 'article-en.md');
  const templatePathAr = path.join(__dirname, 'templates', 'article-ar.md');

  if (!fs.existsSync(templatePathEn) || !fs.existsSync(templatePathAr)) {
    console.error('Error: Template files not found in scripts/templates/');
    rl.close();
    return;
  }

  let contentEn = fs.readFileSync(templatePathEn, 'utf-8');
  let contentAr = fs.readFileSync(templatePathAr, 'utf-8');

  // Replace placeholders
  contentEn = contentEn
    .replace(/{{TITLE}}/g, titleEn)
    .replace(/{{DESCRIPTION}}/g, descEn)
    .replace(/{{SLUG}}/g, slug)
    .replace(/{{DATE}}/g, today)
    .replace(/{{TAGS}}/g, tagsEn);

  contentAr = contentAr
    .replace(/{{TITLE_AR}}/g, titleAr)
    .replace(/{{DESCRIPTION_AR}}/g, descAr)
    .replace(/{{SLUG}}/g, slug)
    .replace(/{{DATE}}/g, today)
    .replace(/{{TAGS_AR}}/g, tagsAr);

  // Write content
  const targetDirEn = path.join(__dirname, '..', 'src', 'content', 'articles', 'en');
  const targetDirAr = path.join(__dirname, '..', 'src', 'content', 'articles', 'ar');
  const imageDir = path.join(__dirname, '..', 'public', 'images', 'articles', slug);

  fs.mkdirSync(targetDirEn, { recursive: true });
  fs.mkdirSync(targetDirAr, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });

  const fileEn = path.join(targetDirEn, `${slug}.md`);
  const fileAr = path.join(targetDirAr, `${slug}.md`);

  fs.writeFileSync(fileEn, contentEn);
  fs.writeFileSync(fileAr, contentAr);

  console.log(`\n\x1b[32mSuccess!\x1b[0m Bilingual article created:`);
  console.log(`- EN: ${path.relative(process.cwd(), fileEn)}`);
  console.log(`- AR: ${path.relative(process.cwd(), fileAr)}`);
  console.log(`- Image dir: ${path.relative(process.cwd(), imageDir)}/`);
  console.log(`\nNext Steps:`);
  console.log(`1. Place the cover image (cover.png) in the Image directory.`);
  console.log(`2. Write your content in the markdown files.`);
  
  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
});
