#! /usr/bin/env node
/*
 * data-vis
 * https://github.com/jamesenglish/node-data-vis
 *
 * Copyright (c) 2014 James English
 * Licensed under the MIT license.
 */

'use strict';
var argv = require('optimist')
    .usage('Usage: $0 [space_num]')
    .demand([1])
    .argv;

console.log(argv._)