import { Leave } from '../entities/Leave.entity';

export type createOrUpdateLeavePayload = Leave & { employee: number, dates: Date[], leave_type: number };
