import { Room } from "../entities/Room";


export type createOrUpdateRoomPayload = Room & { clients: number[], employees: number[], empl_create: number}
