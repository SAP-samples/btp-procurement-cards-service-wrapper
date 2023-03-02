"use strict";

const cds = require("@sap/cds");
const logger = require("../util/logger");
const cloudSDK = require("@sap-cloud-sdk/core");
const moment = require("moment");
const axios = require('axios');
const envtype = process.env.TYPE;


async function doGetMyConsumedContracts(req){
    
    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');


    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let top = 5;
    let filter = `Realm eq '${sRealm}' and Contact_UserId eq '${sUser}' and Status eq 'Open'`;
    //Only for DataLake select, still serialized to full Contract Object on results sent
    let select = 'ContractId,Description,AmountPercentLeft,Duration,AmountLeft,ExpirationDate_day'; 
    let orderby= 'AmountPercentLeft asc'

    oRequestConfig.method = "get";
    oRequestConfig.url = `Contracts?$top=${top}&$filter=${filter}&$select=${select}&$orderby=${orderby}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value;

}

async function doGetMyContractWorkspaces(req){
    
    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let top = 5;
    let filter = `Realm eq '${sRealm}' and Owner_UserId eq '${sUser}'`;
    //Only for DataLake select, still serialized to full Contract Object on results sent
    let select = 'ContractId,Description,ContractStatus,ExpirationDate_day'; 
 
    let orderby= 'createdAt desc'

    oRequestConfig.method = "get";
    oRequestConfig.url = `ContractWorkspaces?$top=${top}&$filter=${filter}&$select=${select}&$orderby=${orderby}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value;

}

async function doGetMyExpiringContracts(req){
    
    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');


    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let top = 5;
    let filter = `Realm eq '${sRealm}' and Contact_UserId eq '${sUser}' and ExpirationDate_day lt now()`;
    //Only for DataLake select, still serialized to full Contract Object on results sent
    let select = 'ContractId,Description,MaxCommitment,OrigCurrencyCode,AmountLeft,Status,ExpirationDate_day';  
    let orderby= 'ExpirationDate_day desc'

    oRequestConfig.method = "get";
    oRequestConfig.url = `Contracts?$top=${top}&$filter=${filter}&$select=${select}&$orderby=${orderby}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value;

}

async function doGetMyRequisitions(req){
    
    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');


    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let top = 10;
    let filter = `Realm eq '${sRealm}' and Requester_UserId eq '${sUser}' and LineType ne 'Tax'`;
    //Only for DataLake select, still serialized to full Contract Object on results sent
    let select = 'RequisitionId,TitleString,Description,StatusString';  
    let orderby= 'createdAt desc'

    oRequestConfig.method = "get";
    oRequestConfig.url = `RequisitionLineItems?$top=${top}&$filter=${filter}&$select=${select}&$orderby=${orderby}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value;

}

async function doGetMySourcingEvents (req) {
    let sLoggedUser = req.user && req.user.attr && req.user.attr.login_name && req.user.attr.login_name[0];
    let oData = req.data;
    let sUser = (envtype=='TEST') ? oData.sParamUser : sLoggedUser;

    if(!oData.sRealm || !sUser) {
        req.reject(400,'Missing parameters');
    }

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    // sFilter does not include the filter for Realm and User - this would need to be added
    let sFilterOnRealm = "Realm eq '" + oData.sRealm + "'";
    let sFilterOnUser = "";
    if (oData.bFilterOnUser) {
        sFilterOnUser = " and Owner_UserId eq '" + sUser + "'";
    }
    let sFilterNotCompleted = "";
    if (!oData.bIncludeCompleted) {
        let now = moment.utc().format();
        sFilterNotCompleted = " and EventEndDate_Day gt " + now;
    }

    //Query filter (working around axios param serializing issue)
    let sSelect = oData.sSelect || "$select=Realm,EventId,ItemId,Owner_UserId,InvitedSuppliers,AcceptedSuppliers,ParticipSuppliers,EventStartDate_Day,EventEndDate_Day";
    let sTop = oData.sTop || "$top=10";
    let sFilter = "$filter=" + sFilterOnRealm + sFilterOnUser + sFilterNotCompleted;
    let sExpand = oData.sExpand || "$expand=Department,Commodity";
    let sOrderBy = oData.sOrderBy || "$orderby=EventEndDate_Day desc";

    oRequestConfig.url = "EventSummary?" + sSelect + "&" + sFilter + "&" + sExpand + "&" + sOrderBy + "&" + sTop + "&" + oData.sSkip;
    oRequestConfig.method = "get";
    oRequestConfig.headers["Content-Type"] = "application/json";

    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    let aEvents = response.data && response.data.value || [];
    aEvents.forEach(function (oResponse) {
        var sCommodities = "";
        oResponse.Commodity && oResponse.Commodity.forEach(function (oCommodity) {
            if (sCommodities.length === 0) {
                sCommodities += oCommodity.Commodity_CommodityId;
            } else {
                sCommodities += ';' + oCommodity.Commodity_CommodityId;
            }
        });
        oResponse.Commodities = sCommodities;

        var sDepartments = "";
        oResponse.Department && oResponse.Department.forEach(function (oDepartment) {
            if (sDepartments.length === 0) {
                sDepartments += oDepartment.Department_OrganizationId;
            } else {
                sDepartments += ';' + oDepartment.Department_OrganizationId;
            }
        });
        oResponse.Departments = sDepartments;

    });

    return response.data.value;

}

