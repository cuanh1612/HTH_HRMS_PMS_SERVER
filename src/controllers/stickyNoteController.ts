import { Request, Response } from 'express';
import { Secret, verify } from "jsonwebtoken";
import { Employee } from "../entities/Employee";
import { Sticky_note } from '../entities/StickyNote';

import { UserAuthPayload } from "../type/UserAuthPayload";
import handleCatchError from "../utils/catchAsyncError";



const stickyNoteController = {
    //create note:
    create: handleCatchError(async (req: Request, res: Response) =>{
        const dataNote: Sticky_note = req.body
        const { note } = dataNote

        
        if(!note)
        return res.status(401).json({
            code: 400,
            success: false,
            message: 'Please enter note',
        })

         //check exist current user
         const token = req.headers.authorization?.split(' ')[1]

         if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            })

        const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

        //Get data user
        const existingUser = await Employee.findOne({
            where: {
                id: decode.userId,
            },
        })

        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            })
        
        const createNote = await Sticky_note.create({
            ...dataNote,
            employee: existingUser,
        }).save()       

        return res.status(200).json({
            code: 200,
            success: true,
            note: createNote,
            message: 'Create note success'
        })
    }),

    //update note
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const dataUpdate :Sticky_note = req.body
        const {note} = dataUpdate

        const existingNote = await Sticky_note.findOne({
            where:{
                id: Number(id)
            },
            relations: {
                employee: true
            }
        })

        if(!existingNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'The sticky note does not exist in the system'
            })
        
        if(!note)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field'
            })
        
        //check exist current user
        const token = req.headers.authorization?.split(' ')[1]

        if (!token)
           return res.status(401).json({
               code: 400,
               success: false,
               message: 'Please login first',
           })

       const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

       //Get data user
       const existingUser = await Employee.findOne({
           where: {
               id: decode.userId,
           },
       })

       if (!existingUser || existingUser.id != existingNote.employee.id)
           return res.status(400).json({
               code: 400,
               success: false,
               message: 'User does not exist in the system'
           })
       
        
        ;(existingNote.color = dataUpdate.color),
        (existingNote.note = dataUpdate.note)

        await existingNote.save()

        return res.status(200).json({
            code: 400,
            success: true,
            message: 'Update note success',
        })
    }),
    delete: handleCatchError(async (req: Request, res: Response) =>{
        const {id} = req.params

        const existingNote = await Sticky_note.findOne({
            where:{
                id: Number(id)
            },
            relations: {
                employee: true
            }
        })

        if(!existingNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'The sticky note does not exist in the system'
            })
        
         //check exist current user
         const token = req.headers.authorization?.split(' ')[1]

         if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            })
 
        const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload
 
        //Get data user
        const existingUser = await Employee.findOne({
            where: {
                id: decode.userId,
            },
        })
 
        if (!existingUser || existingUser.id != existingNote.employee.id)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            })
       
        await existingNote.remove()

        return res.status(200).json({
            code: 400,
            success: true,
            message: 'Delete note success',
        })
        
    }),
    getDetail: handleCatchError( async (req: Request , res: Response) => {
        const {id} = req.params

        const existingNote = await Sticky_note.findOne({
            where:{
                id: Number(id)
            },
            relations: {
                employee: true
            }
        })

        if(!existingNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'The sticky note does not exist in the system'
            })
        
         //check exist current user
         const token = req.headers.authorization?.split(' ')[1]

         if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            })
 
        const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload
 
        //Get data user
        const existingUser = await Employee.findOne({
            where: {
                id: decode.userId,
            },
        })
 
        if (!existingUser || existingUser.id !== existingNote.employee.id)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            })
       
         return res.status(200).json({
                code: 200,
                success: true,
                stickyNote: existingNote,
                Message: 'Get detail sticky note success'
            })
    }),

    getByEmployee: handleCatchError ( async (req: Request, res: Response) =>{
        
         //check exist current user
         const token = req.headers.authorization?.split(' ')[1]

         if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            })
 
        const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload
 
        //Get data user
        const existingUser = await Employee.findOne({
            where: {
                id: decode.userId,
            },
        })

        const stickyNotes = await Sticky_note.find({
            where:{
                employee: {
                    id: existingUser?.id
                }
            },
            order: {
                createdAt: "DESC"
            }
        })
        
     
         return res.status(200).json({
                code: 200,
                success: true,
                stickyNotes,
                Message: 'Get detail sticky note success'
            })
    })

}


export default stickyNoteController