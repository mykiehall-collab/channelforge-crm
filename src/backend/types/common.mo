// Cross-cutting types shared across all CHANNELFORGE CRM domains
module {
  public type Timestamp = Int; // nanoseconds

  public type Result<T, E> = { #ok : T; #err : E };

  // Bulk import result returned after CSV/Excel uploads
  public type BulkImportResult = {
    created : Nat;
    skipped : Nat;
    errors : [Text];
  };

  // Report filter input used across multiple report endpoints
  public type ReportFilters = {
    startDate     : ?Timestamp;
    endDate       : ?Timestamp;
    resellerId    : ?Text;  // renamed from partnerId
    distributorId : ?Text;
    accountOwnerId: ?Text;
    status        : ?Text;
  };
};
