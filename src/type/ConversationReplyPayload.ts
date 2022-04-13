import { Conversation_reply } from '../entities/ConversationReply';

export type createOrUpdateConversationReplyPayload = Conversation_reply & { user: number, conversation: number }
