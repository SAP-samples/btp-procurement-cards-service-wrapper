const cds = require('@sap/cds');
const daeHandler = require('./handlers/data-extraction-app-handler');
const aribaCWHandler = require('./handlers/ariba-contract-workspace-handler');
const aribaPWHandler = require('./handlers/ariba-procurement-workspace-handler');

module.exports = cds.service.impl((srv) => {

    //DataLake Direct Wrappers
    srv.on('getMyConsumedContracts', daeHandler.doGetMyConsumedContracts);
    srv.on('getMyContractWorkspaces', daeHandler.doGetMyContractWorkspaces);
    srv.on('getMyExpiringContracts', daeHandler.doGetMyExpiringContracts);
    srv.on('getMyRequisitions', daeHandler.doGetMyRequisitions);
    srv.on('getMySourcingProjects', daeHandler.doGetMySourcingProjects);
    srv.on('getMyPendingInvoices', daeHandler.doGetMyPendingInvoices);


    //DataLake Operation wrappers
    srv.on('getTopSourcedCommodities', daeHandler.getTopSourcedCommodities);
    srv.on('getTopSuppliersByAwardedAmountInSourcingEvents', daeHandler.getTopSuppliersByAwardedAmountInSourcingEvents);
    srv.on('getSuppliersInRegistrationProcess', daeHandler.getSuppliersInRegistrationProcess);
    srv.on('getRequisitionApprovalTimePerApprover', daeHandler.getRequisitionApprovalTimePerApprover);
    srv.on('getOffContractSpendBySupplier', daeHandler.getOffContractSpendBySupplier);
    srv.on('getMySpendPerQuarter', daeHandler.doGetMySpendPerQuarter);
    srv.on('getContractVsNonContractSpend', daeHandler.doGetContractVsNonContractSpend);
    srv.on('getCatalogVsNonCatalogSpend', daeHandler.doGetCatalogVsNonCatalogSpend);
    srv.on('getSourcingProjectsPerRegion', daeHandler.doGetSourcingProjectsPerRegion);
    srv.on('getSupplierParticipation', daeHandler.doGetSupplierParticipation);
    srv.on('getInvoiceExceptions', daeHandler.doGetInvoiceExceptions);
    srv.on('getInvoicePaymentTime', daeHandler.doGetInvoicePaymentTime);
    srv.on('getInvoiceByStatus', daeHandler.doGetInvoiceByStatus);
    
    
    //SAP Ariba Action API wrapper
    srv.on('doSearchContractWorkspaces', daeHandler.doSearchContractWorkspaces);
    srv.on('doGetMySourcingEvents', daeHandler.doGetMySourcingEvents);
    srv.on('doGetMyRecentContractWorkspaces', aribaCWHandler.doGetMyRecentContractWorkspaces);
    srv.on('doCreateContractWorkspace', aribaCWHandler.doCreateContractWorkspace);
    srv.on('doCreateProcurementWorkspace', aribaPWHandler.doCreateProcurementWorkspace);
    srv.on('doSearchSuppliers', daeHandler.doSearchSuppliers);
    srv.on('doSearchDiverseSuppliers', daeHandler.doSearchDiverseSuppliers);
    srv.on('doSearchInvoices', daeHandler.doSearchInvoices);


})
