import { Conversation_reply } from '../entities/Conversation_Reply.entity';

export type createOrUpdateConversationReplyPayload = Conversation_reply & { user: number, conversation: number }
