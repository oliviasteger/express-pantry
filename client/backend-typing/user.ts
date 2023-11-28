import { z } from "zod";
import { zBaseDoc } from "./base";

export const zUserType = z.union([z.literal("Administrator"), z.literal("Client")]);

export const zUserInfo = z.object({ isSnapEligible: z.optional(z.boolean()), location: z.optional(z.string()) });

export const zUserDoc = zBaseDoc.merge(z.object({ username: z.string(), password: z.string(), type: zUserType, information: zUserInfo }));
