import { Conversation } from '../entities/Conversation';

export type createOrUpdateConversationPayload = Conversation & { user_one: number; user_two: number }
