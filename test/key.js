'use strict';

const test = require('tape');

const json2toml = require('../');

test('key > case sensitive', (t) => {
  t.plan(1);

  const obj = {
    sectioN: 'NN',
    section: {
      name: 'lower',
      NAME: 'upper',
      Name: 'capitalized'
    },
    Section: {
      name: 'different section!!',
      μ: 'greek small letter mu',
      Μ: 'greek capital letter MU',
      M: 'latin letter M'
    }
  };
  t.equal(
    json2toml(obj),
    `sectioN = "NN"
[section]
name = "lower"
NAME = "upper"
Name = "capitalized"
[Section]
name = "different section!!"
"μ" = "greek small letter mu"
"Μ" = "greek capital letter MU"
M = "latin letter M"
`
  );
});

test('key > escapes', (t) => {
  t.plan(6);

  t.equal(
    json2toml({ '\n': 'newline' }),
    '"\n" = "newline"\n'
  );
  t.equal(
    json2toml({ '"': 'just a quote' }),
    '""" = "just a quote"\n'
  );
  t.equal(
    json2toml({ '"quoted"': { quote: true } }),
    `[""quoted""]
quote = true
`
  );
  t.equal(
    json2toml({ 'a.b': { À: { c: 'c' } } }),
    `["a.b"."\u00c0"]
c = "c"
`
  );
  t.equal(
    json2toml({ 'backsp\u0008\u0008': { c: 'c' } }),
    `["backsp\b\b"]
c = "c"
`
  );
  t.equal(
    json2toml({ À: 'latin capital letter A with grave' }),
    '"À" = "latin capital letter A with grave"\n'
  );
});

test('key > space', (t) => {
  t.plan(1);

  t.equal(
    json2toml({ 'a b': 1 }),
    '"a b" = 1\n'
  );
});
