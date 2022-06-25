import { Job } from "../entities/Job";

export type createOrUpdateJobPayload = Job & { department: number, recruiter: number, locations: number, job_type: number, work_experience: number}