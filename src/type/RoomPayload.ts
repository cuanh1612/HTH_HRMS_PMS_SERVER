import { Room } from "../entities/Room.entity";


export type createOrUpdateRoomPayload = Room & { clients: number[], employees: number[], empl_create: number}
