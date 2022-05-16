import { Salary } from '../entities/salary'

export type createOrUpdatetSalaryFilesPayload = Salary & {
    employee: number
}
