// Quarter and fiscal year configuration types for CHANNELFORGE CRM
import Debug "mo:core/Debug";
import CommonTypes "common";

module {
  public type Timestamp = CommonTypes.Timestamp;

  // Whether the vendor uses standard calendar quarters or custom fiscal dates
  public type FiscalYearType = {
    #CalendarYear;
    #CustomFiscal;
  };

  // A single quarter definition with YYYY-MM-DD date strings
  public type QuarterDef = {
    quarterId : Text; // e.g. "Q1-2026"
    name      : Text; // e.g. "Q1 FY2026"
    startDate : Text; // YYYY-MM-DD
    endDate   : Text; // YYYY-MM-DD
  };

  // Vendor-level fiscal year structure; editable by Vendor Primary Admin only
  // (or Secondary Admin with explicit permission)
  public type FiscalYearConfig = {
    vendorId       : Text;
    fiscalYearType : FiscalYearType;
    quarters       : [QuarterDef];
    updatedAt      : Timestamp;
    updatedBy      : Text;
  };

  // Snapshot of the current quarter's progress, computed at query time
  public type CurrentQuarterResult = {
    quarterDef      : QuarterDef;
    daysElapsed     : Nat;
    daysRemaining   : Nat;
    progressPercent : Float;
  };

  // Input type used when a Vendor Admin saves/updates the fiscal year config
  public type FiscalYearConfigInput = {
    fiscalYearType : FiscalYearType;
    quarters       : [QuarterDef];
  };
};