async function doGetMySourcingProjects(req){

    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');


    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let top = 10;
    let filter = `Realm eq '${sRealm}' and Owner_UserId eq '${sUser}'`;
    //Only for DataLake select, still serialized to full Contract Object on results sent
    let select = 'ProjectId,EventType_EventType,OnTimeOrLate,State,PlannedStartDate_day,PlannedEndDate_day';  
    let orderby= 'createdAt desc'

    oRequestConfig.method = "get";
    oRequestConfig.url = `SourcingProjects?$top=${top}&$filter=${filter}&$select=${select}&$orderby=${orderby}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value;

}

async function doGetMyPendingInvoices(req){

    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');


    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let top =  ( oQueryOptions && oQueryOptions.top ) || 10;
    let filter = `Realm eq '${sRealm}' and Requester_UserId eq '${sUser}' and InvoiceStatus eq 'Reconciling'`;
    //Only for DataLake select, still serialized to full Contract Object on results sent
    let select = 'InvoiceId,Description,InvoiceDateCreated_day,ShipFromLocation_LocationId,OrigAmountInvoiced,OrigCurrencyCode,ReconciliationStatus,InvoiceStatus';  
    let orderby= 'InvoiceDate_day desc'

    oRequestConfig.method = "get";
    oRequestConfig.url = `InvoiceLineItems?$top=${top}&$filter=${filter}&$select=${select}&$orderby=${orderby}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value;

}

async function getOffContractSpendBySupplier (req) {

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sFilter = ( oQueryOptions && oQueryOptions.sFilter );
    let sTop = ( oQueryOptions && oQueryOptions.sTop );

    if( !sRealm)
        req.reject(400,'Missing parameters');

    //leveraging API consumer service as external client
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    let filter = `Realm eq '${sRealm}' and Contract_ContractId eq ''`;
    let apply = `groupby((Supplier_SupplierId,Contract_ContractId,Realm),aggregate(Amount with sum as Count))`;
    let orderby = `Count desc`;


    oRequestConfig.method = "get";
    oRequestConfig.url = `PurchaseOrderLineItems?$filter=${filter}&$apply=${apply}&$orderby=${orderby}&$top=${sTop}`;
    oRequestConfig.headers["Content-Type"] = "application/json";

    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    return oResults && oResults.data && oResults.data.value && oResults.data.value.map(function (oResult) {
        return {
            Realm: oResult.Realm,
            SupplierId: oResult.Supplier_SupplierId,
            Amount: oResult.Count
        };
    });

}

async function getRequisitionApprovalTimePerApprover (req) {

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sFilter = ( oQueryOptions && oQueryOptions.sFilter );
    let sTop = ( oQueryOptions && oQueryOptions.sTop );

    if( !sRealm)
        req.reject(400,'Missing parameters');

    //leveraging API consumer service as external client
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    let filter = `Realm eq '${sRealm}' and ApprovableType eq 'ariba.purchasing.core.Requisition' and ApprovalState eq 'Approved'`;
    let apply = `groupby((Approver,Realm,ApprovableType,ApprovalState),aggregate(ApprovalTime with average as duration))`;
    let orderby = `duration desc`;


    oRequestConfig.method = "get";
    oRequestConfig.url = `Approval?$filter=${filter}&$apply=${apply}&$orderby=${orderby}&$top=${sTop}`;
    oRequestConfig.headers["Content-Type"] = "application/json";

    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    return oResults && oResults.data && oResults.data.value && oResults.data.value.map(function (oResult) {
        return {
            Realm: oResult.Realm,
            ApprovalTimeInDays: Math.round(oResult.duration / 864) / 100,
            Approver: oResult.Approver,
            ApprovalType: oResult.ApprovableType,
            ApprovalState: oResult.ApprovalState
        };
    });

}

