#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');

const ROOT = process.cwd();

function fail(message) {
  throw new Error(`docs-sync contract: ${message}`);
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath));
}

function readText(relativePath) {
  return read(relativePath).toString('utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function yamlEscape(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function expectedFrontMatter(entry) {
  const lines = [
    '---',
    'layout: book',
    `order: ${entry.order}`,
    `title: "${yamlEscape(entry.title)}"`,
  ];
  if (entry.permalink) lines.push(`permalink: ${entry.permalink}`);
  lines.push('---', '');
  return lines.join('\n');
}

function configuredEntries(config) {
  const structure = config.structure || {};
  return [
    structure.index,
    structure.introduction,
    ...(structure.chapters || []),
    ...(structure.appendices || []),
    structure.afterword,
  ].filter(Boolean);
}

function expectedNavigation(config) {
  const structure = config.structure || {};
  const lines = [];
  const appendItems = (key, items) => {
    lines.push(`${key}:`);
    for (const item of items) {
      lines.push(`  - title: "${yamlEscape(item.title)}"`);
      lines.push(`    path: "${yamlEscape(item.navPath)}"`);
    }
    lines.push('');
  };

  if (structure.introduction) appendItems('introduction', [structure.introduction]);
  appendItems('chapters', structure.chapters || []);
  appendItems('appendices', structure.appendices || []);
  if (structure.afterword) {
    lines.push('afterword:');
    lines.push(`  - title: "${yamlEscape(structure.afterword.title)}"`);
    lines.push(`    path: "${yamlEscape(structure.afterword.navPath)}"`);
  }
  return `${lines.join('\n')}\n`;
}

function collectSourceAssets(relativeDirectory) {
  const assets = [];
  const directory = path.join(ROOT, relativeDirectory);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      assets.push(...collectSourceAssets(relativePath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() !== '.md') {
      assets.push(relativePath);
    }
  }
  return assets;
}

function checkPage(entry) {
  if (!exists(entry.srcPath)) fail(`configured source page is missing: ${entry.srcPath}`);
  if (!exists(entry.docsPath)) fail(`generated page is missing: ${entry.docsPath}`);
  const expected = `${expectedFrontMatter(entry)}${readText(entry.srcPath).trimStart()}`;
  if (readText(entry.docsPath) !== expected) {
    fail(`generated page differs from canonical source: ${entry.docsPath}`);
  }
}

function checkAsset(sourcePath) {
  const docsPath = sourcePath.replace(/^src\//, 'docs/');
  if (!exists(docsPath)) fail(`generated asset is missing: ${docsPath}`);
  if (!read(sourcePath).equals(read(docsPath))) {
    fail(`generated asset differs from canonical source: ${docsPath}`);
  }
}

function main() {
  const config = JSON.parse(readText('book-config.json'));
  const formatterConfig = JSON.parse(readText('book-formatter-config.json'));
  if (!isDeepStrictEqual(formatterConfig.ux, config.ux)) {
    fail('book-formatter-config.json ux differs from book-config.json');
  }
  if (!isDeepStrictEqual(formatterConfig.structure, config.structure)) {
    fail('book-formatter-config.json structure differs from book-config.json');
  }
  const entries = configuredEntries(config);
  for (const entry of entries) checkPage(entry);

  const navigationPath = 'docs/_data/navigation.yml';
  if (!exists(navigationPath)) fail(`generated navigation is missing: ${navigationPath}`);
  if (readText(navigationPath) !== expectedNavigation(config)) {
    fail(`generated navigation differs from book-config.json: ${navigationPath}`);
  }

  const assets = collectSourceAssets('src').sort();
  for (const asset of assets) checkAsset(asset);

  console.log(`✅ Docs sync contract passed (${entries.length} configured pages, ${assets.length} source assets).`);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
