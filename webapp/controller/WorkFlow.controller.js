sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox',

], function (Controller, JSONModel, MessageBox) {
    "use strict";
    let _initialized = false;
    return Controller.extend("sap.ui.demo.walkthrough.project1.controller.WorkFlow", {
        onInit: function () {
            if (_initialized) {
                console.log("Controller already initialized globally");
                return;
            }
            _initialized = true;
            console.log("goinf to call api");
            this.fetchOrderData();
            this.fetchCustomerDetails();
        },
        readOData: function (sPath) {
            return new Promise((resolve, reject) => {
                this.getOwnerComponent().getModel("Northwind").read(sPath, {
                    success: resolve,
                    error: reject
                });
            });
        },
        
        fetchOrderData: function () {
            this.readOData("/Orders")
                .then((oData) => {
                    if (oData && oData.results) {
                        console.log("Orders fetched successfully", oData.results);
                    } else {
                        MessageBox.warning("No orders found");
                    }
                })
                .catch((oError) => {
                    console.error("Error fetching Orders", oError);
                    MessageBox.error("Failed to fetch orders.");
                });
        },
        fetchCustomerDetails: function () {
            this.readOData("/Customers")
                .then((oData) => {
                    if (oData && oData.results) {
                        console.log("Customer Data: ", oData.results);
                    }
                    else {
                        MessageBox.warning("No Customer found");
                    }
                }).catch((err) => {
                    console.error("Error fetching Customer", err);
                    MessageBox.error("Failed to fetch Customers.");
                })
        },
        onGetStartedPress: function () {

            if (!this.GetStartedDialog) {
                this.GetStartedDialog = sap.ui.xmlfragment("sap.ui.demo.walkthrough.project1.view.GetStarted", this);
                this.getView().addDependent(this.GetStartedDialog);
            }
            this.GetStartedDialog.open();

        },
        onSideNavItemPress: function (oEvent) {
            console.log("Clicked");
            const sKey = oEvent.getSource().getText().toLowerCase();
            const oRoute = sap.ui.core.UIComponent.getRouterFor(this);
            switch (sKey) {
                case "dashboard":
                    oRoute.navTo("dashboard");
                    break;
                case "customers":
                    oRoute.navTo("customers");
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