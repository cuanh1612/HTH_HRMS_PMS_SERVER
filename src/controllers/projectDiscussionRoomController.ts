import { Request, Response } from 'express'
import { createOrUpdateProjectDiscussionRoomPayload } from '../type/createOrUpdateProjectDiscussionRoomPayload'
import handleCatchError from '../utils/catchAsyncError'


const projectDiscussionRoomController = {
    //Create new Project Discussion room
    create: handleCatchError(async(req: Request, res: Response) =>{
        const dataNewPdiscussion: createOrUpdateProjectDiscussionRoomPayload = req.body
        
        
    })
}

export default projectDiscussionRoomController