import { Project_note } from '../entities/Project_Note'

export type createOrUpdateProjectNotePayload = Project_note & { employees: number[], project: number }
