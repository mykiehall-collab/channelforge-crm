import Principal "mo:core/Principal";
import AlertsLib "../lib/alerts";
import CommonTypes "../types/common";
import Types "../types/alerts";

mixin (alertsState : AlertsLib.State) {
  // Alerts
  public query ({ caller }) func getMyAlerts() : async [Types.Alert] {
    AlertsLib.getMyAlerts(alertsState, caller);
  };

  public shared ({ caller }) func markAlertRead(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AlertsLib.markAlertRead(alertsState, caller, id);
  };

  public shared ({ caller }) func dismissAlert(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AlertsLib.dismissAlert(alertsState, caller, id);
  };

  public shared ({ caller }) func createAlert(
    input : Types.AlertInput
  ) : async CommonTypes.Result<Types.Alert, Text> {
    AlertsLib.createAlert(alertsState, caller, input);
  };

  // News
  public shared ({ caller }) func createNewsItem(
    input : Types.NewsItemInput
  ) : async CommonTypes.Result<Types.NewsItem, Text> {
    AlertsLib.createNewsItem(alertsState, caller, input);
  };

  public query func getNewsItem(id : Text) : async ?Types.NewsItem {
    AlertsLib.getNewsItem(alertsState, id);
  };

  public shared ({ caller }) func updateNewsItem(
    id : Text,
    input : Types.NewsItemInput,
  ) : async CommonTypes.Result<Types.NewsItem, Text> {
    AlertsLib.updateNewsItem(alertsState, caller, id, input);
  };

  public shared ({ caller }) func deleteNewsItem(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AlertsLib.deleteNewsItem(alertsState, caller, id);
  };

  public query ({ caller }) func getVisibleNews(
    callerCompanyType : Text,
    callerCompanyId : Text,
  ) : async [Types.NewsItem] {
    AlertsLib.getVisibleNews(alertsState, caller, callerCompanyType, callerCompanyId);
  };

  public query ({ caller }) func getAllNews() : async [Types.NewsItem] {
    AlertsLib.getAllNews(alertsState);
  };

  // Audit
  public query ({ caller }) func getAuditLog(
    limit : Nat
  ) : async [Types.AuditEntry] {
    AlertsLib.getAuditLog(alertsState, caller, limit);
  };
};
