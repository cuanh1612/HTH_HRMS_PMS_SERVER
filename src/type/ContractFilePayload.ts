import { Contract_file } from '../entities/Contract_File'

export type createOrUpdatetContractFilesPayload = {
    files: Contract_file[]
    contract: number
}
