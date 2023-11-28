import { ObjectId } from "mongodb";
import { z } from "zod";

interface BaseDoc {
  _id: ObjectId;
  dateCreated: Date;
  dateUpdated: Date;
}

export const zBaseDoc = z.object({ _id: z.instanceof(ObjectId), dateCreated: z.date(), dateUpdated: z.date() });
