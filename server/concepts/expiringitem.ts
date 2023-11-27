import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ExpiringItemDoc extends BaseDoc {
  barcode: string;
  dropDate: Date;
  expirationDate: Date;
}

export default class ExpiringItemConcept {
  public readonly expiringitems = new DocCollection<ExpiringItemDoc>("expiringitems");

  async create(barcode: string, dropDate: Date, expirationDate: Date) {
    this.areDatesValid(dropDate, expirationDate);
    const _id = await this.expiringitems.createOne({ barcode, dropDate, expirationDate });
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
    await this.expiringitems.updateOne({ _id }, update);
    return { msg: "Expiring item successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.expiringitems.deleteOne({ _id });
    return { msg: "Expiring item deleted successfully!" };
  }

  private areDatesValid(dropDate: Date, expirationDate: Date) {
    if (expirationDate.getTime() < dropDate.getTime()) {
      throw new NotAllowedError(`Cannot have an item that expires before being released!`);
    }
  }
}
