#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const APPENDIX_ID = 'appendix-e';
const APPENDIX_ROUTE = '/appendices/appendix-e/';
const CHAPTER_TITLES = {
  chapter00: '第0章：コンテナ基礎ダイジェスト',
  chapter01: '第1章：Kubernetesの全体像',
  chapter02: '第2章：ローカル環境とkubectl',
  chapter03: '第3章：YAML基礎とメタデータ設計',
  chapter04: '第4章：Pod設計',
  chapter05: '第5章：Deploymentとロールアウト',
  chapter06: '第6章：Serviceと名前解決',
  chapter07: '第7章：Ingress',
  chapter08: '第8章：ConfigMapとSecret',
  chapter09: '第9章：ストレージ基礎',
  chapter10: '第10章：基本トラブルシューティング',
};
const FIGURES = [
  { chapter: 'chapter00', filename: 'ch00-podman-version-01.png', anchor: 'figure-ch00-podman-version-01', title: 'podman version（例）' },
  { chapter: 'chapter00', filename: 'ch00-nginx-http-02.png', anchor: 'figure-ch00-nginx-http-02', title: 'Nginx の起動と疎通確認（例）' },
  { chapter: 'chapter01', filename: 'ch01-kubectl-explore-01.png', anchor: 'figure-ch01-kubectl-explore-01', title: 'kubectl で API を探索する（例）' },
  { chapter: 'chapter02', filename: 'ch02-kind-bootstrap-01.png', anchor: 'figure-ch02-kind-bootstrap-01', title: 'kind クラスタの作成と確認（例）' },
  { chapter: 'chapter03', filename: 'ch03-kubectl-show-labels-01.png', anchor: 'figure-ch03-kubectl-show-labels-01', title: 'labels の確認（例）' },
  { chapter: 'chapter04', filename: 'ch04-kubectl-describe-pod-01.png', anchor: 'figure-ch04-kubectl-describe-pod-01', title: 'kubectl describe pod（例）' },
  { chapter: 'chapter05', filename: 'ch05-rollout-rs-01.png', anchor: 'figure-ch05-rollout-rs-01', title: 'ロールアウトと ReplicaSet の切り替え（例）' },
  { chapter: 'chapter06', filename: 'ch06-service-dns-01.png', anchor: 'figure-ch06-service-dns-01', title: 'Service と DNS の確認（例）' },
  { chapter: 'chapter07', filename: 'ch07-ingress-nginx-01.png', anchor: 'figure-ch07-ingress-nginx-01', title: 'ingress-nginx の導入と Host ルーティング（歴史的な学習例）' },
  { chapter: 'chapter08', filename: 'ch08-configmap-secret-01.png', anchor: 'figure-ch08-configmap-secret-01', title: 'ConfigMap/Secret の注入（例）' },
  { chapter: 'chapter09', filename: 'ch09-pvc-mount-01.png', anchor: 'figure-ch09-pvc-mount-01', title: 'PVC の作成とマウント（例）' },
  { chapter: 'chapter10', filename: 'ch10-service-selector-debug-01.png', anchor: 'figure-ch10-service-selector-debug-01', title: 'Service の selector 不整合の切り分け（例）' },
];

