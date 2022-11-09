import { Job } from "../entities/Job.entity";

export type createOrUpdateJobPayload = Job & { department: number, recruiter: number, job_type: number, work_experience: number, skills: number[], locations: number[]}