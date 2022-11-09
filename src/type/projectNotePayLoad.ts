import { Project_note } from '../entities/Project_Note.entity'

export type createOrUpdateProjectNotePayload = Project_note & { employees: number[], project: number }