async function getSuppliersInRegistrationProcess (req) {

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sFilter = ( oQueryOptions && oQueryOptions.sFilter );
    let sTop = ( oQueryOptions && oQueryOptions.sTop );

    if( !sRealm)
        req.reject(400,'Missing parameters');

    //leveraging API consumer service as external client
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    let filter = `Realm eq '${sRealm}'`;
    let apply = `groupby((Realm,RegistrationStatus),aggregate($count as amount))`;
    let orderby = `amount desc`;


    oRequestConfig.method = "get";
    oRequestConfig.url = `SLPSuppliers?$filter=${filter}&$apply=${apply}&$orderby=${orderby}&$top=${sTop}`;
    oRequestConfig.headers["Content-Type"] = "application/json";

    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    return oResults && oResults.data && oResults.data.value && oResults.data.value.map(function (oResult) {
        return {
            Realm: oResult.Realm,
            Amount: oResult.amount,
            RegistrationStatus: oResult.RegistrationStatus
        };
    });

}

async function getTopSuppliersByAwardedAmountInSourcingEvents (req) {

    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );
//    let bFilterOnUser = ( oQueryOptions && oQueryOptions.bFilterOnUser );
    let sFilter = ( oQueryOptions && oQueryOptions.sFilter );
    let sTop = ( oQueryOptions && oQueryOptions.sTop );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');

    //leveraging API consumer service as external client
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    let filter = `Realm eq '${sRealm}' and AwardedFlag eq true`;
    let apply = `groupby((SupplierId,Realm,AwardedFlag,SupplierName),aggregate(AwardedAmount with sum as amount))`;
    let orderby = `amount desc`;


    oRequestConfig.method = "get";
    oRequestConfig.url = `SupplierParticipations?$filter=${filter}&$apply=${apply}&$orderby=${orderby}&$top=${sTop}`;
    oRequestConfig.headers["Content-Type"] = "application/json";

    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    return oResults && oResults.data && oResults.data.value && oResults.data.value.map(function (oResult) {
        return {
            Realm: oResult.Realm,
            Amount: oResult.amount,
            SupplierId: oResult.SupplierId,
            SupplierName: oResult.SupplierName
        };
    });

}

async function getTopSourcedCommodities (req) {

    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );
//    let bFilterOnUser = ( oQueryOptions && oQueryOptions.bFilterOnUser );
    let sFilter = ( oQueryOptions && oQueryOptions.sFilter );
    let sTop = ( oQueryOptions && oQueryOptions.sTop );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm)
        req.reject(400,'Missing parameters');

    //leveraging API consumer service as external client
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    let filter = `SourcingProject_Realm eq '${sRealm}' and Commodity_CommodityId ne ''`;
    let apply = `groupby((Commodity_CommodityId,SourcingProject_Realm,CommodityCode_Name),aggregate($count as Count))`;
    let orderby = `Count desc`;


    oRequestConfig.method = "get";
    oRequestConfig.url = `SourcingProjects_Commodity?$filter=${filter}&$apply=${apply}&$orderby=${orderby}&$top=${sTop}`;
    oRequestConfig.headers["Content-Type"] = "application/json";

    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    return oResults && oResults.data && oResults.data.value && oResults.data.value.map(function (oResult) {
        return {
            Realm: oResult.SourcingProject_Realm,
            Count: oResult.Count,
            CommodityCode: oResult.Commodity_CommodityId,
            CommodityName: oResult.CommodityCode_Name
        };
    });

}

