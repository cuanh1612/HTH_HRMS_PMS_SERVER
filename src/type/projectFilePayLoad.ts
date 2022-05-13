import { Project_file } from '../entities/Project_File'

export type createOrUpdatetProjectFilesPayload = {
    files: Project_file[]
    project: number
}
