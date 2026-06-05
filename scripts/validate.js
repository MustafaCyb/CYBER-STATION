import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(msg, error = false) {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logFile = path.join(logDir, 'validate.log');
  const line = `[${new Date().toISOString()}] ${error ? 'FAIL: ' : 'PASS: '}${msg}\n`;
  fs.appendFileSync(logFile, line);
  if (error) {
    console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
  } else {
    console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
  }
}

const PROTECTED_TERMS = [
  'EternalBlue', 'DoublePulsar', 'DLL', 'Snort', 'IDS/IPS', 'OSINT', 'SQLMap', 
  'CVE', 'SMB', 'WinAPI', 'Evilginx', 'AiTM', 'MFA', 'Maltego', 'Shodan', 
  'Flask', 'customtkinter', 'BeautifulSoup', 'Nuclei', 'Volatility', 
  'FTK Imager', 'Python', 'GitHub', 'Astro', 'CYBER STATION'
];

// Helper to parse simple frontmatter
function parseFrontmatter(content) {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(fmRegex);
  if (!match) return { data: {}, body: content };

  const fmText = match[1];
  const body = content.substring(match[0].length);
  const data = {};

  fmText.split(/\r?\n/).forEach(line => {
    const firstColon = line.indexOf(':');
    if (firstColon === -1) return;
    const key = line.substring(0, firstColon).trim();
    let val = line.substring(firstColon + 1).trim();
    // Strip quotes
    val = val.replace(/^['"]|['"]$/g, '');
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (!isNaN(val) && val !== '') val = Number(val);
    data[key] = val;
  });

  return { data, body };
}

function checkFilePair(type, slug) {
  const enPath = path.join(process.cwd(), 'src', 'content', type, 'en', `${slug}.md`);
  const arPath = path.join(process.cwd(), 'src', 'content', type, 'ar', `${slug}.md`);

  let pairHasError = false;

  if (!fs.existsSync(arPath)) {
    log(`[${type}/${slug}] Arabic translation file is missing at: ${path.relative(process.cwd(), arPath)}`, true);
    return true;
  }

  const enContent = fs.readFileSync(enPath, 'utf-8');
  const arContent = fs.readFileSync(arPath, 'utf-8');

  const enParsed = parseFrontmatter(enContent);
  const arParsed = parseFrontmatter(arContent);

  // 1. Verify critical frontmatter matches
  const criticalKeys = ['itemSlug', 'repo', 'status', 'featured', 'order', 'session', 'date', 'sourceRepo', 'sourceFolder'];
  criticalKeys.forEach(key => {
    if (enParsed.data[key] !== undefined || arParsed.data[key] !== undefined) {
      if (enParsed.data[key] !== arParsed.data[key]) {
        log(`[${type}/${slug}] Frontmatter key "${key}" mismatch: EN="${enParsed.data[key]}" vs AR="${arParsed.data[key]}"`, true);
        pairHasError = true;
      }
    }
  });

  // 2. Verify cover image exists
  ['en', 'ar'].forEach((lang) => {
    const parsed = lang === 'en' ? enParsed : arParsed;
    const coverPath = parsed.data.cover;
    if (coverPath) {
      const fullCoverPath = path.join(process.cwd(), 'public', coverPath);
      if (!fs.existsSync(fullCoverPath)) {
        log(`[${type}/${slug}] Cover image in ${lang.toUpperCase()} metadata not found at: ${path.relative(process.cwd(), fullCoverPath)}`, true);
        pairHasError = true;
      }
    }
  });

  // 3. Verify brand name is not translated to Arabic (Fusha brand checks)
  const forbiddenBrandArabic = ['محطة السايبر', 'محطة السيبير', 'محطة أمن المعلومات'];
  forbiddenBrandArabic.forEach(term => {
    if (arContent.includes(term)) {
      log(`[${type}/${slug}] Arabic translation contains forbidden brand translation "${term}". Brand must remain "CYBER STATION".`, true);
      pairHasError = true;
    }
  });

  // 4. Verify English technical terms are preserved in English script in the body
  PROTECTED_TERMS.forEach(term => {
    const enRegex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (enRegex.test(enParsed.body)) {
      const arRegex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      if (!arRegex.test(arParsed.body)) {
        log(`[${type}/${slug}] Arabic body is missing the English term "${term}". It must remain in English characters.`, true);
        pairHasError = true;
      }
    }
  });

  return pairHasError;
}

function main() {
  log('Starting validation scan...');
  let totalErrors = 0;
  
  const contentTypes = ['projects', 'articles', 'presentations'];

  contentTypes.forEach(type => {
    const enDir = path.join(process.cwd(), 'src', 'content', type, 'en');
    if (!fs.existsSync(enDir)) return;

    const files = fs.readdirSync(enDir).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      const slug = path.basename(file, '.md');
      const hasError = checkFilePair(type, slug);
      if (hasError) {
        totalErrors++;
      }
    });
  });

  if (totalErrors > 0) {
    log(`Validation failed with ${totalErrors} error(s). Please review log.`, true);
    process.exit(1);
  } else {
    log('Validation succeeded! All translations are complete, metadata matches, and technical terms are preserved.');
    process.exit(0);
  }
}

main();
