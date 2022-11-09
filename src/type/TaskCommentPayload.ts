import { Task_comment } from '../entities/Task_Comment.entity'

export type createOrUpdateTaskCommentPayload = Task_comment & {
	task: number
    project: number
}
