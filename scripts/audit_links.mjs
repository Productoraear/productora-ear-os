import fs from 'fs';
import path from 'path';

const SRC_APP_DIR = path.resolve('src/app');
const SRC_DIR = path.resolve('src');

// Helper to recursively find files matching extension
function getFiles(dir, ext, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, ext, fileList);
    } else if (file.endsWith(ext)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Convert app routing filepath to normalized Next.js route path pattern
function filepathToRoute(filepath) {
  const relative = path.relative(SRC_APP_DIR, filepath);
  let route = relative
    .replace(/\\/g, '/')
    .replace(/\/page\.tsx$/, '')
    .replace(/\/route\.ts$/, '')
    .replace(/^page\.tsx$/, '')
    .replace(/^route\.ts$/, '');

  // Remove Next.js route groups like (public), (nexus), (admin)
  route = route
    .split('/')
    .filter(segment => !segment.startsWith('(') || !segment.endsWith(')'))
    .join('/');

  return '/' + route;
}

// Compile route path patterns to regexes
function routeToRegex(routePattern) {
  // Escape regex special chars first
  let regexStr = routePattern.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  // Replace catch-all: \[ \. \. \. ... \] -> (?:/.*)?
  regexStr = regexStr.replace(/\\\[\\\.\\\.\\\.[^\\\]]+\\\]/g, '(?:/.*)?');
  
  // Replace standard params: \[ ... \] -> [^/]+
  regexStr = regexStr.replace(/\\\[[^\\\]]+\\\]/g, '[^/]+');

  return new RegExp('^' + regexStr + '$');
}

// Gather all pages and API routes
const pageFiles = [
  ...getFiles(SRC_APP_DIR, 'page.tsx'),
  ...getFiles(SRC_APP_DIR, 'route.ts')
];

const validRoutes = pageFiles.map(filepathToRoute);

// Next.js dynamic metadata route conventions
if (fs.existsSync(path.join(SRC_APP_DIR, 'sitemap.ts')) || fs.existsSync(path.join(SRC_APP_DIR, 'sitemap.js'))) {
  validRoutes.push('/sitemap.xml');
}
if (fs.existsSync(path.join(SRC_APP_DIR, 'robots.ts')) || fs.existsSync(path.join(SRC_APP_DIR, 'robots.js'))) {
  validRoutes.push('/robots.txt');
}

const routePatterns = validRoutes.map(route => ({
  pattern: route,
  regex: routeToRegex(route)
}));

console.log(`🔍 [ROUTER ENGINE] Registered ${validRoutes.length} valid route patterns.`);

// Scan all source files for href declarations
const sourceFiles = [
  ...getFiles(SRC_DIR, '.tsx'),
  ...getFiles(SRC_DIR, '.ts')
];

const hrefRegex = /href=(["'])([^"'\s>#?]+)\1/g;
const findings = [];

for (const filepath of sourceFiles) {
  // Skip this audit script itself
  if (filepath.endsWith('audit_links.mjs')) continue;

  const content = fs.readFileSync(filepath, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const rawLink = match[2];

    // Filter out external, mailto, tel, whatsapp, dynamic templates, state variables and anchor hashes
    if (
      rawLink.startsWith('http://') ||
      rawLink.startsWith('https://') ||
      rawLink.startsWith('mailto:') ||
      rawLink.startsWith('tel:') ||
      rawLink.startsWith('wa.me') ||
      rawLink.startsWith('//') ||
      rawLink.startsWith('#') ||
      rawLink.includes('${') || // skip dynamic templates
      rawLink.startsWith('javascript:') ||
      rawLink === '/'
    ) {
      continue;
    }

    findings.push({
      file: path.relative(process.cwd(), filepath),
      link: rawLink
    });
  }
}

console.log(`📊 [SCAN CORE] Extracted ${findings.length} internal links to validate.`);

// Validate links against routing map
const brokenLinks = [];
const verifiedLinks = new Set();

for (const finding of findings) {
  let isMatched = false;
  // Normalize link path (e.g. trailing slash removal)
  let testPath = finding.link;
  if (testPath.endsWith('/') && testPath.length > 1) {
    testPath = testPath.slice(0, -1);
  }

  for (const route of routePatterns) {
    if (route.regex.test(testPath)) {
      isMatched = true;
      break;
    }
  }

  if (!isMatched) {
    brokenLinks.push(finding);
  } else {
    verifiedLinks.add(finding.link);
  }
}

console.log(`✅ [AUDIT FINISHED] Verified ${verifiedLinks.size} unique internal links.`);

if (brokenLinks.length > 0) {
  console.log(`❌ [CRITICAL 404 DETECTED] Found ${brokenLinks.length} potentially broken links:\n`);
  const grouped = {};
  for (const item of brokenLinks) {
    if (!grouped[item.link]) grouped[item.link] = [];
    grouped[item.link].push(item.file);
  }

  for (const [link, files] of Object.entries(grouped)) {
    console.log(`🚩 Broken Link: "${link}"`);
    console.log(`   Referenced in:`);
    files.forEach(f => console.log(`    - ${f}`));
    console.log('');
  }
  process.exit(1);
} else {
  console.log(`🟢 [S-CLASS CERTIFIED] Zero broken links detected! All hrefs are mapped to active routes.`);
  process.exit(0);
}
