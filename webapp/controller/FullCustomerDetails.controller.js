sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.project1.controller.FullCustomerDetails", {

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("FullCustomerDetail").attachPatternMatched(this.eachCustomerDetails, this);
        },

        eachCustomerDetails: function (oEvent) {
            var sCustomerId = oEvent.getParameter("arguments").customerId;
            var sPath = "/Customers('" + sCustomerId + "')";
            this.getView().byId("customerObjectPage").bindElement({
                path: sPath,
                model: "Northwind",
                parameters: { "expand": "Orders" }
            });
        }

    });
});
