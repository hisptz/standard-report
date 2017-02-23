'use strict';

/* Filters */

var appFilters = angular.module('appFilters', [])
    .filter('removeNaN', function() {
        return function(input) {
            if(input == "NaN" || isNaN(input)){
                return "";
            }
            if(input == null){
                return "";
                console.log("Supposed to be null");
            }

            return input;
        };
    })
.filter('dataEntryForm', function() {
    return function(input,formSource) {
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
    .filter('estimationConvertor', function() {
        function toTitleCase(str)
        {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
        return function(input) {
            return toTitleCase(input.split("_").join(" "));
        };
    })