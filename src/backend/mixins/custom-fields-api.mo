// Public API mixin for custom field management — definitions and value storage
import CustomFieldsLib "../lib/custom-fields";
import Types "../types/custom-fields";
import Time "mo:core/Time";

mixin (customFieldsState : CustomFieldsLib.State) {

    // ── Field Definition Management ──────────────────────────────────────────

    /// Create a new custom field definition (Vendor/Distributor/Reseller admins)
    public shared ({ caller }) func createCustomFieldDef(
      input : Types.CustomFieldDefInput
    ) : async Types.CustomFieldDef {
      CustomFieldsLib.createFieldDef(customFieldsState, input, caller.toText(), Time.now());
    };

    /// Update an existing custom field definition
    public shared ({ caller }) func updateCustomFieldDef(
      id    : Text,
      input : Types.CustomFieldDefInput,
    ) : async ?Types.CustomFieldDef {
      CustomFieldsLib.updateFieldDef(customFieldsState, id, input, Time.now());
    };

    /// Archive a custom field definition (soft delete — values are preserved)
    public shared ({ caller }) func archiveCustomFieldDef(
      id : Text
    ) : async Bool {
      CustomFieldsLib.archiveFieldDef(customFieldsState, id, Time.now());
    };

    /// List active custom field definitions for a given object type
    public query func listCustomFieldDefs(
      objectType : Types.CustomFieldObjectType
    ) : async [Types.CustomFieldDef] {
      CustomFieldsLib.listFieldDefsForObject(customFieldsState, objectType);
    };

    /// Get a single custom field definition by id
    public query func getCustomFieldDef(
      id : Text
    ) : async ?Types.CustomFieldDef {
      CustomFieldsLib.getFieldDef(customFieldsState, id);
    };

    // ── Field Value Management ────────────────────────────────────────────────

    /// Set (upsert) a custom field value on any supported object
    public shared ({ caller }) func setCustomFieldValue(
      input : Types.CustomFieldValueInput
    ) : async Types.CustomFieldValidationResult {
      CustomFieldsLib.setFieldValue(customFieldsState, input, caller.toText(), Time.now());
    };

    /// Bulk-set multiple custom field values in one call
    public shared ({ caller }) func bulkSetCustomFieldValues(
      inputs : [Types.CustomFieldValueInput]
    ) : async Types.CustomFieldBulkValidationResult {
      var allValid = true;
      let results = inputs.map(func (input) {
        let r = CustomFieldsLib.setFieldValue(customFieldsState, input, caller.toText(), Time.now());
        if (not r.isValid) { allValid := false };
        r;
      });
      { allValid; results };
    };

    /// Get all custom field values for a specific object instance
    public query func getCustomFieldValues(
      objectId   : Text,
      objectType : Types.CustomFieldObjectType,
    ) : async [Types.CustomFieldValue] {
      CustomFieldsLib.getFieldValues(customFieldsState, objectId, objectType);
    };

    /// Validate custom field values without persisting them (dry-run)
    public query func validateCustomFieldValues(
      inputs : [Types.CustomFieldValueInput]
    ) : async Types.CustomFieldBulkValidationResult {
      CustomFieldsLib.validateFieldValues(customFieldsState, inputs);
    };

    /// Map CSV headers to custom field definitions (used during import)
    public query func mapCsvHeadersToCustomFields(
      objectType : Types.CustomFieldObjectType,
      headers    : [Text],
    ) : async [(Text, ?Text)] {
      CustomFieldsLib.mapCsvColumns(customFieldsState, objectType, headers);
    };

    /// Search field values by objectType + fieldDefId + query text, returns matching objectIds
    public query func searchCustomFieldValues(
      objectType : Types.CustomFieldObjectType,
      fieldDefId : Text,
      searchTerm : Text,
    ) : async [Text] {
      CustomFieldsLib.searchFieldValues(customFieldsState, objectType, fieldDefId, searchTerm);
    };
};
