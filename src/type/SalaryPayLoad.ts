import { Salary } from '../entities/Salary.entity'

export type createOrUpdateSalaryFilesPayload = Salary & {
    employee: number
}
