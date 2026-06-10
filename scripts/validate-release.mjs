import { access, readFile, readdir } from 'node:fs/promises';

const required = ['release/index.html', 'release/manifest.json'];
for (const file of required) {
  await access(file);
}

const html = await readFile('release/index.html', 'utf8');
if (!html.includes('type="module"')) {
  throw new Error('release/index.html missing module script');
}

const assets = await readdir('release/assets');
const jsFiles = assets.filter((file) => file.endsWith('.js'));
if (!jsFiles.length) throw new Error('release/assets contains no JavaScript bundle');
const js = (await Promise.all(jsFiles.map((file) => readFile(`release/assets/${file}`, 'utf8')))).join('\n');
for (const text of ['100 Days Games', 'View prompt', 'Build time', 'Theme']) {
  if (!js.includes(text)) throw new Error(`release bundle missing ${text}`);
}
console.log('release validation passed');
