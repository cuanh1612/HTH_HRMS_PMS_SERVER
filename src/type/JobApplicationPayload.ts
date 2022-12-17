import { Job_Application } from "../entities/Job_Application.entity";
import { Job_application_file } from "../entities/Job_Application_File.entity";

export type createOrUpdateJobApplicationPayload = Job_Application & { jobs: number, location: number, files?: Job_application_file[]}