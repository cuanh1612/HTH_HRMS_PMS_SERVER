import { Leave } from '../entities/Leave';

export type createOrUpdatetLeavePayload = Leave & { employee: number, dates: Date[], leave_type: number };