function fail(message) {
  throw new Error(`figure-index contract: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function collectFiles(relativeDirectory) {
  const directory = path.join(ROOT, relativeDirectory);
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files;
}

function pngReferences(markdown) {
  const matches = [];
  const imagePattern = /!\[([^\]]*)\]\(([^)]+\.png)(?:#[^)]+)?\)/g;
  let match;
  while ((match = imagePattern.exec(markdown)) !== null) {
    matches.push({ alt: match[1], target: match[2] });
  }
  return matches;
}

function allOccurrences(text, needle) {
  return text.split(needle).length - 1;
}

function checkConfiguration(config) {
  const modules = config.ux && config.ux.modules;
  assert(modules && modules.figureIndex === true, 'ux.modules.figureIndex must be true for the published figure index');

  const appendices = config.structure && config.structure.appendices;
  assert(Array.isArray(appendices), 'structure.appendices must be configured');
  const appendix = appendices.find((item) => item.id === APPENDIX_ID);
  assert(appendix, `${APPENDIX_ID} route must be configured when figureIndex is true`);
  assert(appendix.navPath === APPENDIX_ROUTE, `${APPENDIX_ID}.navPath must be ${APPENDIX_ROUTE}`);
  assert(appendix.title === '付録E：図版索引', `${APPENDIX_ID}.title must identify the reader-facing figure index`);
  assert(appendix.order === 17, `${APPENDIX_ID}.order must place it after Appendix D`);
  assert(appendix.srcPath === 'src/appendices/appendix-e/index.md', `${APPENDIX_ID}.srcPath must identify the canonical source page`);
  assert(appendix.docsPath === 'docs/appendices/appendix-e/index.md', `${APPENDIX_ID}.docsPath must identify the generated page`);
  assert(exists(appendix.srcPath), `${APPENDIX_ID} source page is missing`);
  assert(exists(appendix.docsPath), `${APPENDIX_ID} generated page is missing`);

  const appendixDIndex = appendices.findIndex((item) => item.id === 'appendix-d');
  const appendixEIndex = appendices.findIndex((item) => item.id === APPENDIX_ID);
  assert(appendixDIndex >= 0 && appendixEIndex === appendixDIndex + 1, 'Appendix E must immediately follow Appendix D');
  assert(config.structure.afterword && config.structure.afterword.order === 18, 'afterword must immediately follow Appendix E');
}

function checkSourceInventory() {
  const expectedReferences = FIGURES.map((figure) => `chapters/${figure.chapter}/images/${figure.filename}`);
  const actualReferences = [];

  for (const file of collectFiles('src').filter((candidate) => candidate.endsWith('.md')).sort()) {
    const markdown = read(file);
    for (const reference of pngReferences(markdown)) {
      const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(file.replace(/^src\//, '')), reference.target));
      actualReferences.push(normalized);
    }
  }

  assert(JSON.stringify(actualReferences) === JSON.stringify(expectedReferences), `PNG markdown references must be the exact 12-item inventory in chapter order; found ${JSON.stringify(actualReferences)}`);

  const actualPngFiles = collectFiles('src')
    .filter((candidate) => candidate.toLowerCase().endsWith('.png'))
    .sort();
  const expectedPngFiles = expectedReferences.map((reference) => `src/${reference}`).sort();
  assert(JSON.stringify(actualPngFiles) === JSON.stringify(expectedPngFiles), `source PNG files must be one-to-one with referenced figures; found ${JSON.stringify(actualPngFiles)}`);
}

function checkAnchors() {
  const sourcePages = collectFiles('src').filter((candidate) => candidate.endsWith('.md'));
  const docsPages = collectFiles('docs').filter((candidate) => candidate.endsWith('.md'));
  const sourceText = sourcePages.map(read).join('\n');
  const docsText = docsPages.map(read).join('\n');

  for (const figure of FIGURES) {
    const sourcePage = `src/chapters/${figure.chapter}/index.md`;
    const docsPage = `docs/chapters/${figure.chapter}/index.md`;
    const image = `![${figure.title}](./images/${figure.filename})`;
    const anchor = `<a id="${figure.anchor}"></a>`;
    const immediateAnchorPattern = new RegExp(`${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n\\s*${image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

    assert(immediateAnchorPattern.test(read(sourcePage)), `stable anchor must appear immediately before ${sourcePage} image ${figure.filename}`);
    assert(immediateAnchorPattern.test(read(docsPage)), `generated stable anchor must appear immediately before ${docsPage} image ${figure.filename}`);
    assert(allOccurrences(sourceText, anchor) === 1, `source anchor must be globally unique: ${figure.anchor}`);
    assert(allOccurrences(docsText, anchor) === 1, `generated anchor must be globally unique: ${figure.anchor}`);
  }
}

function checkIndexPage() {
  const index = read('src/appendices/appendix-e/index.md');
  const headings = [...index.matchAll(/^### 図E-(\d{2})：(.+)$/gm)];
  assert(headings.length === FIGURES.length, `index must contain exactly ${FIGURES.length} figure entries, not omitted, unreferenced, or planned entries`);

  headings.forEach((heading, indexPosition) => {
    const figure = FIGURES[indexPosition];
    const number = String(indexPosition + 1).padStart(2, '0');
    assert(heading[1] === number, `index entry ${indexPosition + 1} must be 図E-${number}`);
    assert(heading[2] === figure.title, `index entry ${number} title must match the referenced PNG alt text`);
    const sectionEnd = indexPosition + 1 < headings.length ? headings[indexPosition + 1].index : index.length;
    const section = index.slice(heading.index, sectionEnd);
    const directLink = `../../chapters/${figure.chapter}/#${figure.anchor}`;
    const precedingContent = index.slice(0, heading.index);
    assert(precedingContent.lastIndexOf(`## ${CHAPTER_TITLES[figure.chapter]}`) >= 0, `index entry ${number} must appear under ${CHAPTER_TITLES[figure.chapter]}`);
    assert(section.includes(`](${directLink})`), `index entry ${number} must directly link to ${figure.anchor}`);
    assert(section.includes(`\`${figure.filename}\``), `index entry ${number} must name ${figure.filename}`);
    assert(/- \*\*目的\*\*: .+/.test(section), `index entry ${number} must include a purpose`);
    assert(/- \*\*確認の観点\*\*: .+/.test(section), `index entry ${number} must include inspection guidance`);
  });

  const docsIndex = read('docs/appendices/appendix-e/index.md');
  assert(docsIndex.endsWith(index), 'generated figure index page must match canonical src content');
}

function checkReaderNavigation() {
  const topLink = '[付録E：図版索引](appendices/appendix-e/)';
  assert(read('src/index.md').includes(topLink), 'canonical top page must link to Appendix E');
  assert(read('docs/index.md').includes(topLink), 'generated top page must link to Appendix E');

  const navigation = read('docs/_data/navigation.yml');
  const appendixD = '  - title: "付録D：実務チェックリストとトラブルシュート導線"\n    path: "/appendices/appendix-d/"';
  const appendixE = '  - title: "付録E：図版索引"\n    path: "/appendices/appendix-e/"';
  assert(allOccurrences(navigation, appendixE) === 1, 'sidebar must contain exactly one Appendix E item');
  assert(navigation.indexOf(appendixD) < navigation.indexOf(appendixE), 'sidebar must place Appendix E after Appendix D');
}

function main() {
  const config = JSON.parse(read('book-config.json'));
  checkConfiguration(config);
  checkSourceInventory();
  checkAnchors();
  checkIndexPage();
  checkReaderNavigation();
  console.log(`✅ Figure index contract passed: ${FIGURES.length} referenced PNGs, unique anchors, route, navigation, and src/docs generation verified.`);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
