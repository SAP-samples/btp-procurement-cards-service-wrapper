"use strict";

const cds = require("@sap/cds");
const logger = require("../util/logger");
const cloudSDK = require("@sap-cloud-sdk/core");
const axios = require('axios');
const envtype = process.env.TYPE;

async function doCreateContractWorkspace (req) {

    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let sParamUser = req.data.sUser ;

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    let oData = req.data;

    // 1. Validation
    if (!oData.sTitle || !oData.sCommodity || !oData.sSupplierId || !oData.sSMVendorId || !oData.sAmount || !oData.sRealm || !oData.sTemplateId || !oData.sCurrency || !sUser ) {
        logger.error("Missing mandatory fields");
        req.reject(400, "Missing mandatory fields, unable to progress");
    }

    // 2. Enrich / Create the payload
    let oPayload = Object.assign(_getHardcodedValues(oData.sCurrency), {
        title: oData.sTitle,
        description: oData.sTitle + " - Auto Created from SAP Work Zone",
        supplier: { systemID: oData.sSupplierId, smVendorID: oData.sSMVendorId },
        commodities: [{ domain: "unspsc", uniqueName: oData.sCommodity }]
    });
    oPayload.contractAmount.amount = oData.sAmount;
    oPayload.proposedContractAmount.amount = oData.sAmount;

    oPayload.templateId = oData.sTemplateId;


    // 3. Get Request Config & Enrich
    let sDestination = "Ariba_Contract-Workspace_" + oData.sRealm;
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    if (!oRequestConfig) {
        req.reject(404, "Error - no request config found for destination");
    }

    oRequestConfig.method = "post";
    oRequestConfig.url = "/modify-contract-workspaces/v1/prod/contractWorkspaces";
    oRequestConfig.data = oPayload;
    oRequestConfig.headers["apiKey"] = oDestination.originalProperties.destinationConfiguration.apiKey;
    oRequestConfig.headers["Content-Type"] = "application/json";
    oRequestConfig.params = {};
    oRequestConfig.params.realm = oDestination.originalProperties.destinationConfiguration.realm;
    oRequestConfig.params.user = sUser ;
    oRequestConfig.params.passwordAdapter = oDestination.originalProperties.destinationConfiguration.passwordAdapter || "PasswordAdapter1";

    logger.info("Payload is ",oRequestConfig.data);

    // 4. Create CW and respond contract ID
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        req.reject(400, "Error whiel calling the Ariba API"+ oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value[0].contractId;

}

function _getHardcodedValues (currency) {
    var oToday = new Date(new Date().setUTCHours(0,0,0,0)),
        oTodayTmp = new Date(oToday),
        oTodayIn6Months = new Date(oTodayTmp.setMonth(oTodayTmp.getMonth() + 6));
        //parameter for duration in the card itself + logic in the payload creation in the card too

    return {
        effectiveDate: oToday.toISOString(),
        agreementDate: oToday.toISOString(),
        expirationDate: oTodayIn6Months.toISOString(),
        contractAmount: {
            currency: currency
        },
        proposedContractAmount: {
            currency: currency
        },
        hierarchicalType: "StandAlone",
        expirationTermType: "Fixed",
        isTestProject: false
    };
}


async function doGetMyRecentContractWorkspaces (req) {
    let sLoggedUser = req.user && req.user.attr && req.user.attr.login_name && req.user.attr.login_name[0];
    let oData = req.data;
    let sUser = (envtype=='TEST') ? oData.sUser : sLoggedUser;

    if(!oData.sRealm || !sUser) {
        req.reject(400,'Missing parameters');
    }

    let sDestination = `Ariba_Contract-Workspace_${oData.sRealm}`;
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let sFilter = oData.sFilter ? "?" + oData.sFilter : "";

    oRequestConfig.url = "/retrieve-contract-workspaces/v1/prod/contractWorkspaces" + sFilter;
    oRequestConfig.headers["Content-Type"] = "application/json";
    oRequestConfig.headers["apiKey"] = oDestination.originalProperties.destinationConfiguration.apiKey;
    oRequestConfig.params = {};
    oRequestConfig.params.realm = oDestination.originalProperties.destinationConfiguration.realm;
    oRequestConfig.params.user = sUser ;
    oRequestConfig.params.passwordAdapter = oData.sPasswordAdapter;


    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    // Post processing logic
    // 1. Filter out those CWs where owner does not match the user
    let aContractWorkspaces = response.data && response.data.value || [];
    aContractWorkspaces = aContractWorkspaces.filter(function (oResponse) { return oResponse.owner && oResponse.owner.uniqueName === sUser; });
    // 2. Sort the result on timestamp (creation date)
    aContractWorkspaces = aContractWorkspaces.sort(function(a, b) {
        return new Date(b.creationDate) - new Date(a.creationDate);
    });
    // 3. Only respond with max amount of records as requested per iTop property
    aContractWorkspaces = aContractWorkspaces.slice(0, oData.iTop);

    return aContractWorkspaces.map(function (oResponse) {
        return {
            Suppliers           : oResponse.supplier && oResponse.supplier.name,
            ContractId          : oResponse.contractId,
            Title               : oResponse.title,
            ContractStatus      : oResponse.contractStatus,
            ExpirationDate_day  : oResponse.expirationDate,
            CreationDate_day    : oResponse.creationDate,
            Owner_UserId        : oResponse.owner && oResponse.owner.name
        }
    });
}


module.exports = {
    doCreateContractWorkspace,
    doGetMyRecentContractWorkspaces
};