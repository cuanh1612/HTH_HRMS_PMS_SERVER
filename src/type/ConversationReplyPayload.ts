import { Conversation_reply } from '../entities/Conversation_Reply';

export type createOrUpdateConversationReplyPayload = Conversation_reply & { user: number, conversation: number }
