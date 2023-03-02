"use strict";

const cds = require("@sap/cds");
const logger = require("../util/logger");
const cloudSDK = require("@sap-cloud-sdk/core");
const axios = require('axios');

async function doCreateProcurementWorkspace (req) {

    let oData = req.data ;
    let sUser = req.data.sUser ;

    // 1. Validation
    if (!oData.sTitle || !oData.sDesc || !oData.sDateVal1 || !oData.sDateVal2 || !oData.sSupplierId || !oData.sRealm || !oData.sTemplateId ) {
        logger.error("Missing mandatory fields");
        req.reject(400, "Missing mandatory fields, unable to progress");
    }

    // 2. Enrich / Create the payload
    let oPayload = Object.assign(_getHardcodedValues(sUser, oData.sRealm));

    oPayload.Title = oData.sTitle;
    oPayload.Description = oData.sDesc;
    oPayload.ProcurementStartDate = oData.sDateVal1;
    oPayload.ProcurementEndDate = oData.sDateVal2;
    oPayload.Suppliers = [{ SystemID: oData.sSupplierId }];
    oPayload.TemplateId = oData.sTemplateId;

    // 3. Get Request Config & Enrich
    let sDestination = "Ariba_Procurement-Workspace_" + oData.sRealm;
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);


    if (!oRequestConfig) {
        req.reject(404, "Error - no request config found for destination");
    }

    oRequestConfig.method = "post";
    oRequestConfig.url = "procurementWorkspaces";
    oRequestConfig.data = oPayload;
    oRequestConfig.headers["apiKey"] = oDestination.originalProperties.destinationConfiguration.apiKey;
    oRequestConfig.headers["Content-Type"] = "application/json";
    oRequestConfig.params = {};
    oRequestConfig.params.realm = oDestination.originalProperties.destinationConfiguration.realm;
    oRequestConfig.params.user = sUser  || oData.sUser || oDestination.originalProperties.destinationConfiguration.user;
    oRequestConfig.params.passwordAdapter = oDestination.originalProperties.destinationConfiguration.passwordAdapter || "PasswordAdapter1";

    // 4. Create PW and respond url
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.url;

}

function _getHardcodedValues (sUser, sRealm) {
    return {
        IsSubProject: false,
        IsCopyParentDocument: false,
        IsCopyParentGroups: false,
        ProcurementType: "Strategy and Analysis",
        PricingStructure: "FixedFee",
        BaseLanguage: "en",
        ProjectDeliverables: "Petro",
        SourceApplicationSite: sRealm,
        IsTest: true,
        Client: [ { DepartmentID: "300" } ],
        Commodity: [ { Domain: "unspsc", UniqueName: "4319" } ],
        ProjectLead: { UniqueName: sUser, PasswordAdapter: "PasswordAdapter1" },
        Owner: { UniqueName: sUser, PasswordAdapter: "PasswordAdapter1" },
        Region: [ { UniqueName: "FRA" } ]
    };
}

module.exports = {
    doCreateProcurementWorkspace
};