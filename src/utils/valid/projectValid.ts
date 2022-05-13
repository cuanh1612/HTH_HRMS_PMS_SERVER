import { enumCurrency } from '../../entities/Project'
import { createOrUpdateProjectPayload } from '../../type/ProjectPayload'

export const projectValid = {
    createOrUpdate: ({
        name,
        start_date,
        Deadline,
        employees,
        currency,
        send_task_noti
    }: createOrUpdateProjectPayload) => {
        let messageError = ''

        //Check exist datas
        if (!name || !start_date || !Deadline || !employees || !send_task_noti) {
            messageError = 'Pleas enter full field'
            return messageError
        }
        
        //Check valid time
        const StartDateProject = new Date(start_date)
        const EndDateProject = new Date(Deadline)
        if(EndDateProject < StartDateProject) {
            messageError = 'Deadline date project must be greater than start date project'
            return messageError
        }

        //Check enum currency
        if (
            currency &&
            currency !== enumCurrency.EUR &&
            currency !== enumCurrency.GBP &&
            currency !== enumCurrency.INR &&
            currency !== enumCurrency.USD &&
            currency !== enumCurrency.VND
        ) {
            messageError = 'Status not valid'
            return messageError
        }



        return messageError
    },
}
