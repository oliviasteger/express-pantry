import { ObjectId } from "mongodb";
import { z } from "zod";
import { zBaseDoc } from "./base";

export const zExpiringItemStatus = z.union([z.literal("Unreleased"), z.literal("Claimable"), z.literal("Ordered"), z.literal("Used"), z.literal("Expired")]);

export const zExpiringItemDoc = zBaseDoc.merge(z.object({ administrator: z.instanceof(ObjectId), barcode: z.string(), dropDate: z.date(), expirationDate: z.date(), status: zExpiringItemStatus }));
