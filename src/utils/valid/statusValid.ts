import { Status } from "../../entities/Status.entity"

export const statusValid = {
    createOrUpdate: ({
        title,
        project,
        root,
        index
        
        
    }: Status, typeValid: 'create' | 'update' | 'change') => {
        let messageError = ''


        if (typeValid === 'create' && !project || !title) {
			messageError = 'Please enter full field'
			return messageError
		}


        //check root of status
        if(typeValid === 'update' && root === true){
            messageError = 'This status has root is true'
            return messageError
        }

        //check index of status
        if (typeValid === 'change' && !index) {
			messageError = 'Please enter index to change position'
			return messageError
		}



        return messageError

    }
}