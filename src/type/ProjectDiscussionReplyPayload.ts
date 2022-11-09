import { Project_discussion_reply } from "../entities/Project_Discussion_Reply.entity";


export type createOrUpdateProjectDiscussionReplyPayload = Project_discussion_reply & {project_discussion_room: number, project: number }
