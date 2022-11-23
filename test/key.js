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