async function doGetMySpendPerQuarter (req) {


    let sLoggedUser = req.user.attr.login_name && req.user.attr.login_name[0];

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );
    let sParamUser = ( oQueryOptions && oQueryOptions.user );
    let sReportingCurrency = ( oQueryOptions && oQueryOptions.reportingCurrency );

    let sUser = (envtype=='TEST')?sParamUser:sLoggedUser;

    if(!sUser || !sRealm || !sReportingCurrency)
        req.reject(400,'Missing parameters');


    const startRange = moment.utc(moment().quarter(moment().quarter()-3).startOf('quarter')).format();
    const endRange = moment.utc(moment().quarter(moment().quarter()).endOf('quarter')).format();

    //leveraging API consumer service as external client 
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
   
    let filter = `Realm eq '${sRealm}' and Requester_UserId eq '${sUser}' and RequisitionDate_day gt ${startRange} and RequisitionDate_day lt ${endRange}`;
    let select = 'Amount,LineItemCount,RequisitionDate_day';  
  
    oRequestConfig.method = "get";
    oRequestConfig.url = `RequisitionLineItems?$top=5000&$filter=${filter}&$select=${select}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    
    if (!oResults.data && !oResults.data.value) return;

    let aRequisitions = oResults.data.value;
    let year = moment(startRange).year() == moment(endRange).year() ? moment(startRange).year() : moment(startRange).year() +"-"+ moment(endRange).year();
    let oResponse = {
        DataCount:          aRequisitions.length,
        OverallAmount:      aRequisitions.reduce((a, b) => a + (b["Amount"] || 0), 0).toFixed(2),
        OverallCurrency:    sReportingCurrency,
        AvgLineItemCount:   aRequisitions.length === 0 ? 0 : (aRequisitions.reduce((a, b) => a + (b["LineItemCount"] || 0), 0) / aRequisitions.length).toFixed(2),
        User:               sUser,
        Trend:              null,
        Year:               year,
        QuarterAmount:      []
    };
    oResponse.QuarterAmount.push(_calcSendPerQuarter( 3, aRequisitions,sReportingCurrency));
    oResponse.QuarterAmount.push(_calcSendPerQuarter( 2, aRequisitions,sReportingCurrency));
    oResponse.QuarterAmount.push(_calcSendPerQuarter( 1, aRequisitions,sReportingCurrency));
    oResponse.QuarterAmount.push(_calcSendPerQuarter( 0, aRequisitions,sReportingCurrency));

    oResponse.Trend = oResponse.QuarterAmount[1].Amount<=oResponse.QuarterAmount[2].Amount?"Up":"Down";

    return oResponse;
}

function _calcSendPerQuarter (iQuarterOffset, aRequisitions,reportingCurrency) {
    
    const startRange = moment.utc(moment().quarter(moment().quarter()-iQuarterOffset).startOf('quarter')).format();
    const endRange = moment.utc(moment().quarter(moment().quarter()-iQuarterOffset).endOf('quarter')).format();

    let aRequisitionsFiltered = aRequisitions.filter(i=>moment(i.RequisitionDate_day).isAfter(startRange) && moment(i.RequisitionDate_day).isBefore(endRange) );

    return {
        Quarter:    moment(startRange).year()+ "Q" + moment(startRange).quarter(),
        Year:       moment(startRange).year().toString(),
        Amount:     !aRequisitionsFiltered ? 0 : aRequisitionsFiltered.reduce((a, b) => a + (b["Amount"] || 0), 0),
        Currency:   reportingCurrency,
        DataCount:  aRequisitionsFiltered.length
    };
}

async function doGetContractVsNonContractSpend (req) {

    
    let oQueryOptions = req.getUriInfo().getQueryOptions();

    let sRealm = ( oQueryOptions && oQueryOptions.realm ) ;
    let sTarget = ( oQueryOptions && oQueryOptions.target ) ;
    let sReportingCurrency = ( oQueryOptions && oQueryOptions.reportingCurrency );
    let sFromDate = ( oQueryOptions && oQueryOptions.fromDate ) ;

    if(!sTarget || !sRealm || !sReportingCurrency || !sFromDate)
        req.reject(400,'Missing parameters');

    const dFromDate = moment.utc(sFromDate).format();


    
    //leveraging API consumer service as external client 
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)

    let filter = `Realm eq '${sRealm}' and OrderedDate_day gt ${dFromDate}`;
    let select = 'Amount,Contract_ContractId';  
  
    oRequestConfig.method = "get";
    oRequestConfig.url = `PurchaseOrderLineItems?$top=5000&$filter=${filter}&$select=${select}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    
    if (!oResults.data && !oResults.data.value) return;

    let aPurchaseOrderLineItems = oResults.data.value;
    

    let aContractPO = aPurchaseOrderLineItems.filter(p=>p.Contract_ContractId!='');
    let aNonContractPO = aPurchaseOrderLineItems.filter(p=>p.Contract_ContractId=='');
    let OverallAmount = aPurchaseOrderLineItems.reduce((a, b) => a + (b["Amount"] || 0), 0).toFixed(2);
    let ContractAmount = aContractPO.reduce((a,b)=>a+(b.Amount||0),0).toFixed(2);

    let PercentageContractSpend= ((ContractAmount*100)/OverallAmount).toFixed(2);
    let oResponse = {
        DataCount:          aPurchaseOrderLineItems.length,
        OverallAmount:      OverallAmount,
        PercentageContractSpend: PercentageContractSpend,
        OverallCurrency:    sReportingCurrency,
        State:                  PercentageContractSpend>=parseFloat(sTarget)?"Good":"Error",
        Deviation:              PercentageContractSpend-parseFloat(sTarget),
        Spends:      []
    };

    oResponse.Spends.push({
        Type:"Contract",
        TotalAmount: ContractAmount,
    });
    oResponse.Spends.push({
        Type:"Non Contract",
        TotalAmount: aNonContractPO.reduce((a,b)=>a+(b.Amount||0),0).toFixed(2),
    });

    return oResponse;
}

