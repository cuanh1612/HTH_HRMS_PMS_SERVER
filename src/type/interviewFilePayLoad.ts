import { Interview_file } from '../entities/Interview_File'

export type createOrUpdatetInterviewFilesPayload = {
    files: Interview_file[]
    interview: number
}
