import { Interview_file } from '../entities/Interview_File.entity'

export type createOrUpdateInterviewFilesPayload = {
    files: Interview_file[]
    interview: number
}
