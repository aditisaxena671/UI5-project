sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function(DateFormat){
    "use strict";
    return{
        formatDate: function(date){
            console.log("Hello formater",date);
            
            if(!date){
                console.log("date empty");
                return "";
            }
            var oDateFormat = DateFormat.getInstance({pattern: "dd/MM/yyyy"}); 
            return oDateFormat.format(date);
        }
    }
});