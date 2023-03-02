using { KIT_Datalake as extDEA } from './external/KIT_Datalake.csn';


@(path:'/cards')
@(requires: ['authenticated-user', 'system-user'])
service CardEnablementService {

    //DataLake Direct Wrappers
    function getMyConsumedContracts() returns array of lightContract; 
    type lightContract{
        ContractId: String(50);
        Description : String(1000);
        AmountPercentLeft: Decimal;
        Duration: Decimal;
        AmountLeft: Decimal;
        MaxCommitment: Decimal;
        OrigCurrencyCode: String(10);
        Status: String(20);
        ExpirationDate_day: DateTime;
    }


    function getMyContractWorkspaces() returns array of lightContractWorkspace;
    type lightContractWorkspace{
        ContractId: String(50);
        ProjectId: String(50);
        Title: String(255);
        Description : String(1000);
        ContractStatus: String(25);
        ExpirationDate_day: DateTime;
        Owner_UserId: String(50);
        Suppliers: String(5000);
        CreationDate_day: DateTime;
    } 
    function getMyExpiringContracts() returns array of lightContract; 
    
    function getMyRequisitions() returns array of lightRequisitionLineItems;
    type lightRequisitionLineItems{
        RequisitionId: String(75);
        TitleString: String(128);
        Description: String(1000);
        StatusString: String(50);
    }
    function getMySourcingProjects() returns array of lightSourcingProject;
    type lightSourcingProject{
        ProjectId: String(50);
        EventType_EventType: String(20);
        OnTimeOrLate: String(10);
        State: String(20);
        PlannedStartDate_day: DateTime;
        PlannedEndDate_day: DateTime;
    }

    function getMyPendingInvoices() returns array of lightInvoice;
    type lightInvoice{
        InvoiceId: String(75);
        Description: String(1000);
        InvoiceDateCreated_day: DateTime;
        ShipFromLocation_LocationId : String(50);
        OrigAmountInvoiced: Double;
        OrigCurrencyCode:String(10);
        InvoiceStatus: String(50);
        ReconciliationStatus: String(50);
    }



    //DataLake Operation wrappers
    function getTopSourcedCommodities() returns array of topSourcedCommodities;
    type topSourcedCommodities {
        CommodityName: String(255);
        CommodityCode: String(50);
        Count: Integer;
        Realm: String(50);
    }

    function getTopSuppliersByAwardedAmountInSourcingEvents() returns array of topSuppliersByAwardedAmountInSourcingEvents;
    type topSuppliersByAwardedAmountInSourcingEvents {
        Realm: String(50);
        SupplierId: String(50);
        SupplierName: String(255);
        Amount: Double;
    }

    function getSuppliersInRegistrationProcess() returns array of suppliersInRegistrationProcess;
    type suppliersInRegistrationProcess {
        Realm: String(50);
        RegistrationStatus: String(100);
        Amount: Integer;
    }

    function getRequisitionApprovalTimePerApprover() returns array of requisitionApprovalTimePerApprover;
    type requisitionApprovalTimePerApprover {
        Realm: String(50);
        ApprovalTimeInDays: Double;
        Approver: String(255);
        ApprovalType: String(255);
        ApprovalState: String(32);
    }

    function getOffContractSpendBySupplier() returns array of offContractSpendBySupplier;
    type offContractSpendBySupplier {
        Realm: String(50);
        SupplierId: String(50);
        Amount: Double;
    }


    function getMySpendPerQuarter() returns userSpendPerQuarter;

    type userSpendPerQuarter {
        DataCount:          Integer;
        OverallAmount:      Decimal;
        OverallCurrency:    String(4);
        AvgLineItemCount:   Decimal;
        User:               String(255);
        Trend:              String(10);
        State:              String(10);
        Year:               String(10);
        QuarterAmount:      array of quarterAmount;
    }

    type quarterAmount {
        Quarter:    String(6);
        Year:       String(4);
        Amount:     Decimal;
        Currency:   String(4);
        DataCount:  Integer;
    }

    function getContractVsNonContractSpend() returns contractVsNonContractSpend;

    type contractVsNonContractSpend {
        DataCount:                  Integer;
        OverallAmount:              Decimal;
        OverallCurrency:            String(4);
        PercentageContractSpend:    Decimal;
        Deviation:                  Decimal;
        State:                      String(5);
        Spends:                     array of spends;       
    }

    type spends {
        TotalAmount:        Decimal;
        Type:               String(12);
    }
   
    function getCatalogVsNonCatalogSpend() returns catalogVsNonCatSpend;

    type catalogVsNonCatSpend {
        DataCount:                  Integer;
        OverallAmount:              Decimal;
        OverallCurrency:            String(4);
        PercentageCatalogSpend:     Decimal;
        Deviation:                  Decimal;
        State:                      String(5);
        Spends:                     array of spends;       
    }

    function getSourcingProjectsPerRegion() returns array of {Count:Decimal;Region_RegionId:String};

    function getSupplierParticipation() returns array of {Count:Decimal;AcceptedFlag:Boolean};

    function getInvoiceExceptions() returns array of {Total:Integer;ExceptionTypeId:String};

    function getInvoicePaymentTime() returns array of {Month : String(50); PaymentTimeAverage : Decimal};

    function getInvoiceByStatus() returns array of {Total:Integer;Status:String};


    //SAP Ariba Action API wrapper

    action doSearchContractWorkspaces(
        sRealm          : String,
        sFilter         : String,
        sParamUser      : String,
        bFilterOnUser   : Boolean,
        sTop            : String,
        sExpand         : String,
        sOrderBy        : String,
        sSelect         : String
    ) returns array of lightContractWorkspace;

    action doCreateContractWorkspace(
        sTitle          : String,
        sAmount         : String,
        sSupplierId     : String,
        sSMVendorId     : String,
        sCommodity      : String,
        sUser           : String,
        sTemplateId     : String,
        sCurrency       : String,
        sRealm          : String
    ) returns String;

    action doCreateProcurementWorkspace(
        sTitle          : String,
        sDesc           : String,
        sDateVal1       : String,
        sDateVal2       : String,
        sSupplierId     : String,
        sUser           : String,
        sTemplateId     : String,
        sRealm          : String
    ) returns String;

    action doGetMyRecentContractWorkspaces(
        sRealm              : String,
        sFilter             : String,
        sUser               : String,
        sPasswordAdapter    : String,
        iTop                : Integer
    ) returns array of lightContractWorkspace;

    action doSearchSuppliers (
        sRealm          : String,
        sFilter         : String,
        sTop            : String,
        sExpand         : String,
        sOrderBy        : String,
        sSelect         : String
    ) returns array of lightSupplier;
    type lightSupplier {
        Realm                       : String(50);
        SupplierName                : String(50);
        ERPVendorId                 : String(50);
        RegistrationStatus          : String(100);
        QualificationStatus         : String(100);
        IntegratedToERP             : String(50);
        AddressPostalCode           : String(50);
        AddressRegionCode           : String(50);
        AddressCountryCode          : String(50);
        AddressCity                 : String(255);
        AddressLine1                : String(255);
        PrimaryContactEMail         : String(255);
        PrimaryContactLastName      : String(255);
        PrimaryContactMiddleName    : String(255);
        PrimaryContactFirstName     : String(255);

        // Qualification Data
        PreferredStatus             : String(100);

    }

    action doSearchDiverseSuppliers (
        sRealm          : String,
        sFilter         : String,
        sTop            : String,
        sExpand         : String,
        sOrderBy        : String,
        sSelect         : String
    ) returns array of lightDiverseSupplier;

    type lightDiverseSupplier {
        Realm                         : String(50);
        SupplierName                  : String(50);
        SupplierId                    : String(50);
        City                          : String(50);
        State                         : String(50);
        Country                       : String(50);
        MinorityOwned                 : Boolean;
        WomanOwned                    : Boolean;
        VeteranOwned                  : Boolean;
        DiversityDVO                  : Boolean;
        DiversityGreen                : Boolean;
        DiversityGLBTOwned            : Boolean;
        DiversitySDB                  : Boolean;
        VietnamVO                     : Boolean;
        DivCategory                   : String(2000);

    }


    action doGetMySourcingEvents (
        sRealm              : String,
        sParamUser          : String,
        bFilterOnUser       : Boolean,
        bIncludeCompleted   : Boolean,
        sTop                : String,
        sSkip               : String,
        sExpand             : String,
        sOrderBy            : String,
        sSelect             : String
    ) returns array of lightSourcingEvents;
    type lightSourcingEvents {
        Realm                   : String(50);
        EventId                 : String(50);
        ItemId                  : String(50);
        Owner_UserId            : String(50);
        InvitedSuppliers        : Double;
        AcceptedSuppliers       : Double;
        ParticipSuppliers       : Double;
        Departments             : String(1000);
        Commodities             : String(1000);
        EventStartDate_Day      : DateTime;
        EventEndDate_Day        : DateTime;
    }

   action doSearchInvoices (
        sRealm          : String,
        sFilter         : String,
        sParamUser      : String,
        bFilterOnUser   : Boolean,
        sTop            : String,
        sOrderBy        : String,
        sSelect         : String
    ) returns array of lightInvoiceSearch;

    type lightInvoiceSearch {
        InvoiceId: String(75);
        Description: String(1000);
        InvoiceDate_day: DateTime;
        POId: String(50);
        Supplier_SupplierId: String(50);
        Commodity_CommodityId: String(50);
        ReconciliationStatus: String(50);
        InvoiceLineNumber: String(50);
        ParentInvoiceLineNumber: Double;
        Realm                         : String(50);

    }


}