async function doGetCatalogVsNonCatalogSpend (req) {

    
    let oQueryOptions = req.getUriInfo().getQueryOptions();

    let sRealm = ( oQueryOptions && oQueryOptions.realm ) ;
    let sTarget = ( oQueryOptions && oQueryOptions.target ) ;
    let sReportingCurrency = ( oQueryOptions && oQueryOptions.reportingCurrency );
    let sFromDate = ( oQueryOptions && oQueryOptions.fromDate ) ;

    if(!sTarget || !sRealm || !sReportingCurrency || !sFromDate)
        req.reject(400,'Missing parameters');

    
    const dFromDate = moment.utc(sFromDate).format();

    
    //leveraging API consumer service as external client 
    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)

    let filter = `Realm eq '${sRealm}' and OrderedDate_day gt ${dFromDate}`;
    let select = 'Amount,LineType';  
  
    oRequestConfig.method = "get";
    oRequestConfig.url = `PurchaseOrderLineItems?$top=5000&$filter=${filter}&$select=${select}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
    let oResults = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    
    if (!oResults.data && !oResults.data.value) return;

    let aPurchaseOrderLineItems = oResults.data.value;

    let aNonCatalogPO = aPurchaseOrderLineItems.filter(p=>p.LineType=='NonCatalog');
    let aCatalogPO = aPurchaseOrderLineItems.filter(p=>p.LineType=='Catalog');
    let aCatNonCatPO = aNonCatalogPO.concat(aCatalogPO);
    let OverallAmount = aCatNonCatPO.reduce((a, b) => a + (b["Amount"] || 0), 0).toFixed(2);
    let CatalogAmount = aCatalogPO.reduce((a,b)=>a+(b.Amount||0),0).toFixed(2);

    let PercentageCatalogSpend = ((CatalogAmount*100)/OverallAmount).toFixed(2);

    let oResponse = {
        DataCount:              aCatNonCatPO.length,
        OverallAmount:          OverallAmount,
        PercentageCatalogSpend: PercentageCatalogSpend,
        State:                  PercentageCatalogSpend>=parseFloat(sTarget)?"Good":"Error",
        Deviation:              PercentageCatalogSpend-parseFloat(sTarget),
        OverallCurrency:        sReportingCurrency,
        Spends:                 []
    };

    oResponse.Spends.push({
        Type:"Catalog",
        TotalAmount: CatalogAmount,
    });
    oResponse.Spends.push({
        Type:"Non Catalog",
        TotalAmount: aNonCatalogPO.reduce((a,b)=>a+(b.Amount||0),0).toFixed(2),
    });

    return oResponse;
}

async function doGetSourcingProjectsPerRegion (req) {
      
    let oQueryOptions = req.getUriInfo().getQueryOptions();

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)

    let filter = `Region_RegionId ne ''`; 
    let apply= 'groupby((Region_RegionId),aggregate(ID with countdistinct as Count))'

    oRequestConfig.method = "get";
    oRequestConfig.url = `SourcingProjects_Region?$top=5000&$apply=${apply}&$filter=${filter}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    let oResult = [];
    for (let r of response.data.value){
        oResult.push({Count:r.Count,Region_RegionId:r.Region_RegionId});
    }
    return oResult;
}

