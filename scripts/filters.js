'use strict';

/* Filters */

var appFilters = angular.module('appFilters', [])
    .filter('removeNaN', function() {
        return function(input) {
            if(input == "NaN"){
                return "";
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
        return function(input) {
            var output = [];
            console.log("Input:",input);
            if(input == "value"){
                return "Value"
            }else if(input == "target_dataelement"){
                return "Target Data Element"
            }
            else if(input == "target"){
                return "Target"
            }else if(input == "target_period"){
                return "Target Period"
            }else if(input == "old_value"){
                return "Previous Value"
            }else if(input == "old_value_period"){
                return "Period Previous Value"
            }else if(input == "prio_estimate"){
                return "Prio Estimate"
            }else if(input == "prio_estimate_period"){
                return "Prio Estimate Period"
            }
            return input;
        };
    })