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
var AnsiCanvas = require('ansi-canvas');
var Canvas = require('canvas');
var Chart = require('nchart');
var Format = require('date-format');

var argv = require('optimist')
    .usage('Usage: $0 [space_num]')
    .demand([1])
    .default('key', '9C3B13239D75E73FDE883C934FF647A1')
    .argv;

var url = 'https://api.pulseenergy.com/pulse/1/spaces/' +
    argv._  +
   '/data.json?resource=Total&interval=Week&quantity=Energy&key=' +
    argv.key;

function requestJSON(url) {
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

var drawCanvasChart = function(labels, dataset) {
    var canvas = AnsiCanvas();
    var ctx = canvas.getContext('2d');
    var data = {
        labels: labels,
        datasets : [{
            fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : dataset
        }]
    };

    var options = {
        animation: false,
        scaleFontSize : 12
    };


    Chart(ctx).Line(data, options);

    //flush canvas to terminal
    canvas.render();
};


var onSuccess = function(responseText) {
    var responseJson = JSON.parse(responseText)

    //rearrage the data into a format that can be used by the charting client
    var labels = responseJson.data
        .map(function(item) {
            return Format.asString("dd/MM/yy", new Date(item[0]));
        });

    var dataset = responseJson.data
        .map(function(item) {
            return item[1];
        });

    drawCanvasChart(labels, dataset);
    console.log(labels);
    console.log(dataset)
    console.log("Data displayed for: " + responseJson.label);
    console.log("Between: " +
        Format.asString("dd/MM/yy", new Date(responseJson.start)) +
        " and: " +
        Format.asString("dd/MM/yy", new Date(responseJson.end)));
    console.log("For best results please make your console window as large as you can and decrease your font size!")

};

requestJSON(url)
    .then(onSuccess, function (error) {
        console.error(error);
    }, function (progress) {
        // Log the progress as it comes in.
        console.log("Request progress: " + Math.round(progress * 100) + "%");
    });







