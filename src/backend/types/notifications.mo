// In-app notification types for CHANNELFORGE CRM
import CommonTypes "common";

module {
  public type NotificationType = {
    #WorkspaceActivated;
    #DealApproved;
    #DealRejected;
    #DuplicateDRFlagged;
    #DuplicateDRReviewed;
    #TierAssigned;
    #EngagementGapAlert;
    #UnlockRequested;
  };

  public type InAppNotification = {
    id : Text;
    recipientId : Principal;
    notificationType : NotificationType;
    title : Text;
    message : Text;
    entityId : ?Text;
    entityType : ?Text;
    isRead : Bool;
    createdAt : CommonTypes.Timestamp;
  };
};
