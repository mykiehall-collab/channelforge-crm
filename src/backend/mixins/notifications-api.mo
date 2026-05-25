// In-app notifications public API for CHANNELFORGE CRM
import Principal "mo:core/Principal";
import NotificationsLib "../lib/notifications";
import CommonTypes "../types/common";
import Types "../types/notifications";

mixin (notificationsState : NotificationsLib.State) {
  public query ({ caller }) func getMyNotifications() : async [Types.InAppNotification] {
    NotificationsLib.getNotificationsForUser(notificationsState, caller);
  };

  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    NotificationsLib.getUnreadCount(notificationsState, caller);
  };

  public shared ({ caller }) func markNotificationRead(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    NotificationsLib.markNotificationRead(notificationsState, id, caller);
  };

  public shared ({ caller }) func deleteNotification(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    NotificationsLib.deleteNotification(notificationsState, id, caller);
  };
};
