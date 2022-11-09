import { Conversation } from '../entities/Conversation.entity';

export type createOrUpdateConversationPayload = Conversation & { user_one: number; user_two: number }
