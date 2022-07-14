import { Interview_file } from '../entities/Interview_File'

export type createOrUpdateInterviewFilesPayload = {
    files: Interview_file[]
    interview: number
}
