import { Sign } from "../entities/Sign";

export type createOrUpdateSignPayload = Sign & { contract: number, jobOfferLetter: number };
