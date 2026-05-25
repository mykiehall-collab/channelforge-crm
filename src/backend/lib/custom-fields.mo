// Custom field domain logic — creation, validation, value storage
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Types "../types/custom-fields";

module {

  public type State = {
    fieldDefs   : Map.Map<Text, Types.CustomFieldDef>;
    fieldValues : Map.Map<Text, List.List<Types.CustomFieldValue>>;
    // key for fieldValues: "<objectType>#<objectId>"
  };

  public func initState() : State = {
    fieldDefs   = Map.empty<Text, Types.CustomFieldDef>();
    fieldValues = Map.empty<Text, List.List<Types.CustomFieldValue>>();
  };

  // Create a new custom field definition
  public func createFieldDef(
    state     : State,
    input     : Types.CustomFieldDefInput,
    createdBy : Text,
    now       : Int,
  ) : Types.CustomFieldDef {
    let id = "cf-" # createdBy # "-" # now.toText();
    let def : Types.CustomFieldDef = {
      id;
      objectType       = input.objectType;
      fieldName        = input.fieldName;
      fieldLabel       = input.fieldLabel;
      fieldDescription = input.fieldDescription;
      fieldType        = input.fieldType;
      isRequired       = input.isRequired;
      isSearchable     = input.isSearchable;
      isReportable     = input.isReportable;
      isApiVisible     = input.isApiVisible;
      isExportVisible  = input.isExportVisible;
      defaultValue     = input.defaultValue;
      allowedValues    = input.allowedValues;
      validationRules  = input.validationRules;
      visibilityScope  = input.visibilityScope;
      editPermissions  = input.editPermissions;
      viewPermissions  = input.viewPermissions;
      isArchived       = false;
      createdBy;
      createdAt        = now;
      updatedAt        = now;
      lockedByVendor   = false;
    };
    state.fieldDefs.add(id, def);
    def;
  };

  // Update an existing custom field definition
  public func updateFieldDef(
    state  : State,
    id     : Text,
    input  : Types.CustomFieldDefInput,
    now    : Int,
  ) : ?Types.CustomFieldDef {
    switch (state.fieldDefs.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.CustomFieldDef = {
          existing with
          fieldLabel       = input.fieldLabel;
          fieldDescription = input.fieldDescription;
          isRequired       = input.isRequired;
          isSearchable     = input.isSearchable;
          isReportable     = input.isReportable;
          isApiVisible     = input.isApiVisible;
          isExportVisible  = input.isExportVisible;
          defaultValue     = input.defaultValue;
          allowedValues    = input.allowedValues;
          validationRules  = input.validationRules;
          visibilityScope  = input.visibilityScope;
          editPermissions  = input.editPermissions;
          viewPermissions  = input.viewPermissions;
          updatedAt        = now;
        };
        state.fieldDefs.add(id, updated);
        ?updated;
      };
    };
  };

  // Archive a custom field definition (soft delete)
  public func archiveFieldDef(
    state : State,
    id    : Text,
    now   : Int,
  ) : Bool {
    switch (state.fieldDefs.get(id)) {
      case null false;
      case (?existing) {
        state.fieldDefs.add(id, { existing with isArchived = true; updatedAt = now });
        true;
      };
    };
  };

  // Get all active field definitions for an object type
  public func listFieldDefsForObject(
    state      : State,
    objectType : Types.CustomFieldObjectType,
  ) : [Types.CustomFieldDef] {
    state.fieldDefs.values()
      .filter(func (d : Types.CustomFieldDef) : Bool {
        not d.isArchived and d.objectType == objectType
      })
      .toArray();
  };

  // Get a single field definition by id
  public func getFieldDef(
    state : State,
    id    : Text,
  ) : ?Types.CustomFieldDef {
    state.fieldDefs.get(id);
  };

  // Set (upsert) a custom field value on an object
  public func setFieldValue(
    state     : State,
    input     : Types.CustomFieldValueInput,
    updatedBy : Text,
    now       : Int,
  ) : Types.CustomFieldValidationResult {
    let validation = validateSingleValue(state, input);
    if (not validation.isValid) { return validation };
    let key = objectKey(input.objectType, input.objectId);
    let existing = switch (state.fieldValues.get(key)) {
      case (?list) list;
      case null {
        let fresh = List.empty<Types.CustomFieldValue>();
        state.fieldValues.add(key, fresh);
        fresh;
      };
    };
    let replaced = existing.findIndex(func (v : Types.CustomFieldValue) : Bool {
      v.fieldDefId == input.fieldDefId
    });
    let newVal : Types.CustomFieldValue = {
      fieldDefId       = input.fieldDefId;
      objectId         = input.objectId;
      objectType       = input.objectType;
      value            = input.value;
      uploadedFileKeys = input.uploadedFileKeys;
      createdAt        = now;
      updatedAt        = now;
      updatedBy;
    };
    switch (replaced) {
      case null { existing.add(newVal) };
      case (?idx) { existing.put(idx, newVal) };
    };
    { isValid = true; fieldDefId = input.fieldDefId; errorMessage = null };
  };

  // Get all custom field values for a specific object instance
  public func getFieldValues(
    state      : State,
    objectId   : Text,
    objectType : Types.CustomFieldObjectType,
  ) : [Types.CustomFieldValue] {
    let key = objectKey(objectType, objectId);
    switch (state.fieldValues.get(key)) {
      case null [];
      case (?list) list.toArray();
    };
  };

  // Validate a set of custom field values against their definitions (dry-run)
  public func validateFieldValues(
    state  : State,
    inputs : [Types.CustomFieldValueInput],
  ) : Types.CustomFieldBulkValidationResult {
    let results = inputs.map(
      func (input) { validateSingleValue(state, input) }
    );
    let allValid = results.all(func (r : Types.CustomFieldValidationResult) : Bool { r.isValid });
    { allValid; results };
  };

  // Map CSV column headers to custom field definitions for a given object type
  public func mapCsvColumns(
    state      : State,
    objectType : Types.CustomFieldObjectType,
    headers    : [Text],
  ) : [(Text, ?Text)] {
    let defs = listFieldDefsForObject(state, objectType);
    headers.map<Text, (Text, ?Text)>(func (header) {
      let normalized = header.toLower();
      let matched = defs.find(func (d : Types.CustomFieldDef) : Bool {
        d.fieldName.toLower() == normalized or d.fieldLabel.toLower() == normalized
      });
      (header, switch (matched) { case (?d) ?d.id; case null null });
    });
  };

  // Search field values: given objectType + fieldDefId + searchTerm, return matching objectIds
  public func searchFieldValues(
    state      : State,
    objectType : Types.CustomFieldObjectType,
    fieldDefId : Text,
    searchTerm : Text,
  ) : [Text] {
    let queryLower = searchTerm.toLower();
    let result = List.empty<Text>();
    state.fieldValues.forEach(func (_key : Text, values : List.List<Types.CustomFieldValue>) {
      values.forEach(func (v : Types.CustomFieldValue) {
        if (v.fieldDefId == fieldDefId and v.objectType == objectType
            and v.value.toLower().contains(#text queryLower)) {
          result.add(v.objectId);
        };
      });
    });
    result.toArray();
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  func objectKey(objectType : Types.CustomFieldObjectType, objectId : Text) : Text {
    debug_show(objectType) # "#" # objectId;
  };

  func validateSingleValue(
    state : State,
    input : Types.CustomFieldValueInput,
  ) : Types.CustomFieldValidationResult {
    let noResult = { isValid = true; fieldDefId = input.fieldDefId; errorMessage = null };
    switch (state.fieldDefs.get(input.fieldDefId)) {
      case null { { isValid = false; fieldDefId = input.fieldDefId; errorMessage = ?"Field definition not found" } };
      case (?def) {
        if (def.isArchived) {
          return { isValid = false; fieldDefId = input.fieldDefId; errorMessage = ?"Field is archived" };
        };
        let v = input.value;
        if (def.isRequired and v.isEmpty()) {
          return { isValid = false; fieldDefId = input.fieldDefId; errorMessage = ?("Field '" # def.fieldLabel # "' is required") };
        };
        if (v.isEmpty()) { return noResult };
        // Per-type validators
        let typeError : ?Text = switch (def.fieldType) {
          case (#email) {
            if (not (v.contains(#char '@') and v.size() >= 3)) {
              ?"Invalid email address"
            } else null;
          };
          case (#url) {
            if (not (v.startsWith(#text "http://") or v.startsWith(#text "https://"))) {
              ?"URL must start with http:// or https://"
            } else null;
          };
          case (#phoneNumber) {
            let stripped = if (v.startsWith(#text "+")) {
              switch (v.stripStart(#text "+")) { case (?s) s; case null v };
            } else v;
            if (stripped.size() < 7) { ?"Phone number too short" } else null;
          };
          case (#percentage) {
            switch (v.toInt()) {
              case null { ?"Percentage must be a number" };
              case (?n) {
                if (n < 0 or n > 100) { ?"Percentage must be between 0 and 100" } else null;
              };
            };
          };
          case (#number) {
            switch (v.toInt()) {
              case null { ?"Value must be a number" };
              case _ null;
            };
          };
          case (#currency) {
            switch (v.toInt()) {
              case null { ?"Currency value must be a number" };
              case _ null;
            };
          };
          case (#dropdown) {
            if (def.allowedValues.size() > 0
                and def.allowedValues.find(func (a : Text) : Bool { a == v }) == null) {
              ?("Value must be one of: " # def.allowedValues.values().toArray().foldLeft("", func (acc : Text, v : Text) : Text { if (acc.isEmpty()) v else acc # ", " # v }));
            } else null;
          };
          case (#multiSelect) {
            if (def.allowedValues.size() > 0) {
              let selected = v.split(#char ',').toArray();
              let invalid = selected.filter(func (s : Text) : Bool {
                let trimmed = s.trim(#char ' ');
                def.allowedValues.find(func (a : Text) : Bool { a == trimmed }) == null
              });
              if (invalid.size() > 0) {
                ?("Invalid selections: " # invalid.foldLeft("", func (acc : Text, v : Text) : Text { if (acc.isEmpty()) v else acc # ", " # v }))
              } else null;
            } else null;
          };
          case _ null;
        };
        switch (typeError) {
          case (?msg) { { isValid = false; fieldDefId = input.fieldDefId; errorMessage = ?msg } };
          case null {
            var ruleError : ?Text = null;
            for (rule in def.validationRules.values()) {
              if (ruleError == null) {
                ruleError := applyValidationRule(rule, v);
              };
            };
            switch (ruleError) {
              case (?msg) { { isValid = false; fieldDefId = input.fieldDefId; errorMessage = ?msg } };
              case null noResult;
            };
          };
        };
      };
    };
  };

  func applyValidationRule(
    rule  : Types.CustomFieldValidationRule,
    value : Text,
  ) : ?Text {
    switch (rule.ruleType) {
      case (#minLength) {
        switch (Nat.fromText(rule.ruleValue)) {
          case (?min) {
            if (value.size() < min) { ?("Minimum length is " # rule.ruleValue) } else null;
          };
          case null null;
        };
      };
      case (#maxLength) {
        switch (Nat.fromText(rule.ruleValue)) {
          case (?max) {
            if (value.size() > max) { ?("Maximum length is " # rule.ruleValue) } else null;
          };
          case null null;
        };
      };
      case (#minValue) {
        switch (value.toInt()) {
          case (?n) {
            switch (rule.ruleValue.toInt()) {
              case (?min) { if (n < min) { ?("Minimum value is " # rule.ruleValue) } else null };
              case null null;
            };
          };
          case null null;
        };
      };
      case (#maxValue) {
        switch (value.toInt()) {
          case (?n) {
            switch (rule.ruleValue.toInt()) {
              case (?max) { if (n > max) { ?("Maximum value is " # rule.ruleValue) } else null };
              case null null;
            };
          };
          case null null;
        };
      };
      case _ null;
    };
  };
};
