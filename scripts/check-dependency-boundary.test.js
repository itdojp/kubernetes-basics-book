'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateDependencyBoundary } = require('./check-dependency-boundary');

const fixture = () => ({
  manifest: { name: 'synthetic-book', version: '1.0.0', scripts: { 'check:security': 'npm audit' } },
  lock: { name: 'synthetic-book', version: '1.0.0', lockfileVersion: 3,
    packages: { '': { name: 'synthetic-book', version: '1.0.0' } } },
});

test('dependency-free manifest and npm v3 root lock are accepted', () => {
  const { manifest, lock } = fixture();
  assert.deepEqual(validateDependencyBoundary(manifest, lock), []);
});

test('empty npm dependency fields are allowed', () => {
  const { manifest, lock } = fixture();
  for (const obj of [manifest, lock, lock.packages['']]) {
    for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'overrides']) obj[key] = {};
    for (const key of ['bundledDependencies', 'bundleDependencies', 'workspaces']) obj[key] = [];
  }
  assert.deepEqual(validateDependencyBoundary(manifest, lock), []);
});

for (const location of ['manifest', 'lock', 'root']) {
  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'overrides']) {
    for (const [kind, value] of [['nonempty', { 'synthetic-tool': '1.0.0' }], ['malformed', []]]) {
      test(`${location}.${key} rejects ${kind} map`, () => {
        const { manifest, lock } = fixture();
        const obj = location === 'manifest' ? manifest : location === 'lock' ? lock : lock.packages[''];
        obj[key] = value;
        assert.ok(validateDependencyBoundary(manifest, lock).length > 0);
      });
    }
  }
  for (const key of ['bundledDependencies', 'bundleDependencies', 'workspaces']) {
    for (const value of [['synthetic-tool'], true, {}]) {
      test(`${location}.${key} rejects ${JSON.stringify(value)}`, () => {
        const { manifest, lock } = fixture();
        const obj = location === 'manifest' ? manifest : location === 'lock' ? lock : lock.packages[''];
        obj[key] = value;
        assert.ok(validateDependencyBoundary(manifest, lock).length > 0);
      });
    }
  }
}

const mutations = [
  ['installed transitive dependency', ({ lock }) => { lock.packages['node_modules/synthetic-tool'] = { version: '1.0.0' }; }],
  ['missing root', ({ lock }) => { delete lock.packages['']; }],
  ['malformed root', ({ lock }) => { lock.packages[''] = []; }],
  ['malformed packages', ({ lock }) => { lock.packages = []; }],
  ['missing packages', ({ lock }) => { delete lock.packages; }],
  ['wrong lock version', ({ lock }) => { lock.lockfileVersion = 2; }],
  ['missing identity', ({ manifest }) => { delete manifest.name; }],
  ['lock name mismatch', ({ lock }) => { lock.name = 'different'; }],
  ['lock version mismatch', ({ lock }) => { lock.version = '2.0.0'; }],
  ['root name mismatch', ({ lock }) => { lock.packages[''].name = 'different'; }],
  ['root version mismatch', ({ lock }) => { lock.packages[''].version = '2.0.0'; }],
  ['audit suppression', ({ manifest }) => { manifest.scripts['check:security'] = 'npm audit || true'; }],
  ['audit filtering', ({ manifest }) => { manifest.scripts['check:security'] = 'npm audit --omit=dev'; }],
  ['missing audit', ({ manifest }) => { delete manifest.scripts; }],
];
for (const [name, mutate] of mutations) {
  test(`rejects ${name}`, () => {
    const data = fixture(); mutate(data);
    assert.ok(validateDependencyBoundary(data.manifest, data.lock).length > 0);
  });
}
for (const invalid of [null, [], 'invalid']) {
  test(`rejects malformed top-level input ${JSON.stringify(invalid)}`, () => {
    const { manifest, lock } = fixture();
    assert.ok(validateDependencyBoundary(invalid, lock).length > 0);
    assert.ok(validateDependencyBoundary(manifest, invalid).length > 0);
  });
}
