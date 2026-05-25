// Target definition, assignment, and QTD metrics types for CHANNELFORGE CRM
import Debug "mo:core/Debug";
import CommonTypes "common";

module {
  public type Timestamp = CommonTypes.Timestamp;

  // Five configurable segment measure slots — Vendor Primary Admin can rename each
  public type TargetMeasureId = {
    #Measure1;
    #Measure2;
    #Measure3;
    #Measure4;
    #Measure5;
  };

  // How a target value is expressed / scored
  public type TargetCalculationType = {
    #Revenue;    // monetary figure
    #Count;      // numeric count (e.g. deal registrations)
    #Percentage; // attainment %
    #Weighted;   // composite score
  };

  // One configurable measure slot — the Vendor Admin can override defaultName with customName
  public type TargetMeasure = {
    measureId       : TargetMeasureId;
    defaultName     : Text;            // shipped default, e.g. "Renewal Revenue"
    customName      : ?Text;           // admin override
    calculationType : TargetCalculationType;
  };

  // Vendor-level measure name/logic configuration
  public type TargetMeasureConfig = {
    vendorId  : Text;
    measures  : [TargetMeasure];
    updatedAt : Timestamp;
    updatedBy : Text;
  };

  // Whether the target covers a single quarter or a full year
  public type TargetPeriodType = {
    #Quarterly;
    #Annual;
  };

  // Granularity of the target assignment
  public type TargetScope = {
    #AllResellers;
    #ByReseller      : Text; // resellerId
    #ByDistributor   : Text; // distributorId
    #ByTier          : Text; // tier name, e.g. "Gold"
    #ByCountry       : Text; // ISO country code
    #ByProductFamily : Text;
    #ByUser          : Text; // userId
  };

  // A single target assignment — created by Vendor Admin, optionally via upload or API
  public type TargetAssignment = {
    assignmentId    : Text;
    vendorId        : Text;
    measureId       : TargetMeasureId;
    targetValue     : Float;
    periodType      : TargetPeriodType;
    periodKey       : Text;   // e.g. "Q1-2026" or "FY2026"
    assignmentScope : TargetScope;
    assignedAt      : Timestamp;
    assignedBy      : Text;   // userId of creator / "api" / "spreadsheet"
  };

  // Input used when creating or updating a target assignment
  public type TargetAssignmentInput = {
    measureId       : TargetMeasureId;
    targetValue     : Float;
    periodType      : TargetPeriodType;
    periodKey       : Text;
    assignmentScope : TargetScope;
  };

  // Actuals snapshot for QTD progress tracking
  public type QTDMetrics = {
    resellerId                 : ?Text;   // null = vendor-wide aggregate
    quarterKey                 : Text;
    renewalRevenue             : Float;
    newBusinessRevenue         : Float;
    pipelineCreated            : Float;
    pipelineClosed             : Float;
    dealRegistrationsSubmitted : Nat;
    dealRegistrationsApproved  : Nat;
    currency                   : Text;    // ISO-4217 code or "BTC"
    calculatedAt               : Timestamp;
  };

  // Per-reseller ranking entry used in the QTD dashboard leaderboard
  public type ResellerQTDRanking = {
    resellerId        : Text;
    resellerName      : Text;
    renewalRevenue    : Float;
    attainmentPercent : Float;
    rank              : Nat;
  };

  // Filters for QTD dashboard queries — mirrors the spec's dashboard filter list
  public type QTDFilters = {
    quarterKey      : ?Text;
    country         : ?Text;
    resellerId      : ?Text;
    tierName        : ?Text;
    productFamily   : ?Text;
    currency        : ?Text;
    targetSegment   : ?TargetMeasureId;
  };

  // Source tracking for target entries (audit + blend logic)
  public type TargetUpdateSource = {
    #Manual;
    #ApiImport   : Text; // API caller identity / system name
    #Spreadsheet : Text; // original filename
  };
};
