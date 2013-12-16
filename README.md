# json2toml

[![Build Status](https://travis-ci.org/KenanY/json2toml.png?branch=master)](https://travis-ci.org/KenanY/json2toml)
[![Dependency Status](https://gemnasium.com/KenanY/json2toml.png)](https://gemnasium.com/KenanY/json2toml)


Convert JSON to [TOML](https://github.com/mojombo/toml).

## Example

``` javascript
var json2toml = require('json2toml');

json2toml({simple: true});
// => 'simple = true\n'
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