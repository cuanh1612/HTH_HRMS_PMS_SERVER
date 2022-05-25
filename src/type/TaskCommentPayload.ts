import { Task_comment } from '../entities/Task_Comment'

export type createOrUpdateTaskCommentPayload = Task_comment & {
	task: number
    project: number
}
