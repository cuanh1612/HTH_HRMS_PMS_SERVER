import { Task_file } from '../entities/Task_File'

export type createOrUpdatetTaskFilesPayload = {
    files: Task_file[]
    task: number
}
