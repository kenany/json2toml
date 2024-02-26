'use strict';

const isDate = require('lodash.isdate');
const isEmpty = require('lodash.isempty');
const isPlainObject = require('lodash.isplainobject');
const strftime = require('strftime');

/**
 * @typedef {object} Options
 * @property {number} [indent] Number of spaces for indentation.
 * @property {boolean} [newlineAfterSection] Whether or not to output a newline
 *   after the last pair in a hash if that hash wasn't empty.
 */

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
 * @param {readonly [string, unknown][]} simplePairs
 * @returns {boolean}
 */
function isArrayOfTables(simplePairs) {
  return simplePairs.some(function(array) {
    const value = array[1];
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
  const array = simplePairs[simplePairs.length - 1];
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
 * @param {Options} options
 * @returns {string}
 */
module.exports = function(hash, options = {}) {
  /**
   * @param {object} hash
   * @param {string} prefix
   * @returns {void}
   */
  function visit(hash, prefix) {
    /** @type {[string, object][]} */
    const nestedPairs = [];

    /** @type {[string, unknown][]} */
    const simplePairs = [];
    const indentStr = ''.padStart(options.indent || 0, ' ');

    Object.keys(hash).forEach((key) => {
      // @ts-expect-error
      const value = hash[key];

      if (value === undefined) {
        throw new TypeError(`Cannot convert \`undefined\` at key "${key}" to TOML.`);
      }

      if (value === null) {
        throw new TypeError(`Cannot convert \`null\` at key "${key}" to TOML.`);
      }

      if (
        Array.isArray(value)
        && value.length > value.filter(() => true).length
      ) {
        throw new TypeError(`Cannot convert sparse array at key "${key}" to TOML.`);
      }

      (isPlainObject(value) ? nestedPairs : simplePairs).push([key, value]);
    });

    if (!isEmpty(prefix) && !isEmpty(simplePairs)
      && !isArrayOfTables(simplePairs)) {
      toml += '[' + prefix + ']\n';
    }

    simplePairs.forEach((array) => {
      const key = array[0];
      const value = array[1];

      if (isObjectArrayOfTables(array)) {
        if (simplePairs.indexOf(array) > 0 && options.newlineAfterSection) {
          const lastObj = simplePairs[simplePairs.indexOf(array) - 1];
          if (!isObjectArrayOfTables(lastObj)) {
            toml += '\n';
          }
        }

        // @ts-expect-error Asserted to be an array at this point.
        value.forEach((obj) => {
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

    nestedPairs.forEach((array) => {
      const key = array[0];
      const value = array[1];

      visit(
        value,
        isEmpty(prefix)
          ? escapeKey(key.toString())
          : `${prefix}.${escapeKey(key.toString())}`
      );
    });
  }

  let toml = '';

  visit(hash, '');

  return toml;
};
