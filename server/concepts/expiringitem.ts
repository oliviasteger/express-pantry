import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export type ExpiringItemStatus = "Unreleased" | "Claimable" | "Ordered" | "Used" | "Expired";

export interface ExpiringItemDoc extends BaseDoc {
  administrator: ObjectId;
  barcode: string;
  dropDate: Date;
  expirationDate: Date;
  status: ExpiringItemStatus;
}

export default class ExpiringItemConcept {
  public readonly expiringitems = new DocCollection<ExpiringItemDoc>("expiringitems");

  async create(administrator: ObjectId, barcode: string, dropDate: Date, expirationDate: Date, status: ExpiringItemStatus) {
    this.areDatesValid(dropDate, expirationDate);
    const _id = await this.expiringitems.createOne({ administrator, barcode, dropDate, expirationDate, status });
    return { msg: "Expiring item successfully created!", post: await this.expiringitems.readOne({ _id }) };
  }

  async getExpiringItems(query: Filter<ExpiringItemDoc>) {
    const expiringitems = await this.expiringitems.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return expiringitems;
  }

  async update(_id: ObjectId, update: Partial<ExpiringItemDoc>) {
    const expiringitem = await this.expiringitems.readOne({ _id });
    if (!expiringitem) throw new NotFoundError(`Expiring item ${_id} does not exist!`);
    this.areDatesValid(update.dropDate ? update.dropDate : expiringitem?.dropDate, update.expirationDate ? update.expirationDate : expiringitem.dropDate);

    const allowedUpdates = ["barcode", "dropDate", "expirationDate", "status"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }

    await this.expiringitems.updateOne({ _id }, update);
    return { msg: "Expiring item successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.expiringitems.deleteOne({ _id });
    return { msg: "Expiring item deleted successfully!" };
  }

  async isAdministrator(user: ObjectId, _id: ObjectId) {
    const expiringitem = await this.expiringitems.readOne({ _id });
    if (!expiringitem) {
      throw new NotFoundError(`Expiring item ${_id} does not exist!`);
    }
    if (expiringitem.administrator.toString() !== user.toString()) {
      throw new ItemAdministratorNotMatchError(user, _id);
    }
  }

  private areDatesValid(dropDate: Date, expirationDate: Date) {
    if (expirationDate.getTime() < dropDate.getTime()) {
      throw new NotAllowedError(`Cannot have an item that expires before being released!`);
    }
  }
}

export class ItemAdministratorNotMatchError extends NotAllowedError {
  constructor(
    public readonly administrator: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the administrator of expiring item {1}!", administrator, _id);
  }
}
