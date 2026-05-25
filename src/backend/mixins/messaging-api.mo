import Principal "mo:core/Principal";
import MessagingLib "../lib/messaging";
import CompanyLib "../lib/company";
import CommonTypes "../types/common";
import Types "../types/messaging";

mixin (
  messagingState : MessagingLib.State,
  companyState   : CompanyLib.State,
) {
  // Create a direct message conversation, optionally with an opening message
  public shared ({ caller }) func createDirectMessage(
    recipientId    : Text,
    content        : Text,
    attachmentUrls : [Text],
  ) : async CommonTypes.Result<Types.ConversationThread, Text> {
    let input : Types.ConversationInput = {
      conversationType = #DirectMessage;
      participantIds   = [recipientId];
      relatedEntityId  = null;
    };
    switch (MessagingLib.createConversation(messagingState, companyState.userProfiles, caller, input)) {
      case (#err(e)) { #err(e) };
      case (#ok(conv)) {
        if (content.size() > 0) {
          ignore MessagingLib.sendMessage(
            messagingState, companyState.userProfiles, caller,
            conv.id, content, attachmentUrls,
          );
        };
        switch (MessagingLib.getConversationThread(messagingState, conv.id)) {
          case null  { #err("Failed to retrieve conversation thread") };
          case (?t)  { #ok(t) };
        };
      };
    };
  };

  // Create a group or entity-anchored conversation (account, deal, renewal)
  public shared ({ caller }) func createGroupConversation(
    participantIds : [Text],
    entityType     : Text,
    entityId       : ?Text,
  ) : async CommonTypes.Result<Types.Conversation, Text> {
    let convType : Types.ConversationType = switch (entityType) {
      case ("account") { #AccountThread };
      case ("deal")    { #DealThread    };
      case ("renewal") { #RenewalThread };
      case (_)         { #GroupMessage  };
    };
    let input : Types.ConversationInput = {
      conversationType = convType;
      participantIds;
      relatedEntityId  = entityId;
    };
    MessagingLib.createConversation(messagingState, companyState.userProfiles, caller, input);
  };

  // Send a message into an existing conversation
  public shared ({ caller }) func sendMessageToConversation(
    conversationId : Text,
    content        : Text,
    attachmentUrls : [Text],
  ) : async CommonTypes.Result<Types.Message, Text> {
    MessagingLib.sendMessage(
      messagingState, companyState.userProfiles, caller,
      conversationId, content, attachmentUrls,
    );
  };

  // Mark messages in a conversation as read up to a given message ID
  public shared ({ caller }) func markMessagesRead(
    conversationId : Text,
    upToMessageId  : Text,
  ) : async CommonTypes.Result<(), Text> {
    MessagingLib.markAsRead(messagingState, caller, conversationId, upToMessageId);
  };

  // Get the full thread (conversation + messages) — only participants can read
  public query ({ caller }) func getConversationThread(
    conversationId : Text
  ) : async ?Types.ConversationThread {
    let callerId = caller.toText();
    switch (MessagingLib.getConversation(messagingState, conversationId)) {
      case null { null };
      case (?conv) {
        if (conv.participantIds.filter(func(p) { p == callerId }).size() == 0) {
          return null;
        };
        MessagingLib.getConversationThread(messagingState, conversationId);
      };
    };
  };

  // List all conversations the caller participates in
  public query ({ caller }) func listMyConversations() : async [Types.Conversation] {
    MessagingLib.listUserConversations(messagingState, caller.toText());
  };

  // Paginated message list for a conversation
  public query ({ caller }) func getConversationMessages(
    conversationId : Text,
    limit          : Nat,
    offset         : Nat,
  ) : async [Types.Message] {
    let callerId = caller.toText();
    switch (MessagingLib.getConversation(messagingState, conversationId)) {
      case null { [] };
      case (?conv) {
        if (conv.participantIds.filter(func(p) { p == callerId }).size() == 0) {
          return [];
        };
        MessagingLib.getConversationMessages(messagingState, conversationId, limit, offset);
      };
    };
  };

  // Full-text search across all conversations the caller participates in
  public query ({ caller }) func searchMyMessages(
    searchQuery : Text
  ) : async [Types.Message] {
    MessagingLib.searchMessages(messagingState, caller.toText(), searchQuery);
  };
};
