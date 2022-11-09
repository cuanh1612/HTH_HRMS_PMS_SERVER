import { Job_offer_letter } from "../entities/Job_Offer_Letter.entity";

export type createOrUpdateJobOfferLetterPayload = Job_offer_letter & { job: number, job_application: number}