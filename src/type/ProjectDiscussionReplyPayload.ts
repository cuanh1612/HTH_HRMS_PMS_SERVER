import { Project_discussion_reply } from "../entities/Project_Discussion_Reply";


export type createOrUpdateProjectDiscussionreplyPayload = Project_discussion_reply & { employee: number, project_discussion_room: number, project: number }
