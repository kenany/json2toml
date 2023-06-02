'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const test = require('tape');

const json2toml = require('../');

const FIXTURES_PATH = path.resolve(__dirname, 'fixtures');

test('fixtures', async (t) => {
  const fixtures = new Map();
  const files = await fs.readdir(FIXTURES_PATH);
  for (const file of files) {
    const [name, ext] = file.split('.');
    const contents = await fs.readFile(
      path.resolve(FIXTURES_PATH, file),
      { encoding: 'utf8' }
    );

    const fixture = fixtures.has(name)
      ? fixtures.get(name)
      : { json: {}, toml: '' };

    if (ext === 'json') {
      fixture.json = JSON.parse(contents);
    }
    else if (ext === 'toml') {
      fixture.toml = contents;
    }

    fixtures.set(name, fixture);
  }

  for (const [name, fixture] of fixtures) {
    t.equal(json2toml(fixture.json), fixture.toml, name);
  }

  t.end();
});
