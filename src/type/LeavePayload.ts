import { Leave } from '../entities/Leave';

export type createOrUpdatetLeavePayload = Leave & { employee: number, date: string | string [], leave_type: number };
