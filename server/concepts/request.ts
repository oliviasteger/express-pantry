import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export type RequestStatus = "Pending" | "Accepted" | "Rejected";

export interface RequestDoc extends BaseDoc {
  barcode: string;
  requester: ObjectId;
  requestee: ObjectId;
  status: RequestStatus;
}

export default class RequestConcept {
  public readonly requests = new DocCollection<RequestDoc>("requests");

  async create(barcode: string, requester: ObjectId, requestee: ObjectId) {
    const _id = await this.requests.createOne({ barcode, requester, requestee, status: "Pending" });
    return { msg: "Request successfully created!", post: await this.requests.readOne({ _id }) };
  }

  async getRequests(query: Filter<RequestDoc>) {
    const requests = await this.requests.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return requests;
  }

  async update(_id: ObjectId, update: Partial<RequestDoc>) {
    const request = await this.requests.readOne({ _id });
    if (!request) throw new NotFoundError(`Request ${_id} does not exist!`);

    const allowedUpdates = ["barcode", "status"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }

    await this.requests.updateOne({ _id }, update);
    return { msg: "Request successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.requests.deleteOne({ _id });
    return { msg: "Request deleted successfully!" };
  }

  async isRequester(user: ObjectId, _id: ObjectId) {
    const request = await this.requests.readOne({ _id });
    if (!request) {
      throw new NotFoundError(`Request ${_id} does not exist!`);
    }
    if (request.requester.toString() !== user.toString()) {
      throw new RequestRequesterNotMatchError(user, _id);
    }
  }

  async isRequestee(user: ObjectId, _id: ObjectId) {
    const request = await this.requests.readOne({ _id });
    if (!request) {
      throw new NotFoundError(`Request ${_id} does not exist!`);
    }
    if (request.requestee.toString() !== user.toString()) {
      throw new RequestRequesteeNotMatchError(user, _id);
    }
  }
}

export class RequestRequesterNotMatchError extends NotAllowedError {
  constructor(
    public readonly requester: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the requester of request {1}!", requester, _id);
  }
}

export class RequestRequesteeNotMatchError extends NotAllowedError {
  constructor(
    public readonly requestee: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the requestee of request {1}!", requestee, _id);
  }
}
