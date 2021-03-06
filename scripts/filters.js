'use strict';

/* Filters */

var appFilters = angular.module('appFilters', [])
    .filter('removeNaN', function() {
        return function(input,dataElement) {
            if(dataElement){
                if(dataElement.valueType != "TEXT"){
                    if(input == "NaN" || isNaN(input)){
                        return "";
                    }
                    if(input == null){
                        return "";
                    }
                }
            }else{
                if(input == "NaN" || isNaN(input)){
                    return "";
                }
                if(input == null){
                    return "";
                }
            }
            if((input) == "0.0" || (input) == "0"){
                return "0.0";
            }
            return input;
        };
    })
    .filter('toDecimal', function() {
        return function(input) {
            if(!input){
                //return '';
            }
            if((input + '').substr((input + '').indexOf('.') + 2,1) === '5'){
                //return (parseFloat(input) + 0.01).toFixed(1);
            }
            //return input;
            //return parseFloat(input).toFixed(1);
            if(input == "NaN" || isNaN(input)){
                return "";
            }
            try{
                var val = (new Decimal(input)).toFixed(1);
                if(val == "NaN"){
                    return '';
                }
                return val;
            } catch(e){
                return '';
            }
        };
    })
    .filter('removeNaNInd', function() {
        return function(input,dataElement) {
            if(dataElement){
                if(dataElement.valueType != "TEXT"){
                    if(input == "NaN" || isNaN(input)){
                        return "";
                    }
                    if(input == null){
                        return "";
                    }
                }
            }else{
                if(input == "NaN" || isNaN(input)){
                    return "";
                }
                if(input == null){
                    return "";
                }
            }
            if(parseFloat(input) == 0){
                return "";
            }
            return input;
        };
    })
    .filter('comma', function() {
        return function(input) {
            if(input){
                return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }else{
                return input;
            }
        };
    })
    .filter('withNotExecuted', function() {
        return function(periods,notExecuted,dataSetId,orgUnitId) {
            if(periods){
                var returnPeriods = [];
                periods.forEach(function(p){
                    if(orgUnitId){
                        if(notExecuted.indexOf(dataSetId+ '_' + orgUnitId + '_' +p ) > -1){
                            returnPeriods.push(p);
                        }
                    }else{
                        notExecuted.forEach(function(str){
                            if(str.startsWith(dataSetId) && str.endsWith(p)){
                                returnPeriods.push(p);
                            }
                        })
                    }
                })
                return returnPeriods;
            }else{
                return inpuperiodst;
            }
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