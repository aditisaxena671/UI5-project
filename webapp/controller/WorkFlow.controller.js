sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox',
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",

], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, Dialog) {
    "use strict";
    let _initialized = false;
    return Controller.extend("sap.ui.demo.walkthrough.project1.controller.WorkFlow", {
        onInit: function () {
            if (_initialized) {
                console.log("Controller already initialized globally");
                return;
            }
            sap.ui.core.routing.HashChanger.getInstance().setHash("dashboard");
            _initialized = true;
            this.pageSize = 10;
            this.currentSkip = 0;
            this.pageNo=1;
            console.log("going to call api");
            this.loadProductData();
            // this.fetchOrderData();
            // this.fetchCustomerDetails();
        },
        readOData: function (sPath, mParameters = {}) {
            return new Promise((resolve, reject) => {
                this.getOwnerComponent().getModel("Northwind").read(sPath, {
                    success: resolve,
                    error: reject,
                    urlParameters: mParameters
                });
            });
        },
        loadProductData: function () {
            console.log("Loading data for product");
            var oModel = new JSONModel();
            var sPath = "/Products";
            var mParams = {
                $top: this.pageSize,
                $skip: this.currentSkip
            }
            console.log(`Calling URL: ${sPath}?$top=${mParams.$top}&$skip=${mParams.$skip}`);
            console.log(`Calling URL: /Products?$top=${this.pageSize}&$skip=${this.currentSkip}`);

            // this.readOData(`/Products?$top=${this.pageSize}&$skip=${this.currentSkip}`)
            this.readOData(sPath, mParams)
                .then((oData) => {
                    if (oData && oData.results) {
                        oModel.setData({ results: oData.results });
                        this.getView().setModel(oModel, "pagedProducts");
                        this.getView().byId("productTable").getBinding("items").refresh(true);
                        console.log("Data for Product successfully", oData.results);
                    }
                    else {
                        MessageBox("Can't fetch Product");
                    }
                }).catch((err) => {
                    console.error("Error fetching Products", err);
                    MessageBox.error("Failed to fetch orders.");
                })
        },
        loadPreviousProductData: function () {
            if(this.currentSkip<=0){
                MessageBox.alert("You are on the first Page :)");
            }
            else if (this.currentSkip >= this.pageSize) {
                this.currentSkip -= this.pageSize;
                this.loadProductData();
            }
        },
        loadNextProductData: function () {
            this.currentSkip += this.pageSize;
            this.loadProductData();

        },

        fetchOrderData: function () {

            console.log("inside fetchOrderData")
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
            sap.ui.getCore().byId("PreviousButton").setEnabled(false);

        },
        PreviousNav:function(oEvent){
            if(this.pageNo==3){
                sap.ui.getCore().byId("NextButton").setEnabled(true);
                this.pageNo--;
                sap.ui.getCore().byId("step3").setVisible(false);
                sap.ui.getCore().byId("step2").setVisible(true);
            }
            else if(this.pageNo==2){
                this.pageNo--;
                sap.ui.getCore().byId("step2").setVisible(false);
                sap.ui.getCore().byId("step1").setVisible(true);
                sap.ui.getCore().byId("PreviousButton").setEnabled(false);
            }
        },
        NextNav:function(){
            if(this.pageNo==1){
                sap.ui.getCore().byId("PreviousButton").setEnabled(true);
                this.pageNo++;
                sap.ui.getCore().byId("step1").setVisible(false);
                sap.ui.getCore().byId("step2").setVisible(true);
            }
            else if(this.pageNo==2){
                this.pageNo++;
                sap.ui.getCore().byId("step2").setVisible(false);
                sap.ui.getCore().byId("step3").setVisible(true);
                sap.ui.getCore().byId("NextButton").setEnabled(false);
            }
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
                case "orders":
                    oRoute.navTo("orders");
                    break;
                case "products":
                    oRoute.navTo("products");
                    break;
                default:
                    console.log("Default Treggered");
                    break;


            }
        },
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
        onCancelCrderDetailDialog: function () {
            // this.customerDetailsDialog.unbindElement();
            this.customerDetailsDialog.close();
        },
        onRowPress: function (oEvent) {
            console.log("Row Pressed");
            var sPath = oEvent.getSource().getBindingContext("Northwind").getPath();
            if (!this.customerDetailsDialog) {
                this.customerDetailsDialog = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.demo.walkthrough.project1.view.CustomerDetail", this);
                this.getView().addDependent(this.customerDetailsDialog);
            }
            var oModel = this.getView().getModel("Northwind");
            this.getView().byId("customerDetailsDialog").setModel(oModel, "Northwind");

            this.getView().byId("customerDetailsDialog").bindElement({
                path: sPath,
                model: "Northwind",
                parameters: { "expand": "Orders" }
            });
            this.getView().byId("customerDetailsDialog").getModel("Northwind").refresh(true);
            this.customerDetailsDialog.open();
        },
        
        // onCustomerPress:function(oEvent){
        //     const oRoute = sap.ui.core.UIComponent.getRouterFor(this);
        //     oRoute.navTo("FullCustomerDetail");
        //     var sPath= oEvent.getSource().getBindingContext("Northwind").getPath();
        //     // this.getView().byId("customerObjectPage").bindElement({
        //     //     path: sPath,
        //     //     model: "Northwind",
        //     //     parameters: { "expand": "Orders" }
        //     // });
        // },


        onCustomerPress: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var sPath = oEvent.getSource().getBindingContext("Northwind").getPath(); // e.g. /Customers(1)
        
            // Get the Customer ID or another unique identifier
            var oCustomer = oEvent.getSource().getBindingContext("Northwind").getObject();
            var sCustomerID = oCustomer.CustomerID;
        
            // Navigate and pass the ID
            oRouter.navTo("FullCustomerDetail", {
                customerId: sCustomerID
            });
        },        
        onChange: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var searchFilter = [];
            // console.log(sQuery);
            if (sQuery && sQuery.length > 0) {
                var filter1 = new Filter("ContactName", FilterOperator.Contains, sQuery);
                var filter2 = new Filter("CompanyName", FilterOperator.Contains, sQuery);
                var filter3 = new Filter("ContactTitle", FilterOperator.Contains, sQuery);
                var filter4 = new Filter("Country", FilterOperator.Contains, sQuery);
                var filter5 = new Filter("Phone", FilterOperator.Contains, sQuery);
                var finalFilter = new Filter([filter1, filter2, filter3, filter4, filter5], false)
                searchFilter.push(finalFilter);
            }
            var oTable = this.byId("cutomerTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(searchFilter);
        },
        onHideOrShowColumnChange: function () {
            if (!this.oColumnSelection) {
                this.oColumnSelection = new Dialog({
                    id: "hideShowDialog",
                    title: "Select Columns to show",
                    contentWidth: "550px",
                    contentHeight: "300px",
                    content: [
                        new sap.m.List({
                            id: "hideShowList",
                            mode: "MultiSelect",
                            items: [
                                new sap.m.StandardListItem({
                                    title: "Order Id",
                                    selected: this.getView().byId("ShowDialogTable").getColumns()[0].getVisible()
                                }),
                                new sap.m.StandardListItem({
                                    title: "Customer",
                                    selected: this.getView().byId("ShowDialogTable").getColumns()[1].getVisible()
                                }),
                                new sap.m.StandardListItem({
                                    title: "Order Date",
                                    selected: this.getView().byId("ShowDialogTable").getColumns()[2].getVisible()
                                }),
                                new sap.m.StandardListItem({
                                    title: "Ship City",
                                    selected: this.getView().byId("ShowDialogTable").getColumns()[3].getVisible()
                                }),
                                new sap.m.StandardListItem({
                                    title: "Shipped Date",
                                    selected: this.getView().byId("ShowDialogTable").getColumns()[4].getVisible()
                                })
                            ]

                        }),
                        new sap.m.Button({
                            text: "Reset",
                            press: function () {
                                var list = sap.ui.getCore().byId("hideShowList");
                                list.getItems().forEach(function (items) {
                                    items.setSelected(true);
                                });
                                var column = this.getView().byId("ShowDialogTable").getColumns();

                                list.getItems().forEach(function (item, index) {
                                    column[index].setVisible(item.getSelected());
                                });
                                this.oColumnSelection.close();
                            }.bind(this)
                        })


                    ],
                    beginButton: new sap.m.Button({
                        text: "Apply",
                        press: function () {
                            // this.getView().byId("ShowDialogTable").getColumns()[0].setVisible(this.getView().byId(hideShowDialog).getList()[0].getSelected());
                            var list = sap.ui.getCore().byId("hideShowList");
                            var column = this.getView().byId("ShowDialogTable").getColumns();

                            list.getItems().forEach(function (item, index) {
                                column[index].setVisible(item.getSelected());
                            });
                            this.oColumnSelection.close();
                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function () {
                            this.oColumnSelection.close();
                        }.bind(this)
                    })
                });
                this.getView().addDependent(this.oColumnSelection);
            }
            this.oColumnSelection.open();
        },
        loadPreviousDataProduct: function () {

        }
    });
});