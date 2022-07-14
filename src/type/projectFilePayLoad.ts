import { Project_file } from '../entities/Project_File'

export type createOrUpdateProjectFilesPayload = {
    files: Project_file[]
    project: number,
    assignBy?: number
}
