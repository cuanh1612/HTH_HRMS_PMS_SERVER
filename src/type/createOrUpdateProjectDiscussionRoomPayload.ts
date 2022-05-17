import { Project_Discussion_Room } from "../entities/Project_Discussion_Room";


export type createOrUpdateProjectDiscussionRoomPayload = Project_Discussion_Room & { employee: number, project: number, project_discussion_category: number }
