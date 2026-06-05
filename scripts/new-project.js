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
  console.log('\n--- Create New Project Scaffolding for CYBER STATION ---\n');

  const title = await ask('Project Title (English name stays in both locales)');
  
  const defaultSlug = slugify(title);
  const slug = await ask('Slug/Folder name', defaultSlug);
  
  const descEn = await ask('Description (EN)');
  const descAr = await ask('Description (AR)');
  
  const tagsEnInput = await ask('Tags (EN, comma separated)');
  const tagsArInput = await ask('Tags (AR, comma separated)');

  const tagsEn = tagsEnInput.split(',').map(t => `"${t.trim()}"`).join(', ');
  const tagsAr = tagsArInput.split(',').map(t => `"${t.trim()}"`).join(', ');

  const repo = await ask('Repo URL', `https://github.com/MustafaCyb/${slug}`);
  const status = await ask('Status', 'Completed');
  
  const safetyEn = await ask('Safety Classification (EN)', 'Educational / Lab Simulation');
  const safetyAr = await ask('Safety Classification (AR)', 'تعليمي / محاكاة مختبر');
  
  const techInput = await ask('Tech Stack (comma separated, e.g. python, flask, markdown)');
  const tech = techInput.split(',').map(t => `"${t.trim()}"`).join(', ');

  const order = await ask('Order (displays in this position)', '1');

  // Load templates
  const templatePathEn = path.join(__dirname, 'templates', 'project-en.md');
  const templatePathAr = path.join(__dirname, 'templates', 'project-ar.md');

  if (!fs.existsSync(templatePathEn) || !fs.existsSync(templatePathAr)) {
    console.error('Error: Template files not found in scripts/templates/');
    rl.close();
    return;
  }

  let contentEn = fs.readFileSync(templatePathEn, 'utf-8');
  let contentAr = fs.readFileSync(templatePathAr, 'utf-8');

  // Replace placeholders
  contentEn = contentEn
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DESCRIPTION}}/g, descEn)
    .replace(/{{SLUG}}/g, slug)
    .replace(/{{TAGS}}/g, tagsEn)
    .replace(/{{REPO}}/g, repo)
    .replace(/{{STATUS}}/g, status)
    .replace(/{{SAFETY}}/g, safetyEn)
    .replace(/{{TECH}}/g, tech)
    .replace(/{{ORDER}}/g, order);

  contentAr = contentAr
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DESCRIPTION_AR}}/g, descAr)
    .replace(/{{SLUG}}/g, slug)
    .replace(/{{TAGS_AR}}/g, tagsAr)
    .replace(/{{REPO}}/g, repo)
    .replace(/{{STATUS}}/g, status)
    .replace(/{{SAFETY_AR}}/g, safetyAr)
    .replace(/{{TECH}}/g, tech)
    .replace(/{{ORDER}}/g, order);

  // Write content
  const targetDirEn = path.join(__dirname, '..', 'src', 'content', 'projects', 'en');
  const targetDirAr = path.join(__dirname, '..', 'src', 'content', 'projects', 'ar');
  const imageDir = path.join(__dirname, '..', 'public', 'images', 'projects', slug);

  fs.mkdirSync(targetDirEn, { recursive: true });
  fs.mkdirSync(targetDirAr, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });

  const fileEn = path.join(targetDirEn, `${slug}.md`);
  const fileAr = path.join(targetDirAr, `${slug}.md`);

  fs.writeFileSync(fileEn, contentEn);
  fs.writeFileSync(fileAr, contentAr);

  console.log(`\n\x1b[32mSuccess!\x1b[0m Bilingual project created:`);
  console.log(`- EN: ${path.relative(process.cwd(), fileEn)}`);
  console.log(`- AR: ${path.relative(process.cwd(), fileAr)}`);
  console.log(`- Image dir: ${path.relative(process.cwd(), imageDir)}/`);
  console.log(`\nNext Steps:`);
  console.log(`1. Place the cover image (cover.png) in the Image directory.`);
  console.log(`2. Write project specifications or features in the markdown files.`);
  
  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
});
