import { enumDuration, enumStatus } from '../../entities/Leave';
import { createOrUpdatetLeavePayload } from '../../type/LeavePayload';

export const leaveValid = {
  createOrUpdate: ({ status, duration, employee, leave_type, dates, date }: createOrUpdatetLeavePayload) => {
    let messageError = '';

    if (!employee || !leave_type || (!dates && !date)) {
      messageError = 'Pleas enter full field';
      return messageError;
    }

    if (status && status !== enumStatus.APPROVED && status !== enumStatus.PENDING) {
      messageError = 'Status not valid';
      return messageError;
    }

    if (duration && duration !== enumDuration.HALF_DAY && duration !== enumDuration.SINGLE) {
      messageError = 'Duration not valid';
      return messageError;
    }

    return messageError;
  },
};
