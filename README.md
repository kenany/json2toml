# json2toml

Convert JSON to [TOML](https://github.com/mojombo/toml).

## Example

``` javascript
var json2toml = require('json2toml');

json2toml({simple: true});
// => 'simple = true\n'

// Also supports pretty-printing options

console.log(json2toml({deeply: {option: false, nested: {option: true}}},
  {indent: 2, newlineAfterSection: true}));
//[deeply]
//  option = false
//
//[deeply.nested]
//  option = true
```

## Installation

``` bash
$ npm install json2toml
```

## API

``` javascript
var json2toml = require('json2toml');
```

### json2toml(hash)

Converts an _Object_ `hash` to TOML, and returns the result as a _String_.
