import { Contract_file } from '../entities/Contract_File.entity'

export type createOrUpdateContractFilesPayload = {
    files: Contract_file[]
    contract: number
}
