import { Contract_file } from '../entities/Contract_File'

export type createOrUpdateContractFilesPayload = {
    files: Contract_file[]
    contract: number
}
