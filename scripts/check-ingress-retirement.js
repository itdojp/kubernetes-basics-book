#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGETS = [
  'src/introduction/index.md',
  'src/chapters/chapter07/index.md',
  'src/appendices/appendix-c/index.md',
  'src/appendices/appendix-e/index.md',
];
const REQUIRED_MARKERS = [
  '2026年3月',
  'retired',
  'historical lab-only',
  'セキュリティ修正',
  '本番利用は推奨しません',
  'Gateway API',
  'implementation',
  'conformance',
];
const HISTORICAL_COMMIT = '451747c70c6fca688e157a8329a3dd219a234fd9';
const HISTORICAL_SHA256 = 'e4198bf3fcbfecb510516fa6fab3db9cd1132d524896d866101ab6faca1fbc31';

function fail(message) {
  throw new Error(`ingress-retirement contract: ${message}`);
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function main() {
  const sourceFiles = fs.readdirSync(path.join(ROOT, 'src'), { recursive: true })
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.posix.join('src', file));
  const exposedFiles = sourceFiles.filter((file) => read(file).includes('ingress-nginx'));

  if (JSON.stringify(exposedFiles.sort()) !== JSON.stringify(TARGETS.slice().sort())) {
    fail(`all ingress-nginx exposure must be limited to the audited target pages: ${JSON.stringify(exposedFiles)}`);
  }

  for (const file of TARGETS) {
    const content = read(file);
    for (const marker of REQUIRED_MARKERS) {
      if (!content.includes(marker)) fail(`${file} must state ${JSON.stringify(marker)}`);
    }
  }

  const chapter = read('src/chapters/chapter07/index.md');
  const immutableManifestVariable = `INGRESS_NGINX_COMMIT=${HISTORICAL_COMMIT}`;
  const manifestPath = '${INGRESS_NGINX_COMMIT}/deploy/static/provider/kind/deploy.yaml';
  if (!chapter.includes(immutableManifestVariable) || !chapter.includes(manifestPath) || !chapter.includes(HISTORICAL_SHA256)) {
    fail('Chapter 7 historical lab manifest must remain pinned by commit SHA and SHA-256');
  }
  if (chapter.includes('raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v')) {
    fail('Chapter 7 must not fetch the historical manifest through a mutable tag reference');
  }
  const failClosedMarkers = [
    'set -euo pipefail',
    'curl -fsSLo "$MANIFEST"',
    'sha256sum --check -',
    'shasum -a 256 --check',
    'exit 1',
    'kubectl apply -f "$MANIFEST"',
  ];
  const markerPositions = failClosedMarkers.map((marker) => chapter.indexOf(marker));
  if (markerPositions.some((position) => position < 0)
      || markerPositions.some((position, index) => index > 0 && position <= markerPositions[index - 1])) {
    fail('Chapter 7 must fail closed and verify the downloaded manifest before applying it');
  }

  console.log(`✅ Ingress retirement contract passed (${TARGETS.length} audited source pages, ${REQUIRED_MARKERS.length} required markers).`);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
