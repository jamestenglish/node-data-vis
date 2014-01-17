#! /usr/bin/env node
/*
 * data-vis
 * https://github.com/jamesenglish/node-data-vis
 *
 * Copyright (c) 2014 James English
 * Licensed under the MIT license.
 */

'use strict';
var Q = require("q");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var argv = require('optimist')
    .usage('Usage: $0 [space_num]')
    .demand([1])
    .default('key', '9C3B13239D75E73FDE883C934FF647A1')
    .argv;

var url = 'https://api.pulseenergy.com/pulse/1/spaces/' +
    argv._  +
   '/data.json?resource=Total&interval=Week&quantity=Energy&key=' +
    argv.key;

console.log(argv._);
console.log(argv.key);
console.log(url);

function requestOkText(url) {
    var request = new XMLHttpRequest();
    var deferred = Q.defer();

    request.open("GET", url, true);
    request.onload = onload;
    request.onerror = onerror;
    request.onprogress = onprogress;
    request.send();

    function onload() {
        if (request.status === 200) {
            deferred.resolve(request.responseText);
        } else {
            deferred.reject(new Error("Status code was " + request.status));
        }
    }

    function onerror() {
        deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
    }

    function onprogress(event) {
        deferred.notify(event.loaded / event.total);
    }

    return deferred.promise;
}

requestOkText(url)
    .then(function (responseText) {
        // If the HTTP response returns 200 OK, log the response text.
        var responseJson = JSON.parse(responseText)
        console.log(responseJson);
    }, function (error) {
        // If there's an error or a non-200 status code, log the error.
        console.error(error);
    }, function (progress) {
        // Log the progress as it comes in.
        console.log("Request progress: " + Math.round(progress * 100) + "%");
    });