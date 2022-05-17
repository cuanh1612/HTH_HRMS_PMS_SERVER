import { enumStatus } from '../../entities/Task'
import { enumPriority } from '../../entities/Task'
import { createOrUpdateTaskPayload } from '../../type/taskPayload'

export const taskValid = {
    createOrUpdate: ({
        name,
        start_date,
        deadline,
        employees,
        status,
        priority

    }: createOrUpdateTaskPayload) => {
        let messageError = ''

        //Check exist datas
        if (!name || !start_date || !deadline || !employees) {
            messageError = 'Pleas enter full field'
            return messageError
        }
        
        //Check valid time
        const StartDatetask = new Date(start_date)
        const EndDatetask = new Date(deadline)
        if(EndDatetask < StartDatetask) {
            messageError = 'Deadline date task must be greater than start date task'
            return messageError
        }

        //Check enum currency
        if (
            status &&
            status !== enumStatus.COMPLETED &&
            status !== enumStatus.DOING &&
            status !== enumStatus.INCOMPLETE &&
            status !== enumStatus.TO_DO
          
        ) {
            messageError = 'Status not valid'
            return messageError
        }
        //Check enum currency
        if (
            priority &&
            priority !== enumPriority.HIGH &&
            priority !== enumPriority.LOW &&
            priority !== enumPriority.MEDIUM 
    
          
        ) {
            messageError = 'Priority not valid'
            return messageError
        }



        return messageError
    },
}
