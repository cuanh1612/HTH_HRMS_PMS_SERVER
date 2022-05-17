import { Salary } from '../entities/Salary'

export type createOrUpdatetSalaryFilesPayload = Salary & {
    employee: number
}
