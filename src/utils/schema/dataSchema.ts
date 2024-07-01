import { z } from "zod";

export const DataSchema = z.object({
    planType: z.string(),
    mobileNetwork: z.string(),
    mobileNumber: z.string().min(11).max(11),
    amountCharged: z.string(),
})