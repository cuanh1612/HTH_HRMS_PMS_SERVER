import { Sign } from "../entities/Sign.entity";

export type createOrUpdateSignPayload = Sign & { contract: number, jobOfferLetter: number };
