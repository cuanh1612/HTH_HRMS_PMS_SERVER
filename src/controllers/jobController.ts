import { Request, Response } from 'express'
import { Department } from "../entities/Department"
import { Employee } from "../entities/Employee"
import { Job } from "../entities/Job"
import { Job_Type } from "../entities/Job_Type"
import { Location } from "../entities/Location"
import { Work_Experience } from "../entities/Work_Experience"
import { createOrUpdateJobPayload } from "../type/JobPayload"
import handleCatchError from "../utils/catchAsyncError"
import { jobValid } from '../utils/valid/jobValid'




const jobControler = {
    //create new job
    create: handleCatchError(async (req:Request, res: Response) => {
        const dataNewJob: createOrUpdateJobPayload = req.body
        const { department, recruiter, locations, job_type, work_experience} = dataNewJob

        const messageValid = jobValid.createOrUpdate(dataNewJob)

        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid
            })
        
        //check exist department
        const existingDepartment = await Department.findOne({
                where: {
                    id: department
                }
            })
            if(!existingDepartment)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Department does not exist in the system'
                }) 
        
        //check existing recruiter
        if(recruiter){
            const exisitingRecruiter = await Employee.findOne({
                where: {
                    id: recruiter
                }
            }
        )
        if(!exisitingRecruiter)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Recruiter does not exist in the system',
            })
    }

        //check existing locations
        const existingLocation = await Location.findOne({
            where: {
                id: locations
            }
        })

        if(!existingLocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Location does not exist in the system'
            }) 
        
        //check job type
        const existingJobType = await Job_Type.findOne({
            where:{
                id: job_type
            }
        })

        if(!existingJobType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job type does not exist in the system'
            }) 
        

        //check work experience
        const existingWorkExperience = await Work_Experience.findOne({
            where:{
                id: work_experience
            }
        })
        
        if(!existingWorkExperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work Experience does not exist in the system'
            }) 
        
        const createJob = await Job.create({
            ...dataNewJob
        }).save()
        
        return res.status(200).json({
            code: 200,
            success: true,
            job: createJob,
            message: ' Create job',
        })
        
    }),

    update: handleCatchError(async (req: Request, res: Response) => {
        const {id} = req.params
        const datatUpdateJob : createOrUpdateJobPayload = req.body
        const { department, recruiter, locations, job_type, work_experience} = datatUpdateJob
        

         //check exist job
         const existingJob = await Job.findOne({
            where:{
                id: Number(id),
            }
         })

         if(!existingJob)
            return res.status(400).json({
                code: 400,
                success: false.valueOf,
                message: 'Job does not exist in the system'
            })

         //check exist department
         const existingDepartment = await Department.findOne({
            where: {
                id: department
            }
        })
        if(!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system'
            }) 
    
    //check existing recruiter
    if(recruiter){
        const exisitingRecruiter = await Employee.findOne({
            where: {
                id: recruiter
            }
        }
    )
    if(!exisitingRecruiter)
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Recruiter does not exist in the system',
        })
}

    //check existing locations
    const existingLocation = await Location.findOne({
        where: {
            id: locations
        }
    })

    if(!existingLocation)
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Location does not exist in the system'
        }) 
    
    //check job type
    const existingJobType = await Job_Type.findOne({
        where:{
            id: job_type
        }
    })

    if(!existingJobType)
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Job type does not exist in the system'
        }) 
    

    //check work experience
    const existingWorkExperience = await Work_Experience.findOne({
        where:{
            id: work_experience
        }
    })
    
    if(!existingWorkExperience)
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Work Experience does not exist in the system'
        }) 

    //update job
   ; (existingJob.title = datatUpdateJob.title),
   (existingJob.starts_on_date = new Date(
    new Date(datatUpdateJob.starts_on_date).toLocaleDateString()
   )),
   (existingJob.ends_on_date = new Date(
    new Date(datatUpdateJob.ends_on_date).toLocaleDateString()
   )),
   (existingJob.skills = datatUpdateJob.skills),
   (existingJob.locations = datatUpdateJob.locations),
   (existingJob.department = datatUpdateJob.department),
   (existingJob.status = datatUpdateJob.status),
   (existingJob.total_openings = datatUpdateJob.total_openings),
   (existingJob.job_type = datatUpdateJob.job_type),
   (existingJob.work_experience = datatUpdateJob.work_experience),
   (existingJob.recruiter = datatUpdateJob.recruiter),
   (existingJob.starting_salary_amount = datatUpdateJob.starting_salary_amount),
   (existingJob.job_description = datatUpdateJob.job_description)

    await existingJob.save()

    return res.status(200).json({
        code: 200,
        success: true,
        message: 'Update Job success'
    })
    }),

    getAll:handleCatchError(async(_: Request, res: Response) =>{
        const jobs = Job.find()

        return res.status(200).json({
            code: 200,
            success: true,
            jobs, 
            message: 'Get all jobs success'
        })
    }),

    getDetail: handleCatchError(async(req: Request, res: Response) =>{
        const { id } = req.params

        const existingJob = await Job.findOne({
            where: {
                id: Number(id)
            }
        })

        if(!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system'
            })
        return res.status(200).json({
            code: 200,
            success: true,
            job: existingJob,
            message: 'Get detail of job success'
        })
    }),

    delete: handleCatchError(async(req: Request, res: Response) =>{
        const {id} = req.params

        const existingJob = await Job.findOne({
            where: {
                id: Number(id)
            }
        })

        if(!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system'
            })
        
        await existingJob.remove()
        
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete this job success'
        })
    }),

    deleteMany: handleCatchError(async(req: Request, res: Response) =>{
        const {jobs} = req.body


        //check array of job
        if( !Array.isArray(jobs) || !jobs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            })
        await Promise.all(
            jobs.map(async (id: number) =>{
                return new Promise(async (resolve) =>{
                    
                    const existingJob = await Job.findOne({
                        where: {
                            id: id,
                        },
                    })
    
                    if (existingJob) await Job.remove(existingJob)
                    resolve(true)
                })
                
            })
        )

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete jobs success'
        })
    }),

    changeStatusMany: handleCatchError(async(req: Request, res: Response) =>{
        const {jobs} = req.body
        const { status } = req.body
        
        //check array of job
        if( !Array.isArray(jobs) || !jobs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            })
        await Promise.all(
            jobs.map(async (id: number) =>{
                return new Promise(async (resolve) =>{
                    
                    const existingJob = await Job.findOne({
                        where: {
                            id: id,
                        },
                    })
    
                    if (existingJob){
                        existingJob.status = status
                    } await existingJob?.save
                    
                    resolve(true)
                })
                
            })
        )

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'change status jobs success'
        })
    })
    
}

export default jobControler