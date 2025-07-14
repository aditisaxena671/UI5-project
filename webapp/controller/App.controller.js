sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/resource/ResourceModel",
  "sap/m/MessageToast",
  "sap/ui/core/Fragment",

], function (Controller, JSONModel, ResourceModel, MessageToast, Fragment) {
  "use strict";
  return Controller.extend("sap.ui.demo.walkthrough.project1.controller.App", {
      onInit: function () {
          var oData = {
              employee: {
                  name: "Aditi",
                  age: 25,
                  designation: "Developer"
              }
          };

          

          var oModel = new sap.ui.model.json.JSONModel(oData);
          this.getView().setModel(oModel);
      }
      ,
      onBeforeRendering: function () {
          // Called before the view is rendered
          console.log("onBeforeRendering called");

      },

      onNavigateToAbout: function () {
          console.log("Navigating to About view");
          var oApp = this.byId("app");
          oApp.to(this.byId("aboutPage"))

      },
      onNavigateToHome: function () {
          //read msg from i18n model
          var oBundel = this.getView().getModel("i18n").getResourceBundle();
          var sRecipent = this.getView().getModel().getProperty("/recipient/name");
          console.log("Recipient Name:", sRecipent);
          var sMsg = oBundel.getText("helloMsg", [sRecipent]);
          MessageToast.show(sMsg);
          console.log("Navigating to Home view");
          var oApp = this.byId("app");
          oApp.to(this.byId("homePage"));

      },
      // onOpenDialog: function () {
      //     // Open a dialog or perform any action
      //     console.log("Hello Panel opened!");
      //     var that= this;
      //     if(!this._oDialog){
      //         console.log("Creating new dialog instance for the first time");
      //         Fragment.load({
      //             name: "sap.ui.demo.walkthrough.project1.view.HelloDialog",
      //             controller:this,
      //         }).then(function(oDialog){
      //             that._oDialog=oDialog;
      //             that.getView().addDependent(that._oDialog);
      //             that._oDialog.open();
      //         });
      //     }
      //     else{
      //         console.log("Reusing existing dialog instance");
      //         this._oDialog.open();
      //     }

      // },
      onCloseDialog: function () {
          // Close the dialog
          if (this._oDialog) {
              console
              this._oDialog.close();
          }
      }
  })
})