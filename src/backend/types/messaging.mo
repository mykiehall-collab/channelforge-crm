// Messaging types for CHANNELFORGE CRM internal communication system

module {
  public type MessageId = Text;
  public type ConversationId = Text;

  public type ReadReceipt = {
    userId  : Text;
    readAt  : Int;
  };

  public type Message = {
    id            : MessageId;
    senderId      : Text;
    conversationId: ConversationId;
    content       : Text;
    attachmentUrls: [Text];
    sentAt        : Int;
    readBy        : [ReadReceipt];
  };

  public type MessageInput = {
    conversationId: ConversationId;
    content       : Text;
    attachmentUrls: [Text];
  };

  // Context that a conversation is anchored to (account, deal, renewal, etc.)
  public type ConversationType = {
    #DirectMessage;
    #GroupMessage;
    #AccountThread;
    #DealThread;
    #RenewalThread;
  };

  public type Conversation = {
    id                 : ConversationId;
    conversationType   : ConversationType;
    participantIds     : [Text];
    relatedEntityId    : ?Text;   // accountId, dealId, renewalId, etc.
    createdAt          : Int;
    lastMessageAt      : Int;
    lastMessagePreview : Text;
  };

  public type ConversationInput = {
    conversationType: ConversationType;
    participantIds  : [Text];
    relatedEntityId : ?Text;
  };

  // Full conversation metadata bundled with its messages
  public type ConversationThread = {
    conversation: Conversation;
    messages    : [Message];
  };
};
