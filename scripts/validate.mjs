import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localeDirectory = path.join(root, 'en-US');
const errors = [];

function report(file, message) {
  errors.push(`${file}: ${message}`);
}

function parseFrontmatter(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n\r?\n/);
  if (!match) {
    report(file, 'missing YAML frontmatter');
    return { metadata: {}, body: source };
  }

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-z][a-z0-9_]*):\s+"([^"]*)"$/);
    if (field) metadata[field[1]] = field[2];
  }

  return { metadata, body: source.slice(match[0].length) };
}

const entries = await readdir(localeDirectory, { withFileTypes: true });
const publishedFiles = entries
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      entry.name !== 'README.md' &&
      !entry.name.startsWith('_')
  )
  .map((entry) => entry.name)
  .toSorted();

for (const file of publishedFiles) {
  if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(file)) {
    report(file, 'published filenames must be lowercase and hyphenated');
  }

  const source = await readFile(path.join(localeDirectory, file), 'utf8');
  const { metadata, body } = parseFrontmatter(source, file);

  if (metadata.document_type !== 'reference') {
    report(file, 'document_type must be "reference"');
  }
  if (!metadata.description) {
    report(file, 'description is required');
  }
  if (!/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(metadata.last_updated ?? '')) {
    report(file, 'last_updated must use YYYY-MM-DD');
  }
  if (!/^#\s+\S.+$/m.test(body)) {
    report(file, 'a Markdown H1 title is required');
  }
}

if (publishedFiles.length === 0) {
  errors.push('No published legal documents found.');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${publishedFiles.length} published legal documents.`);
