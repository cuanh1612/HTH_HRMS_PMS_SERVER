import { Job_application_file } from '../entities/Job_Application_File'

export type createOrUpdateJobApplicationFilesPayload = {
	files: Job_application_file[]
	jobApplication: number
}
