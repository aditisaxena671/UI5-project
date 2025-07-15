sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox',

], function (Controller, JSONModel, MessageBox) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.project1.controller.WorkFlow", {
        onInit: function () {
            this.oOrdersJsonModel = new JSONModel();
            this.getView().setModel(this.oOrdersJsonModel, "oOrdersJsonModel");
            this.fetchOrderData();
            console.log("hello");
           
            // var sample= oOrdersJsonModel.getProperty("/orders");
            // console.log("Sample Orders: ", sample);
        },
        fetchOrderData: function () {
            this.getOwnerComponent().getModel("Northwind").read("/Orders", {
                success: function (oData) {
                    var oTable = this.byId("ordersTable");
                    if (oData && oData.results) {
                        console.log("Success ", oData.results);
                        this.oOrdersJsonModel.setProperty("/orders", oData.results);
                        // oTable.setBusy(false);
                    }
                    else {
                        this.oOrdersJsonModel.setProperty("/orders", []);
                        // oTable.setBusy(false);
                    }
                }.bind(this),
                error: function (oError) {
                    this.oOrdersJsonModel.setProperty("/orders", []);
                    console.error("Error ", oError);
                }.bind(this)
            });
            // var sample= oOrdersJsonModel.getProperty("/orders");
            // console.log("Sample Orders: ", sample);

        },
        onGetStartedPress: function () {

            if (!this.GetStartedDialog) {
                this.GetStartedDialog = sap.ui.xmlfragment("sap.ui.demo.walkthrough.project1.view.GetStarted", this);
                this.getView().addDependent(this.GetStartedDialog);
            }
            this.GetStartedDialog.open();

        },
        onSideNavItemPress:function(oEvent){
            console.log("Clicked");
            const sKey= oEvent.getSource().getText().toLowerCase();
            const oRoute= sap.ui.core.UIComponent.getRouterFor(this);
            switch(sKey){
                case "dashboard":
                    oRoute.navTo("dashboard");
                    break;
                default:
                    console.log("Default Treggered");
                    break;


            }
        }
        ,
        onCancelGetStartedDialog: function () {
            if (this.GetStartedDialog) {
                this.GetStartedDialog.close();
            }
        },
        onShowTableDialogPress: function () {
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
        showDetails: function () {
            var oTable = this.getView().byId("ordersTable");
            var selectedItem = oTable.getSelectedItem();
            if (selectedItem) {
                var context = selectedItem.getBindingContext("oOrdersJsonModel");
                if (!this.orderDetailsDialog) {
                    this.orderDetailsDialog = sap.ui.xmlfragment("sap.ui.demo.walkthrough.project1.view.OrderDetail", this);
                    this.getView().addDependent(this.orderDetailsDialog)
                }
                this.orderDetailsDialog.setModel(this.getView().getModel("oOrdersJsonModel"));
                this.orderDetailsDialog.bindElement({
                    path: context.getPath(),
                    model: "oOrdersJsonModel"
                });
                this.orderDetailsDialog.open();
                // var orderDetails= context.getProperty("OrderID");
                // MessageBox.success("Order ID: " + orderDetails);
                // console.log("Item selected");
            }
            else {
                MessageBox.warning("Please Select a Record");

            }
        },
        onCancelOrderDetailDialog: function () {
            this.orderDetailsDialog.close();
        },
    });
});