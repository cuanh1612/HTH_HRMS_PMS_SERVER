import { Task } from '../entities/Task'

export type createOrUpdateTaskPayload = Task & { task_category: number, project: number, employees: number[], status: number, milestone: number }
