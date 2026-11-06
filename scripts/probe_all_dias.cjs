const https = require('https');

const urls = [
  '/dia-3/', '/dia-4/', '/dia-5/', '/dia-6/', '/dia-7/', '/dia-8/', '/dia-9/',
  '/dia-10/', '/dia-11/', '/dia-12/', '/dia-13/', '/dia-14/', '/dia-15/', '/dia-16/',
  '/dia-17/', '/dia-18/', '/dia-19/', '/dia-20/', '/dia-21/', '/dia-22/', '/dia-23/',
  '/dia-24/', '/dia-25/', '/dia-26/', '/dia-27/', '/dia-28/', '/dia-29/', '/dia-30/',
  '/dia-31/', '/dia-32/', '/dia-33/', '/dia-34/', '/dia-35/', '/dia-36/', '/dia-37/',
  '/dia-38/', '/dia-38-revisar/', '/dia-39/', '/dia-40/',
  '/dias-1-al-30/',
  '/introduccion-99-dias-haciendo-clic/',
  '/landing-guia-artistas/',
  '/cuestionario-artistas-emergentes/'
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    const req = https.get('https://yellowgreen-sheep-648022.hostingersite.com' + path, {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      let len = 0;
      res.on('data', chunk => len += chunk.length);
      res.on('end', () => resolve({ path, status: res.statusCode, len }));
    });
    req.on('error', err => resolve({ path, error: err.message }));
  });
}

(async () => {
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(res.path, res.status, res.len || res.error);
  }
})();

