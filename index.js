var forEach = require('lodash.foreach');
var isDate = require('lodash.isdate');
var isEmpty = require('lodash.isempty');
var isPlainObject = require('lodash.isplainobject');
var keys = require('lodash.keys');
var strftime = require('strftime');

/**
 * @param {unknown} obj
 * @returns {string}
 */
function format(obj) {
  return isDate(obj)
    ? strftime('%FT%TZ', obj)
    : JSON.stringify(obj);
}

/**
 * @param {readonly unknown[][]} simplePairs
 * @returns {boolean}
 */
function isArrayOfTables(simplePairs) {
  return simplePairs.some(function(array) {
    var value = array[1];
    return Array.isArray(value) && isPlainObject(value[0]);
  });
}

/**
 * @param {readonly unknown[]} obj
 * @returns {boolean}
 */
function isObjectArrayOfTables(obj) {
  return Array.isArray(obj) && obj.length === 2 && isPlainObject(obj[1][0]);
}

/**
 * @param {readonly unknown[][]} simplePairs
 * @returns {boolean}
 */
function isLastObjectArrayOfTables(simplePairs) {
  var array = simplePairs[simplePairs.length - 1];
  return isObjectArrayOfTables(array);
}

/**
 * @param {string} key
 * @returns {string}
 */
function escapeKey(key) {
  return /^[a-zA-Z0-9-_]*$/.test(key)
    ? key
    : `"${key}"`;
}

/**
 * @param {object} hash
 * @param {object} options
 * @returns {string}
 */
module.exports = function(hash, options = {}) {
  /**
   * @param {object} hash
   * @param {string} prefix
   * @returns {void}
   */
  function visit(hash, prefix) {
    var nestedPairs = [];
    var simplePairs = [];

    var indentStr = '';

    forEach(keys(hash).sort(), function(key) {
      var value = hash[key];
      (isPlainObject(value) ? nestedPairs : simplePairs).push([key, value]);
    });

    if (!isEmpty(prefix) && !isEmpty(simplePairs)
      && !isArrayOfTables(simplePairs)) {
      toml += '[' + prefix + ']\n';
      indentStr = ''.padStart(options.indent, ' ');
    }

    forEach(simplePairs, function(array) {
      var key = array[0];
      var value = array[1];

      if (isObjectArrayOfTables(array)) {
        if (simplePairs.indexOf(array) > 0 && options.newlineAfterSection) {
          var lastObj = simplePairs[simplePairs.indexOf(array) - 1];
          if (!isObjectArrayOfTables(lastObj)) {
            toml += '\n';
          }
        }
        forEach(value, function(obj) {
          if (!isEmpty(prefix)) {
            toml += '[[' + prefix + '.' + key + ']]\n';
          }
          else {
            toml += '[[' + key + ']]\n';
          }
          visit(obj, '');
        });
      }
      else {
        toml += indentStr + escapeKey(key) + ' = ' + format(value) + '\n';
      }
    });

    if (!isEmpty(simplePairs) && !isLastObjectArrayOfTables(simplePairs)
      && options.newlineAfterSection) {
      toml += '\n';
    }

    forEach(nestedPairs, function(array) {
      var key = array[0];
      var value = array[1];

      visit(
        value,
        isEmpty(prefix)
          ? escapeKey(key.toString())
          : `${prefix}.${escapeKey(key.toString())}`
      );
    });
  }

  var toml = '';

  visit(hash, '');

  return toml;
};