async function doGetInvoiceExceptions (req) {

  
    let oQueryOptions = req.getUriInfo().getQueryOptions();

    let sRealm = ( oQueryOptions && oQueryOptions.realm ) ;
    let sFromDate = ( oQueryOptions && oQueryOptions.fromDate ) ;

    if(!sRealm || !sFromDate)
        req.reject(400,'Missing parameters');

    
    const dFromDate = moment.utc(sFromDate).format();

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)

    let filter = `Realm eq '${sRealm}' and InvoiceDate_day gt ${dFromDate}`;
    let apply= 'groupby((ExceptionTypeId),aggregate(InvoiceId with countdistinct as Total))';

    oRequestConfig.method = "get";
    oRequestConfig.url = `InvoiceExceptions?$top=5000&$apply=filter(${filter})/${apply}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    let oResult = [];
    for (let r of response.data.value){
        oResult.push({Total:r.Total,ExceptionTypeId:r.ExceptionTypeId});
    }
    return oResult;
}

async function doGetInvoicePaymentTime (req) {

  
    let oQueryOptions = req.getUriInfo().getQueryOptions();

    let sRealm = ( oQueryOptions && oQueryOptions.realm ) ;

    if(!sRealm )
        req.reject(400,'Missing parameters');
    
    let monthlyRange = 13; //range of 24 month back
    const startRange = moment.utc().subtract(monthlyRange,'month').startOf('month').format();
    const endRange = moment.utc().subtract(1,'month').endOf('month').format();

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)

    let filter = `Realm eq '${sRealm}' and PaidDate_day gt ${startRange} and PaidDate_day lt ${endRange}`;
    let select= 'PaidDate_day,InvoiceDate_day';

    oRequestConfig.method = "get";
    oRequestConfig.url = `InvoiceLineItems?$top=5000&$filter=${filter}&$select=${select}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    let aInvoices = response.data.value;
    let oResult = [];
    for (let i = monthlyRange; i > 0; i--) {
       
        oResult.push({
            Month:moment.utc().subtract(i,'month').format('MMM') + '_'+moment.utc().subtract(i,'month').format('YY'),
            PaymentTimeAverage:_calcPaymentMonthlyAvg(i,aInvoices)});
        
    }

    
    return oResult;
}

function _calcPaymentMonthlyAvg (iMonthOffset, aInvoices){
    let startRange = moment.utc().subtract(iMonthOffset,'month').startOf('month').format();
    let endRange = moment.utc().subtract(iMonthOffset,'month').endOf('month').format();

    let aInvoicesFiltered = aInvoices.filter(i=>moment(i.PaidDate_day).isAfter(startRange) && moment(i.PaidDate_day).isBefore(endRange) );

    let cumulativePaymentTime=0;
    for (const inv of aInvoicesFiltered) {
      let pd = moment(inv.PaidDate_day);      
      let id = moment(inv.InvoiceDate_day);
      cumulativePaymentTime += pd.diff(id,'days');
    }

    let monthlyPaymentAvg = aInvoicesFiltered.length >0 ? cumulativePaymentTime/aInvoicesFiltered.length : 0;

    return monthlyPaymentAvg;
}

