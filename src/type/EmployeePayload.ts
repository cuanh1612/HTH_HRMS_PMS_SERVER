import { Employee } from '../entities/Employee.entity'

export type createOrUpdateEmployeePayload = Employee & { department: number; designation: number, index: number }
