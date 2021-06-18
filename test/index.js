var test = require('tape');
var json2toml = require('../');

test('empty', function(t) {
  t.plan(1);
  t.equal(json2toml({}), '');
});

test('types', function(t) {
  var TESTS = [
    [{ simple: true }, 'simple = true\n'],
    [{ float: -13.24 }, 'float = -13.24\n'],
    [{ int: 1234 }, 'int = 1234\n'],
    [{ true: true }, 'true = true\n'],
    [{ false: false }, 'false = false\n'],
    [{ array: [1, 2, 3] }, 'array = [1,2,3]\n'],
    [
      { array: [[1, 2], ['weird', 'one']] },
      'array = [[1,2],["weird","one"]]\n'
    ],
    [{
      datetime: new Date(1986, 7, 28, 15, 15)
    }, 'datetime = 1986-08-28T15:15:00Z\n']
  ];

  t.plan(TESTS.length);

  TESTS.forEach(function(value) {
    t.equal(json2toml(value[0]), value[1]);
  });
});

test('nested', function(t) {
  t.plan(3);

  var hash = { nested: { hash: { deep: true } } };
  t.equal(json2toml(hash), '[nested.hash]\ndeep = true\n');

  hash.nested.other = 12;
  t.equal(json2toml(hash), '[nested]\nother = 12\n[nested.hash]\ndeep = true\n');

  hash.nested.nest = {};
  hash.nested.nest.again = 'it never ends';
  var toml = '[nested]\n'
             + 'other = 12\n'
             + '[nested.hash]\n'
             + 'deep = true\n'
             + '[nested.nest]\n'
             + 'again = "it never ends"\n';
  t.equal(json2toml(hash), toml);
});

test('nested array of tables', function(t) {
  t.plan(2);

  var hash = { nested: [{ a: 'one' }, { a: 'two' }] };
  var toml = '[[nested]]\n'
             + 'a = "one"\n'
             + '[[nested]]\n'
             + 'a = "two"\n';
  t.equal(json2toml(hash), toml);

  hash.other = {};
  hash.other.nest = [{ a: 'one' }, { a: 'two' }];
  toml = toml + '[[other.nest]]\n'
          + 'a = "one"\n'
          + '[[other.nest]]\n'
          + 'a = "two"\n';
  t.equal(json2toml(hash), toml);
});

test('nested array of tables with new line', function(t) {
  t.plan(2);

  var hash = { nested: [{ a: 'one' }, { a: 'two' }] };
  var toml = '[[nested]]\n'
             + 'a = "one"\n\n'
             + '[[nested]]\n'
             + 'a = "two"\n\n';
  t.equal(json2toml(hash, { newlineAfterSection: true }), toml);

  hash.other = {};
  hash.other.nest = [{ a: 'one' }, { a: 'two' }];
  toml = toml + '[[other.nest]]\n'
          + 'a = "one"\n\n'
          + '[[other.nest]]\n'
          + 'a = "two"\n\n';
  t.equal(json2toml(hash, { newlineAfterSection: true }), toml);
});

test('pretty', function(t) {
  t.plan(1);

  var hash = { nested: { hash: { deep: true } } };
  var toml = '[nested.hash]\n  deep = true';

  t.equal(
    json2toml(hash, { indent: 2, newlineAfterSection: true }).trim(),
    toml
  );
});
