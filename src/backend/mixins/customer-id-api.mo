// Public API mixin for Customer ID format governance
import CustomerIdLib "../lib/customer-id";
import Types "../types/customer-id";
import Time "mo:core/Time";

mixin (customerIdState : CustomerIdLib.State) {

    // ── Format Rule Management (Vendor Admin) ─────────────────────────────────

    /// Create or update the Customer ID format rule for the caller's Vendor org
    public shared ({ caller }) func upsertCustomerIdFormatRule(
      vendorId : Text,
      input    : Types.CustomerIdFormatRuleInput,
    ) : async Types.CustomerIdFormatRule {
      CustomerIdLib.upsertFormatRule(customerIdState, vendorId, input, Time.now());
    };

    /// Retrieve the format rule for a given Vendor (cascades: Distributor/Reseller always get Vendor rule)
    public query func getCustomerIdFormatRule(
      vendorId : Text
    ) : async ?Types.CustomerIdFormatRule {
      CustomerIdLib.getFormatRule(customerIdState, vendorId);
    };

    // ── ID Generation & Validation ────────────────────────────────────────────

    /// Generate the next Customer ID under a Vendor's format rule
    public shared ({ caller }) func generateCustomerId(
      request : Types.CustomerIdGenerateRequest
    ) : async Types.CustomerIdValidationResult {
      CustomerIdLib.generateNextId(customerIdState, request, Time.now());
    };

    /// Validate a manually entered or imported Customer ID
    public query func validateCustomerId(
      vendorId   : Text,
      customerId : Text,
    ) : async Types.CustomerIdValidationResult {
      CustomerIdLib.validateId(customerIdState, vendorId, customerId);
    };

    /// Check if a Customer ID is already in use within a Vendor's namespace
    public query func isCustomerIdDuplicate(
      vendorId   : Text,
      customerId : Text,
    ) : async Bool {
      CustomerIdLib.isDuplicate(customerIdState, vendorId, customerId);
    };

    // ── Audit ─────────────────────────────────────────────────────────────────

    /// Retrieve the Customer ID audit log for a Vendor
    public query func getCustomerIdAuditLog(
      vendorId : Text
    ) : async [Types.CustomerIdAuditEntry] {
      CustomerIdLib.getAuditLog(customerIdState, vendorId);
    };

    /// Register a Customer ID as in-use after account creation
    public shared ({ caller }) func registerCustomerId(
      vendorId   : Text,
      customerId : Text,
      accountId  : Text,
    ) : async Bool {
      CustomerIdLib.registerUsedId(customerIdState, vendorId, customerId, accountId, caller.toText(), Time.now());
    };
};
