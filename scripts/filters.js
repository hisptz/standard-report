'use strict';

/* Filters */

var appFilters = angular.module('appFilters', [])
.filter('dataEntryForm', function() {
    return function(input,formSource) {
        console.log("ARguments:",arguments);
        var output = [];
        if(input)
        input.forEach(function(form){
            if(formSource){
                if(form.name.indexOf(formSource) > -1){
                    output.push(form);
                }
            }else{
                if(form.name.indexOf("Entry Form") > -1){
                    output.push(form);
                }
            }
        })
        return output;
    };
})