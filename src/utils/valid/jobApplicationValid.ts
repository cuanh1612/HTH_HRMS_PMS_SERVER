import { createOrUpdateJobApplicationPayload } from "../../type/JobApplicationPayload"



export const jobApplicationValid = {
    createOrUpdate: (
        {name, jobs, email, mobile, location, picture}:createOrUpdateJobApplicationPayload) =>{
            let messageError =''

            //check exist data
            if( !name || !jobs || !email || !mobile || !location || !picture){
                messageError = 'Please enter full field'
                return messageError
            }
        }
}