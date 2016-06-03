// Copyright 2016. HansolLim All Right Reserved.
(function(root){
    root.sheetDB = function(sheetKey, webAppKey){
        var _sheetDB = this;

        _sheetDB._getUrl = "";
        _sheetDB._putUrl = "";
        _sheetDB._sheetKey = "";
        _sheetDB._webAppKey = "";

        _sheetDB.getSheetKey = function(){
            return this._sheetKey;
        };
        _sheetDB.getWebAppKey = function(){
            return this._webAppKey;
        };
        _sheetDB.csvToJson = function(csv) {
            var lines = csv.split("\n");
            var result = [];
            var headers = lines[0].split(",");
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentLine = lines[i].split(",");
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j].replace("\r","")] = currentLine[j];
                }
                result.push(obj);
            }
            return result;
        };
        _sheetDB.objectToParameter = function(object){
            var param = "";
            for (var key in object) {
                if (object[key] && typeof object[key] != "undefined") {
                    if (param != "")
                        param += "&";
                    param += key + "=" + encodeURIComponent(object[key]);
                }
            }
            return param;
        };
        _sheetDB.getJson = function(callback, query){
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.onreadystatechange = function() {
                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                    var result = _sheetDB.csvToJson(xmlHttpRequest.responseText);
                    if(query)
                        callback(_sheetDB.filter(result, query));
                    else
                        callback(result);
                }
            };
            xmlHttpRequest.open("GET", _sheetDB._getUrl, true);
            xmlHttpRequest.send();
        };
        _sheetDB.putRow = function(data, callback){
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.onreadystatechange = function() {
                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                    callback(xmlHttpRequest.responseText);
                }
            };
            xmlHttpRequest.open("POST", _sheetDB._putUrl, true);
            xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttpRequest.send(_sheetDB.objectToParameter(data));
        };
        _sheetDB.filter = function(object, query){
            if(query && object) {
                var isContainWhere = query.indexOf("WHERE") != -1;
                var isContainOrder = query.indexOf("ORDER") != -1;

                var queryObject = {
                    columns: [],
                    condition: {
                        where: "",
                        order: ""
                    }
                };

                if(isContainWhere && isContainOrder){
                    if(query.indexOf("WHERE") > query.indexOf("ORDER")){
                        queryObject.columns = query.split("ORDER")[0].replace(new RegExp(" ", "gi"), "").split(",");
                        queryObject.condition.order = query.split("ORDER")[1].split("WHERE")[0].trim();
                        queryObject.condition.where = query.split("ORDER")[1].split("WHERE")[1].trim();
                    }else{
                        queryObject.columns = query.split("WHERE")[0].replace(new RegExp(" ", "gi"), "").split(",");
                        queryObject.condition.where = query.split("WHERE")[1].split("ORDER")[0].trim();
                        queryObject.condition.order = query.split("WHERE")[1].split("ORDER")[1].trim();
                    }
                }else if(isContainWhere){
                    queryObject.columns = query.split("WHERE")[0].replace(new RegExp(" ", "gi"), "").split(",");
                    queryObject.condition.where = query.split("WHERE")[1];
                }else if(isContainOrder){
                    queryObject.columns = query.split("ORDER")[0].replace(new RegExp(" ", "gi"), "").split(",");
                    queryObject.condition.order = query.split("ORDER")[1];
                }else{
                    queryObject.columns = query.replace(new RegExp(" ", "gi"), "").split(",");
                }

                if(isContainWhere){
                    if(queryObject.condition.where){
                        var quotes = false;
                        var quoteString = "";
                        var quoteArray = [];
                        var quoteArrayIndex = 0;
                        for(var idx in queryObject.condition.where){
                            if(quotes) quoteString += queryObject.condition.where[idx];
                            else quoteString = "";
                            if(queryObject.condition.where[idx] === "'"){
                                if(quotes) {
                                    quoteArray.push(quoteString);
                                    queryObject.condition.where = queryObject.condition.where.replace(quoteString, "[" + (quoteArrayIndex++) + "]");
                                    idx -= (quoteString.length - ("[" + idx + "]").length);
                                }
                                else {
                                    quoteString += quoteString += queryObject.condition.where[idx];
                                }

                                quotes = !quotes;
                            }
                        }

                        queryObject.condition.variable = quoteArray;

                        queryObject.condition.where = queryObject.condition.where.replace(new RegExp(" ", "gi"), "");

                        for(var objectIdx in object){
                            // WHERE 조건 판별
                            var condition = queryObject.condition.where;
                            for(var key in object[objectIdx]) {
                                condition = condition.replace(key, "'" + object[objectIdx][key] + "'");
                            }

                            for(var quoteIdx in quoteArray) {
                                condition = condition.replace("[" + quoteIdx + "]", quoteArray[quoteIdx]);
                            }

                            if(! eval(condition))
                                delete object[objectIdx];
                            else{
                                // columns 유무 판별
                                for(var key in object[objectIdx]) {
                                    var isExist = false;
                                    for(var columnIdx in queryObject.columns){
                                        if(key == queryObject.columns[columnIdx])
                                            isExist = true;
                                    }

                                    if(!isExist)
                                        delete object[objectIdx][key];
                                }
                            }
                        }
                    }
                    object = object.filter(function(value){return value});
                }

                if(isContainOrder){
                    if(queryObject.condition.order){
                        if(queryObject.condition.order[0] != "-"){
                            var key = queryObject.condition.order.substring(1, queryObject.condition.order.length);
                            for(var i = 0; i < object.length; i++){
                                for(var j = i + 1; j < object.length; j++){
                                    if(object[i][key] > object[j][key]){
                                        var temp = object[i][key];
                                        object[i][key] = object[j][key];
                                        object[j][key] = temp;
                                    }
                                }
                            }
                        }else{
                            var key = queryObject.condition.order;
                            for(var i = 0; i < object.length; i++){
                                for(var j = i + 1; j < object.length; j++){
                                    if(object[i][key] < object[j][key]){
                                        var temp = object[i][key];
                                        object[i][key] = object[j][key];
                                        object[j][key] = temp;
                                    }
                                }
                            }
                        }
                    }
                }
            }else{
                console.error("sheetDB error: query or object is null.");
            }
            return object;
        };
        _sheetDB.init = function(sheetKey, webAppKey){
            _sheetDB._sheetKey = sheetKey;
            _sheetDB._webAppKey = webAppKey;

            _sheetDB._getUrl = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/" + sheetKey + "/pub?output=csv";
            _sheetDB._putUrl = "https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/" + webAppKey + "/exec";
        };

        _sheetDB.init(sheetKey, webAppKey);
    };
})(window);