#!/usr/bin/env node
'use strict';

// This book's npm tooling uses Node built-ins only. Pages is built by Jekyll,
// not gh-pages. Ruby gems and the separately pinned formatter are out of scope.
// A future npm dependency requires explicit review of this finite contract;
// removing a supported caller just to satisfy the audit is not acceptable.
const fs = require('node:fs');
const path = require('node:path');

const MAP_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'overrides'];
const LIST_FIELDS = ['bundledDependencies', 'bundleDependencies', 'workspaces'];
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function validateDependencyBoundary(manifest, lock) {
  const errors = [];
  if (!isObject(manifest) || !isObject(lock)) return ['manifest and lock must be JSON objects'];
  const emptyDependencies = (value, location) => {
    for (const field of MAP_FIELDS) {
      if (Object.hasOwn(value, field) && (!isObject(value[field]) || Object.keys(value[field]).length !== 0)) {
        errors.push(`${location}.${field}: expected an empty dependency map or absent field`);
      }
    }
    for (const field of LIST_FIELDS) {
      if (Object.hasOwn(value, field) && (!Array.isArray(value[field]) || value[field].length !== 0)) {
        errors.push(`${location}.${field}: expected an empty array or absent field`);
      }
    }
  };
  emptyDependencies(manifest, 'package.json');
  emptyDependencies(lock, 'package-lock.json');
  if (lock.lockfileVersion !== 3) errors.push('lockfileVersion must remain 3');
  for (const field of ['name', 'version']) {
    if (typeof manifest[field] !== 'string' || !manifest[field].trim() || lock[field] !== manifest[field]) {
      errors.push(`${field}: manifest and lock identity must match`);
    }
  }
  if (!isObject(lock.packages) || Object.keys(lock.packages).length !== 1 || !isObject(lock.packages[''])) {
    errors.push('lock.packages must contain only the root package (no installed npm dependencies)');
  } else {
    emptyDependencies(lock.packages[''], 'lock.packages[root]');
    for (const field of ['name', 'version']) {
      if (lock.packages[''][field] !== manifest[field]) errors.push(`lock root ${field} must match manifest`);
    }
  }
  if (!isObject(manifest.scripts) || manifest.scripts['check:security'] !== 'npm audit') {
    errors.push('check:security must remain the unfiltered npm audit');
  }
  return errors;
}

if (require.main === module) {
  try {
    const root = path.resolve(__dirname, '..');
    const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
    const errors = validateDependencyBoundary(read('package.json'), read('package-lock.json'));
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('OK: dependency-free npm tooling; unfiltered audit retained (Ruby/formatter separate)');
  } catch (error) {
    console.error(`Dependency boundary failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { validateDependencyBoundary };
