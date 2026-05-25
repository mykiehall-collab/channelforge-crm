import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/alerts";

module {
  public type State = {
    alerts : Map.Map<Text, Types.Alert>;
    news : Map.Map<Text, Types.NewsItem>;
    auditLog : List.List<Types.AuditEntry>;
    idCounter : { var value : Nat };
  };

  public func initState() : State {
    {
      alerts = Map.empty<Text, Types.Alert>();
      news = Map.empty<Text, Types.NewsItem>();
      auditLog = List.empty<Types.AuditEntry>();
      idCounter = { var value = 0 };
    };
  };

  // --- Alerts ---

  public func getMyAlerts(
    state : State,
    caller : Principal,
  ) : [Types.Alert] {
    let callerId = caller.toText();
    state.alerts.values().filter(func(a) {
      a.userId == callerId and not a.isRead
    }).toArray();
  };

  public func markAlertRead(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.alerts.get(id)) {
      case null { #err("Alert not found") };
      case (?alert) {
        if (alert.userId != caller.toText()) {
          return #err("Not authorized to update this alert");
        };
        state.alerts.add(id, { alert with isRead = true });
        #ok(());
      };
    };
  };

  public func dismissAlert(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.alerts.get(id)) {
      case null { #err("Alert not found") };
      case (?alert) {
        if (alert.userId != caller.toText()) {
          return #err("Not authorized to dismiss this alert");
        };
        state.alerts.remove(id);
        #ok(());
      };
    };
  };

  public func createAlert(
    state : State,
    caller : Principal,
    input : Types.AlertInput,
  ) : CommonTypes.Result<Types.Alert, Text> {
    state.idCounter.value += 1;
    let id = "alert-" # state.idCounter.value.toText();
    let alert : Types.Alert = {
      id;
      accountId = input.accountId;
      userId = input.userId;
      alertType = input.alertType;
      message = input.message;
      severity = input.severity;
      isRead = false;
      createdAt = Time.now();
    };
    state.alerts.add(id, alert);
    #ok(alert);
  };

  // --- News ---

  public func createNewsItem(
    state : State,
    caller : Principal,
    input : Types.NewsItemInput,
  ) : CommonTypes.Result<Types.NewsItem, Text> {
    state.idCounter.value += 1;
    let id = "news-" # state.idCounter.value.toText();
    let item : Types.NewsItem = {
      id;
      title = input.title;
      body = input.body;
      publishDate = input.publishDate;
      visibility = input.visibility;
      publishedBy = caller.toText();
      createdAt = Time.now();
    };
    state.news.add(id, item);
    #ok(item);
  };

  public func getNewsItem(
    state : State,
    id : Text,
  ) : ?Types.NewsItem {
    state.news.get(id);
  };

  public func updateNewsItem(
    state : State,
    caller : Principal,
    id : Text,
    input : Types.NewsItemInput,
  ) : CommonTypes.Result<Types.NewsItem, Text> {
    switch (state.news.get(id)) {
      case null { #err("News item not found") };
      case (?existing) {
        let updated : Types.NewsItem = {
          existing with
          title = input.title;
          body = input.body;
          publishDate = input.publishDate;
          visibility = input.visibility;
        };
        state.news.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteNewsItem(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.news.get(id)) {
      case null { #err("News item not found") };
      case (?_) {
        state.news.remove(id);
        #ok(());
      };
    };
  };

  public func getVisibleNews(
    state : State,
    caller : Principal,
    callerCompanyType : Text,
    callerCompanyId : Text,
  ) : [Types.NewsItem] {
    let isVendor = callerCompanyType == "vendor";
    state.news.values().filter(func(item) {
      switch (item.visibility) {
        case (#AllResellers) { true };
        case (#VendorOnly) { isVendor };
        case (#SpecificResellers(ids)) {
          let found = ids.find(func(pid : Text) : Bool { pid == callerCompanyId });
          isVendor or found != null
        };
        case (#SpecificRegions(_)) { true };
      };
    }).toArray();
  };

  public func getAllNews(state : State) : [Types.NewsItem] {
    state.news.values().toArray();
  };

  // --- Audit ---

  public func appendAuditEntry(
    state : State,
    userId : Text,
    action : Text,
    entityType : Text,
    entityId : Text,
    details : Text,
  ) : () {
    state.idCounter.value += 1;
    let id = "audit-" # state.idCounter.value.toText();
    let entry : Types.AuditEntry = {
      id;
      userId;
      action;
      entityType;
      entityId;
      details;
      timestamp = Time.now();
    };
    state.auditLog.add(entry);
  };

  public func getAuditLog(
    state : State,
    caller : Principal,
    limit : Nat,
  ) : [Types.AuditEntry] {
    state.auditLog.reverseValues().take(limit).toArray();
  };
};
