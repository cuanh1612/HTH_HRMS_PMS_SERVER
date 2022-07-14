import { Employee } from '../entities/Employee'

export type createOrUpdateEmployeePayload = Employee & { department: number; designation: number, index: number }
