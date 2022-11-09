import { Project_file } from '../entities/Project_File.entity'

export type createOrUpdateProjectFilesPayload = {
    files: Project_file[]
    project: number,
    assignBy?: number
}
