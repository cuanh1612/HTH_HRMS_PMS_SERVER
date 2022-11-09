
import { enumPriority } from '../../entities/Task.entity'
import { createOrUpdateTaskPayload } from '../../type/taskPayload'

export const taskValid = {
    createOrUpdate: ({
        name,
        start_date,
        deadline,
        employees,
        priority

    }: createOrUpdateTaskPayload) => {
        let messageError = ''

        //Check exist datas
        if (!name || !start_date || !deadline || ! Array.isArray(employees)) {
            messageError = 'Please enter full field'
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
