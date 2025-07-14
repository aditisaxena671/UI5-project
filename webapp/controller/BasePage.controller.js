sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
     "sap/ui/model/odata/v2/ODataModel" 

], function (Controller, JSONModel, ResourceModel, MessageToast, Fragment,ODataModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.project1.controller.BasePage", {
        onInit: function () {
            this.oOrdersJsonModel= new JSONModel();
            this.getView().setModel(this.oOrdersJsonModel,"oOrdersJsonModel");

            
            // var sample= oOrdersJsonModel.getProperty("/orders");
            // console.log("Sample Orders: ", sample);
            

            // var oData = {
            //     orders: [
            //         { orderId: "1001", customer: "Reliance", orderDate: "2025-07-01", status: "Delivered", amount: "₹1200" },
            //         { orderId: "1002", customer: "Tata", orderDate: "2025-07-03", status: "Pending", amount: "₹3400" },
            //         { orderId: "1003", customer: "HUL", orderDate: "2025-07-05", status: "Shipped", amount: "₹950" },
            //         { orderId: "1004", customer: "Nestle", orderDate: "2025-07-08", status: "Cancelled", amount: "₹0" },
            //         { orderId: "1001", customer: "Reliance", orderDate: "2025-07-01", status: "Delivered", amount: "₹1200" },
            //         { orderId: "1002", customer: "Tata", orderDate: "2025-07-03", status: "Pending", amount: "₹3400" },
            //         { orderId: "1003", customer: "HUL", orderDate: "2025-07-05", status: "Shipped", amount: "₹950" },
            //         { orderId: "1004", customer: "Nestle", orderDate: "2025-07-08", status: "Cancelled", amount: "₹0" },

            //     ]
            // };

            // var oModel = new sap.ui.model.json.JSONModel(oData);
            // this.getView().setModel(oModel, "orderModel");
        },
        fetchOrderData: async function(){
            this.getOwnerComponent().getModel("Northwind").read("/Orders", {
                success: function(oData) {
                    if(oData && oData.results) {
                        console.log("Success ",oData.results);
                        this.oOrdersJsonModel.setProperty("/orders", oData.results);
                    }
                    else{
                        this.oOrdersJsonModel.setProperty("/orders",[]);
                    }
                }.bind(this),
                error: function(oError) {
                    this.oOrdersJsonModel.setProperty("/orders",[]);
                    console.error("Error ", oError);
                }.bind(this)
            });
            // var sample= oOrdersJsonModel.getProperty("/orders");
            // console.log("Sample Orders: ", sample);

        },
        onGetStartedPress:  function () {
            
            if (!this.GetStartedDialog) {
                this.GetStartedDialog = sap.ui.xmlfragment("sap.ui.demo.walkthrough.project1.view.GetStarted", this);
                this.getView().addDependent(this.GetStartedDialog);
            }
            this.GetStartedDialog.open();

        },
        onCancelGetStartedDialog: function () {
            if (this.GetStartedDialog) {
                this.GetStartedDialog.close();
            }
        },
        onShowTableDialogPress: async function () {
            await this.fetchOrderData();
            // var oModel = this.getView().getModel("orderModel");
            // var aOrders = oModel.getProperty("/orders");
            // console.log("Orders received:", aOrders);
            if (!this.ShowTableDialog) {
                this.ShowTableDialog = sap.ui.xmlfragment("sap.ui.demo.walkthrough.project1.view.ShowTable", this);
                this.getView().addDependent(this.ShowTableDialog);
            }
            this.ShowTableDialog.open();
        },
        onCancelShowTableDialog: function () {
            if (this.ShowTableDialog) {
                this.ShowTableDialog.close();
            }
        },
    });
});