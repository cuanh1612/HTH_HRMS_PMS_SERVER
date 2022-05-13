import { Project } from '../entities/Project'

export type createOrUpdateProjectPayload = Project & { project_category: number, department: number, client: number, employees: number[], Added_by: number }
