import { Salary } from '../entities/Salary'

export type createOrUpdateSalaryFilesPayload = Salary & {
    employee: number
}
