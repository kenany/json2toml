'use strict';

const test = require('tape');

const json2toml = require('../');

test('invalid > undefined', (t) => {
  t.plan(1);
  t.throws(
    () => json2toml({ a: undefined }),
    /Cannot convert `undefined` at key "a" to TOML./
  );
});

test('invalid > null', (t) => {
  t.plan(1);
  t.throws(
    () => json2toml({ a: null }),
    /Cannot convert `null` at key "a" to TOML./
  );
});

test('invalid > sparse array', (t) => {
  t.plan(1);
  t.throws(
    // eslint-disable-next-line no-sparse-arrays
    () => json2toml({ a: [,,] }),
    /Cannot convert sparse array at key "a" to TOML./
  );
});
