import { Job_Application } from "../entities/Job_Application";

export type createOrUpdateJobApplicationPayload = Job_Application & { jobs: number, location: number}