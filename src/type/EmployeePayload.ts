import { Employee } from "../entities/Employee";

export type createOrUpdatetEmployeePayload = Employee & {department: number, designation: number}