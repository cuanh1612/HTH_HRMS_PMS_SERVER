import { Leave } from '../entities/Leave';

export type createOrUpdateLeavePayload = Leave & { employee: number, dates: Date[], leave_type: number };
