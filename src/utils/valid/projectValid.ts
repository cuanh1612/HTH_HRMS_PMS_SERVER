import { enumCurrency } from '../../entities/Project'
import { createOrUpdateProjectPayload } from '../../type/ProjectPayload'

export const projectValid = {
    createOrUpdate: ({
        name,
        start_date,
        deadline,
        employees,
        currency
    }: createOrUpdateProjectPayload) => {
        let messageError = ''

        if (!name || !start_date || !deadline || !employees) {
            messageError = 'Pleas enter full field'
            return messageError
        }

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
