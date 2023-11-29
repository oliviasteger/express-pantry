import { ObjectId } from "mongodb";
import { z } from "zod";
import { zBaseDoc } from "./base";

export const zProfileRules = z.object({ snapRequired: z.boolean(), location: z.string() });

export const zProfileDoc = zBaseDoc.merge(
  z.object({
    administrato: z.instanceof(ObjectId),
    location: z.string(),
    name: z.string(),
    openHour: z.number().max(24).min(0),
    closeHour: z.number().max(24).min(0),
    pickupWindowLength: z.number().min(0),
    ordersPerWindow: z.number(),
    rules: zProfileRules.partial(),
  }),
);
