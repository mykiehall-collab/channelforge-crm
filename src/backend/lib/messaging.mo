import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import CommonTypes "../types/common";
import Types "../types/messaging";
import CompanyTypes "../types/company";

module {
  public type State = {
    conversations : Map.Map<Types.ConversationId, Types.Conversation>;
    messages      : Map.Map<Types.ConversationId, List.List<Types.Message>>;
    idCounter     : { var value : Nat };
  };

  public func initState() : State {
    {
      conversations = Map.empty<Types.ConversationId, Types.Conversation>();
      messages      = Map.empty<Types.ConversationId, List.List<Types.Message>>();
      idCounter     = { var value = 0 };
    };
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  func isActiveUser(
    userProfiles : Map.Map<Text, CompanyTypes.UserProfile>,
    userId       : Text,
  ) : Bool {
    switch (userProfiles.get(userId)) {
      case null  { false };
      case (?_)  { true  };
    };
  };

  func truncatePreview(content : Text) : Text {
    if (content.size() <= 80) { return content };
    let arr = content.toArray();
    var acc = "";
    var i = 0;
    while (i < 80) {
      acc := acc # Text.fromChar(arr[i]);
      i += 1;
    };
    acc # "\u{2026}";
  };

  // ── Operations ────────────────────────────────────────────────────────────

  public func createConversation(
    state        : State,
    userProfiles : Map.Map<Text, CompanyTypes.UserProfile>,
    caller       : Principal,
    input        : Types.ConversationInput,
  ) : CommonTypes.Result<Types.Conversation, Text> {
    let callerId = caller.toText();
    if (not isActiveUser(userProfiles, callerId)) {
      return #err("Caller is not an approved user");
    };
    for (pid in input.participantIds.values()) {
      if (not isActiveUser(userProfiles, pid)) {
        return #err("Participant " # pid # " is unapproved, inactive, or suspended");
      };
    };
    let allPids = if (input.participantIds.filter(func(p) { p == callerId }).size() > 0) {
      input.participantIds;
    } else {
      input.participantIds.concat([callerId]);
    };
    state.idCounter.value += 1;
    let id  = "conv-" # state.idCounter.value.toText();
    let now = Time.now();
    let conv : Types.Conversation = {
      id;
      conversationType   = input.conversationType;
      participantIds     = allPids;
      relatedEntityId    = input.relatedEntityId;
      createdAt          = now;
      lastMessageAt      = now;
      lastMessagePreview = "";
    };
    state.conversations.add(id, conv);
    state.messages.add(id, List.empty<Types.Message>());
    #ok(conv);
  };

  public func sendMessage(
    state          : State,
    userProfiles   : Map.Map<Text, CompanyTypes.UserProfile>,
    caller         : Principal,
    conversationId : Types.ConversationId,
    content        : Text,
    attachmentUrls : [Text],
  ) : CommonTypes.Result<Types.Message, Text> {
    let callerId = caller.toText();
    if (not isActiveUser(userProfiles, callerId)) {
      return #err("Sender is not an approved user");
    };
    switch (state.conversations.get(conversationId)) {
      case null { return #err("Conversation not found") };
      case (?conv) {
        if (conv.participantIds.filter(func(p) { p == callerId }).size() == 0) {
          return #err("Sender is not a participant in this conversation");
        };
        state.idCounter.value += 1;
        let msgId = "msg-" # state.idCounter.value.toText();
        let now   = Time.now();
        let msg : Types.Message = {
          id             = msgId;
          senderId       = callerId;
          conversationId;
          content;
          attachmentUrls;
          sentAt         = now;
          readBy         = [];
        };
        let msgList = switch (state.messages.get(conversationId)) {
          case null {
            let l = List.empty<Types.Message>();
            state.messages.add(conversationId, l);
            l;
          };
          case (?l) { l };
        };
        msgList.add(msg);
        let updatedConv = { conv with lastMessageAt = now; lastMessagePreview = truncatePreview(content) };
        state.conversations.add(conversationId, updatedConv);
        #ok(msg);
      };
    };
  };

  public func markAsRead(
    state          : State,
    caller         : Principal,
    conversationId : Types.ConversationId,
    _upToMessageId : Types.MessageId,
  ) : CommonTypes.Result<(), Text> {
    let callerId = caller.toText();
    switch (state.messages.get(conversationId)) {
      case null { #err("Conversation not found") };
      case (?msgList) {
        let now = Time.now();
        msgList.mapInPlace(func(msg : Types.Message) : Types.Message {
          let alreadyRead = msg.readBy.find(
            func(r : Types.ReadReceipt) : Bool { r.userId == callerId }
          ) != null;
          if (not alreadyRead) {
            { msg with readBy = msg.readBy.concat([{ userId = callerId; readAt = now }]) };
          } else { msg };
        });
        #ok(());
      };
    };
  };

  public func getConversation(
    state          : State,
    conversationId : Types.ConversationId,
  ) : ?Types.Conversation {
    state.conversations.get(conversationId);
  };

  public func getConversationMessages(
    state          : State,
    conversationId : Types.ConversationId,
    limit          : Nat,
    offset         : Nat,
  ) : [Types.Message] {
    switch (state.messages.get(conversationId)) {
      case null { [] };
      case (?msgList) {
        let all   = msgList.toArray();
        let total = all.size();
        if (offset >= total) { return [] };
        let endIdx = if (offset + limit > total) { total } else { offset + limit };
        var result : [Types.Message] = [];
        var i = offset;
        while (i < endIdx) {
          result := result.concat([all[i]]);
          i += 1;
        };
        result;
      };
    };
  };

  public func listUserConversations(
    state  : State,
    userId : Text,
  ) : [Types.Conversation] {
    state.conversations.values().filter(func(c) {
      c.participantIds.filter(func(p) { p == userId }).size() > 0
    }).toArray();
  };

  public func searchMessages(
    state  : State,
    userId : Text,
    searchQuery  : Text,
  ) : [Types.Message] {
    let queryLower = searchQuery.toLower();
    var results : [Types.Message] = [];
    for ((convId, conv) in state.conversations.entries()) {
      if (conv.participantIds.find(func(p : Text) : Bool { p == userId }) != null) {
        switch (state.messages.get(convId)) {
          case null {};
          case (?msgList) {
            let matching = msgList.toArray().filter(
              func(m : Types.Message) : Bool {
                m.content.toLower().contains(#text queryLower)
              }
            );
            results := results.concat(matching);
          };
        };
      };
    };
    results;
  };

  public func addParticipant(
    state          : State,
    caller         : Principal,
    conversationId : Types.ConversationId,
    userId         : Text,
  ) : CommonTypes.Result<Types.Conversation, Text> {
    let callerId = caller.toText();
    switch (state.conversations.get(conversationId)) {
      case null { #err("Conversation not found") };
      case (?conv) {
        if (conv.participantIds.filter(func(p) { p == callerId }).size() == 0) {
          return #err("Caller is not a participant");
        };
        if (conv.participantIds.filter(func(p) { p == userId }).size() > 0) {
          return #err("User is already a participant");
        };
        let updated = { conv with participantIds = conv.participantIds.concat([userId]) };
        state.conversations.add(conversationId, updated);
        #ok(updated);
      };
    };
  };

  public func removeParticipant(
    state          : State,
    caller         : Principal,
    conversationId : Types.ConversationId,
    userId         : Text,
  ) : CommonTypes.Result<Types.Conversation, Text> {
    let callerId = caller.toText();
    switch (state.conversations.get(conversationId)) {
      case null { #err("Conversation not found") };
      case (?conv) {
        if (conv.participantIds.filter(func(p) { p == callerId }).size() == 0) {
          return #err("Caller is not a participant");
        };
        let updated = { conv with participantIds = conv.participantIds.filter(func(p) { p != userId }) };
        state.conversations.add(conversationId, updated);
        #ok(updated);
      };
    };
  };

  public func getConversationThread(
    state          : State,
    conversationId : Types.ConversationId,
  ) : ?Types.ConversationThread {
    switch (state.conversations.get(conversationId)) {
      case null { null };
      case (?conv) {
        let msgs = switch (state.messages.get(conversationId)) {
          case null  { [] };
          case (?ml) { ml.toArray() };
        };
        ?{ conversation = conv; messages = msgs };
      };
    };
  };
  public func getAllConversations(state : State) : [Types.Conversation] {
    state.conversations.values().toArray();
  };
};
