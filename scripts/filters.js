'use strict';

/* Filters */

var appFilters = angular.module('appFilters', [])
.filter('dataEntryForm', function() {
    return function(input) {
        var output = [];
        if(input)
        input.forEach(function(form){
            if(form.name.indexOf("Entry Form") > -1){
                output.push(form);
            }
        })
        return output;
    };
})