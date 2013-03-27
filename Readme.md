# qry
[![Build Status](https://travis-ci.org/manuelstofer/qry.png?branch=master)](https://travis-ci.org/manuelstofer/qry)

MongoDB query compatible object match

## Installation

```bash
npm install qry
```

```bash
component install manuelstofer/qry
```

## Usage

```Javascript
var qry = require('qry');

var match = qry({
    name: {$exists: true},
    qty: {$gt: 3},
    $and: [
        {price: {$lt: 100}},
        {price: {$gt: 50}}
    ]
});

match({name: 'example', qty: 10, price: 65.10});    // -> true
match({name: 'bla', qty: 10, price: 30.10});        // -> false
```

Please checkout the [query selector](http://docs.mongodb.org/manual/reference/operators/#query-selectors) section
in the mongo db reference.


### Supported operators

- All comparison operators
- All logical operators
- All element operators except $type
- All JavaScript operators
- All array operators

Following operators are currently not supported:

- All geospatial operators
- $type operator

The $where operator is supported but disabled by default (security).

```Javascript
var match = qry(query, {$where: true});
```