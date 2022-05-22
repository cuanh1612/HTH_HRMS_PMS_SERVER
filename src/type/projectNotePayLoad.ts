import { Project_note } from '../entities/Project_Note'

export type createOrUpdatetProjectNotePayload = Project_note & { employees: number[], project: number }
