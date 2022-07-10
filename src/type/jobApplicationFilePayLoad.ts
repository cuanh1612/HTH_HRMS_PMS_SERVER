import { Job_application_file } from '../entities/Job_Application_File'

export type createOrUpdatetJobApplicationFilesPayload = {
	files: Job_application_file[]
	jobApplication: number
}
