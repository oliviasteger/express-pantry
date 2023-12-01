import assert from "assert";
import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export type OrderStatus = "placed" | "packed" | "picked up";
export interface OrderDoc extends BaseDoc {
  sender: ObjectId;
  recipient: ObjectId;
  items: ObjectId[];
  status: OrderStatus;
  pickup: Date;
}

export default class OrderConcept {
  public readonly orders = new DocCollection<OrderDoc>("orders");

  async create(sender: ObjectId, recipient: ObjectId, items: ObjectId[], pickup: Date) {
    assert(items.length > 0, "No items in order");
    const _id = await this.orders.createOne({ sender, recipient, items, pickup, status: "placed" });
    return { msg: "order created successfully!", order: await this.orders.readOne({ _id }) };
  }

  async getorderById(_id: ObjectId) {
    const order = await this.orders.readOne({ _id });
    assert(order !== null, "order with given ID does not exist!");
    return order;
  }

  async getordersByQuery(query: Partial<OrderDoc>) {
    const orders = await this.orders.readMany(query);

    return orders;
  }

  async update(_id: ObjectId, update: Partial<OrderDoc>) {
    await this.orders.updateOne({ _id }, update);
    return { msg: "order updated successfully!" };
  }

  async delete(_id: ObjectId) {
    await this.orders.deleteOne({ _id });
    return { msg: "order deleted!" };
  }
}
