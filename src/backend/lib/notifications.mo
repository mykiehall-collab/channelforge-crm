// In-app notification domain logic for CHANNELFORGE CRM
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/notifications";

module {
  public type State = {
    notifications : Map.Map<Text, Types.InAppNotification>;
    idCounter : { var value : Nat };
  };

  public func initState() : State {
    {
      notifications = Map.empty<Text, Types.InAppNotification>();
      idCounter = { var value = 0 };
    };
  };

  public func createNotification(
    state : State,
    recipientId : Principal,
    notificationType : Types.NotificationType,
    title : Text,
    message : Text,
    entityId : ?Text,
    entityType : ?Text,
  ) : Types.InAppNotification {
    state.idCounter.value += 1;
    let id = "notif-" # state.idCounter.value.toText();
    let notif : Types.InAppNotification = {
      id;
      recipientId;
      notificationType;
      title;
      message;
      entityId;
      entityType;
      isRead = false;
      createdAt = Time.now();
    };
    state.notifications.add(id, notif);
    notif;
  };

  public func getNotificationsForUser(
    state : State,
    userId : Principal,
  ) : [Types.InAppNotification] {
    state.notifications.values().filter(func(n : Types.InAppNotification) : Bool {
      Principal.equal(n.recipientId, userId)
    }).toArray();
  };

  public func markNotificationRead(
    state : State,
    id : Text,
    caller : Principal,
  ) : CommonTypes.Result<(), Text> {
    switch (state.notifications.get(id)) {
      case null { #err("Notification not found") };
      case (?notif) {
        if (not Principal.equal(notif.recipientId, caller)) {
          return #err("Not authorized to update this notification");
        };
        state.notifications.add(id, { notif with isRead = true });
        #ok(());
      };
    };
  };

  public func getUnreadCount(state : State, userId : Principal) : Nat {
    state.notifications.values().filter(func(n : Types.InAppNotification) : Bool {
      Principal.equal(n.recipientId, userId) and not n.isRead
    }).size();
  };

  public func deleteNotification(
    state : State,
    id : Text,
    caller : Principal,
  ) : CommonTypes.Result<(), Text> {
    switch (state.notifications.get(id)) {
      case null { #err("Notification not found") };
      case (?notif) {
        if (not Principal.equal(notif.recipientId, caller)) {
          return #err("Not authorized to delete this notification");
        };
        state.notifications.remove(id);
        #ok(());
      };
    };
  };
};
