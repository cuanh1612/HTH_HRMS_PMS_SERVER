import { Task_file } from '../entities/Task_File.entity'

export type createOrUpdateTaskFilesPayload = {
    files: Task_file[]
    task: number
}