async function doGetInvoiceByStatus (req) {

  
    let oQueryOptions = req.getUriInfo().getQueryOptions();

    let sRealm = ( oQueryOptions && oQueryOptions.realm ) ;
    let sFromDate = ( oQueryOptions && oQueryOptions.fromDate ) ;

    if(!sRealm || !sFromDate)
        req.reject(400,'Missing parameters');

    
    const dFromDate = moment.utc(sFromDate).format();

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    let filter = `Realm eq '${sRealm}' and InvoiceDate_day gt ${dFromDate}`;
    let apply= 'groupby((ReconciliationStatus),aggregate(InvoiceId with countdistinct as Total))';

    oRequestConfig.method = "get";
    oRequestConfig.url = `InvoiceLineItems?$top=5000&$apply=filter(${filter})/${apply}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });
    let oResult = [];
    for (let r of response.data.value){
        oResult.push({Total:r.Total,Status:r.ReconciliationStatus});
    }
    return oResult;
}

async function doGetSupplierParticipation (req) {
    

    let oQueryOptions = req.getUriInfo().getQueryOptions();
    let sRealm = ( oQueryOptions && oQueryOptions.realm );   

    if(!sRealm )
        req.reject(400,'Missing parameters');


    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)

    let filter = `Realm eq '${sRealm}'`; 
    let select = 'AcceptedFlag'; 
    let apply= 'groupby((Realm,AcceptedFlag),aggregate(EventId with countdistinct as Count))'

    oRequestConfig.method = "get";
    oRequestConfig.url = `SupplierParticipations?$top=5000&$select=${select}&$filter=${filter}`;
    oRequestConfig.headers["Content-Type"] = "application/json";
  
    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    //Manual aggregation as groupBy not supported by cds-dbm 
    let oResult = [];
    oResult.push({Count:response.data.value.filter(a=>a.AcceptedFlag).length,
        AcceptedFlag:true});
    oResult.push({Count:response.data.value.filter(a=>!a.AcceptedFlag).length,
        AcceptedFlag:false});
    
    return oResult;
}


async function doSearchContractWorkspaces (req) {
    let sLoggedUser = req.user && req.user.attr && req.user.attr.login_name && req.user.attr.login_name[0];
    let oData = req.data;
    let sUser = (envtype=='TEST') ? oData.sParamUser : sLoggedUser;

    if(!oData.sRealm || !sUser) {
        req.reject(400,'Missing parameters');
    }

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    oData.sSelect =  oData.sSelect || "$select=ProjectId,Description,ContractStatus,ExpirationDate_day,Owner_UserId";
    oData.sTop = oData.sTop || "$top=10";

    // sFilter does not include the filter for Realm and User - this would need to be added
    let sFilterOnUser = "";
    if (oData.bFilterOnUser) {
        sFilterOnUser = " and Owner_UserId eq '" + sUser + "'";
    }
    let sFilterOnRealm = "Realm eq '" + oData.sRealm + "'";
    let sFilter = oData.sFilter ? oData.sFilter + sFilterOnUser + " and " + sFilterOnRealm : "$filter=" + sFilterOnRealm + sFilterOnUser;
    oData.sExpand = oData.sExpand || "$expand=AffectedParties";
    oData.sOrderBy = oData.sOrderBy || "$orderby=ExpirationDate_day desc";

    oRequestConfig.url = "ContractWorkspaces?" + oData.sSelect + "&" + sFilter + "&" + oData.sExpand + "&" + oData.sOrderBy + "&" + oData.sTop;
    oRequestConfig.method = "get";
    oRequestConfig.headers["Content-Type"] = "application/json";

    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    let aContractWorkspaces = response.data && response.data.value || [];
    aContractWorkspaces.forEach(function (oResponse) {
        var sSupplierIds = "";
        oResponse.AffectedParties && oResponse.AffectedParties.forEach(function (oAffectedParty) {
            if (sSupplierIds.length === 0) {
                sSupplierIds += oAffectedParty.AffectedParties_SupplierId;
            } else {
                sSupplierIds += ';' + oAffectedParty.AffectedParties_SupplierId;
            }
        });
        oResponse.Suppliers = sSupplierIds;
    });

    return aContractWorkspaces;
}


async function doSearchSuppliers (req) {
    let oData = req.data;

    if(!oData.sRealm) {
        req.reject(400,'Missing parameters');
    }

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    oData.sSelect =  oData.sSelect || "$select=SupplierName,ERPVendorId,RegistrationStatus,QualificationStatus,IntegratedToERP,AddressPostalCode,AddressRegionCode,AddressCountryCode,AddressCity,AddressLine1,PrimaryContactEMail,PrimaryContactLastName,PrimaryContactMiddleName,PrimaryContactFirstName";
    oData.sTop = oData.sTop || "$top=10";
    oData.sExpand = oData.sExpand || "$expand=Qualifications";

    let sFilterOnRealm = "Realm eq '" + oData.sRealm + "'";
    let sFilter = oData.sFilter ? oData.sFilter + " and " + sFilterOnRealm : "$filter=" + sFilterOnRealm;


    oRequestConfig.url = "SLPSuppliers?" + oData.sSelect + "&" + sFilter + "&" + oData.sExpand + "&" + oData.sTop;
    oRequestConfig.method = "get";
    oRequestConfig.headers["Content-Type"] = "application/json";

    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message + " ; API Response: " + oError.response.data.error.message);
        throw Error("There was an error when calling the API");
    });

    // find max preferred status
    let aSuppliers = response.data && response.data.value || [];
    aSuppliers.forEach(function (oResponse) {
        oResponse.PreferredStatus = Math.max(...oResponse.Qualifications.map(o => o.PreferredStatus));
    });

    return aSuppliers;
}

async function doSearchDiverseSuppliers (req) {
    let oData = req.data;

    if(!oData.sRealm) {
        req.reject(400,'Missing parameters');
    }

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    oData.sSelect =  oData.sSelect || "$select=SupplierName,Country,State,City,SupplierId,MinorityOwned,WomanOwned,VeteranOwned,DiversityDVO,DiversityGreen,DiversityGLBTOwned,DiversitySDB,VietnamVO";
    oData.sTop = oData.sTop || "$top=100";

    let sFilterOnRealm = "Realm eq '" + oData.sRealm + "'";
    let sFilter = oData.sFilter ? oData.sFilter + " and " + sFilterOnRealm : "$filter=" + sFilterOnRealm;


    oRequestConfig.url = "Suppliers?" + oData.sSelect + "&" + sFilter + "&" + oData.sTop;
    oRequestConfig.method = "get";
    oRequestConfig.headers["Content-Type"] = "application/json";

    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message + " ; API Response: " + oError.response.data.error.message);
        throw Error("There was an error when calling the API");
    });

    // find max preferred status
    let aSuppliers = response.data && response.data.value || [];

    for (var i = 0; i < aSuppliers.length; i++) {
       let diversityType="";
       diversityType += aSuppliers[i].DiversityDVO? (diversityType?"\nDisabled Veteran Owned":"Disabled Veteran Owned"):"";
       diversityType += aSuppliers[i].DiversityGreen? (diversityType?"\nGreen Initiatives":"Green Initiatives"):"";
       diversityType += aSuppliers[i].DiversityGLBTOwned? (diversityType?"\nLGBT Owned":"LGBT Owned"):"";
       diversityType += aSuppliers[i].MinorityOwned? (diversityType?"\nMinority Owned":"Minority Owned"):"";
       diversityType += aSuppliers[i].DiversitySDB? (diversityType?"\nSmall Disadvantages":"Small Disadvantages"):"";
       diversityType += aSuppliers[i].VeteranOwned? (diversityType?"\nVeteran Owned":"Veteran Owned"):"";
       diversityType += aSuppliers[i].VietnamVO? (diversityType?"\nVietnam Veteran Owned":"Vietnam Veteran Owned"):"";
       diversityType += aSuppliers[i].WomanOwned? (diversityType?"\nWoman Owned":"Woman Owned"):"";

       aSuppliers[i].DivCategory = diversityType;
    }

    return aSuppliers;
}

async function doSearchInvoices (req) {
    let sLoggedUser = req.user && req.user.attr && req.user.attr.login_name && req.user.attr.login_name[0];
    let oData = req.data;
    let sUser = (envtype=='TEST') ? oData.sParamUser : sLoggedUser;

    if(!oData.sRealm || !sUser) {
        req.reject(400,'Missing parameters');
    }

    let sDestination = "KIT_Datalake";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);

    //Query filter (working around axios param serializing issue)
    oData.sSelect =  oData.sSelect || "$select=InvoiceId,Description,InvoiceDate_day,POId,Supplier_SupplierId,Commodity_CommodityId,ReconciliationStatus";
    oData.sTop = oData.sTop || "$top=10";

    // sFilter does not include the filter for Realm and User - this would need to be added
    let sFilterOnUser = "";
    if (oData.bFilterOnUser) {
        sFilterOnUser = " and Requester_UserId eq '" + sUser + "'";
    }
    let sFilterOnRealm = "Realm eq '" + oData.sRealm + "'";
    let sFilter = oData.sFilter ? oData.sFilter + sFilterOnUser + " and " + sFilterOnRealm : "$filter=" + sFilterOnRealm + sFilterOnUser;
    oData.sOrderBy = oData.sOrderBy || "$orderby=InvoiceDate_day desc";

    oRequestConfig.url = "InvoiceLineItems?" + oData.sSelect + "&" + sFilter + "&" + oData.sExpand + "&" + oData.sOrderBy + "&" + oData.sTop;
    oRequestConfig.method = "get";
    oRequestConfig.headers["Content-Type"] = "application/json";

    let response = await axios.request(oRequestConfig)
    .catch(function (oError) {
        logger.error("There was an error when calling the API. Error was: " + oError.message);
        throw Error("There was an error when calling the API");
    });

    return response.data.value;
}

module.exports = {
    doGetMySpendPerQuarter,
    doGetContractVsNonContractSpend,
    doGetCatalogVsNonCatalogSpend,
    doGetMyConsumedContracts,
    doGetMyContractWorkspaces,
    doGetMyExpiringContracts,
    doGetMyRequisitions,
    doGetMySourcingProjects,
    doGetMyPendingInvoices,
    doGetSourcingProjectsPerRegion,
    doGetSupplierParticipation,
    doSearchContractWorkspaces,
    doSearchSuppliers,
    doGetMySourcingEvents,
    doGetInvoiceExceptions,
    doSearchDiverseSuppliers,
    doGetInvoicePaymentTime,
    doGetInvoiceByStatus,
    doSearchInvoices,
    getTopSourcedCommodities,
    getTopSuppliersByAwardedAmountInSourcingEvents,
    getSuppliersInRegistrationProcess,
    getRequisitionApprovalTimePerApprover,
    getOffContractSpendBySupplier
};