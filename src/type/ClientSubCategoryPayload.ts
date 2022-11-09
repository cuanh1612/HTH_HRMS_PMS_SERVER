import { Client_Sub_Category } from '../entities/Client_Sub_Category.entity'

export type createOrUpdateClientSubCategoryPayload = Client_Sub_Category & {client_category: number}
