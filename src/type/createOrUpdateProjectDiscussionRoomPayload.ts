import { Project_Discussion_Room } from "../entities/Project_Discussion_Room.entity";

export type createOrUpdateProjectDiscussionRoomPayload = Project_Discussion_Room & { project: number, project_discussion_category: number, description: string }
