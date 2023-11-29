import assert from "assert";
import { ObjectId } from "mongodb";
import { User } from "../app";
import DocCollection, { BaseDoc } from "../framework/doc";
import { SanitizedUserDoc } from "./user";

export interface ProfileRules {
  snapRequired: boolean;
  locationProximity: boolean;
}
export interface ProfileDoc extends BaseDoc {
  administrator: ObjectId;
  location: string;
  name: string;
  openHour: number;
  closeHour: number;
  pickupWindowLength: number;
  ordersPerWindow: number;
  rules: Partial<ProfileRules>;
}

export default class ProfileConcept {
  public readonly profiles = new DocCollection<ProfileDoc>("profiles");

  async create(administrator: ObjectId, location: string, name: string, openHour: number, closeHour: number, pickupWindowLength: number, ordersPerWindow: number, rules?: Partial<ProfileRules>) {
    await User.getUserById(administrator);
    assert(openHour < 24 && openHour >= 0, "Opening hour cannot be negative or greater than 24");
    assert(closeHour < 24 && closeHour >= 0, "Closing hour cannot be negative or greater than 24");
    assert(pickupWindowLength > 0, "Pickup window length must be positive");
    assert(ordersPerWindow > 0 && ordersPerWindow % 1 === 0, "Orders per window must be a positive integer");
    const _id = await this.profiles.createOne({ administrator, location, name, openHour, closeHour, pickupWindowLength, ordersPerWindow, rules });
    return { msg: "Profile created successfully!", profile: await this.profiles.readOne({ _id }) };
  }

  async getProfileById(_id: ObjectId) {
    const profile = await this.profiles.readOne({ _id });
    assert(profile !== null, "Profile with given ID does not exist!");
    return profile;
  }

  async getProfilesByQuery(query: Partial<ProfileDoc>) {
    const profiles = await this.profiles.readMany(query);

    return profiles;
  }

  async update(_id: ObjectId, update: Partial<ProfileDoc>) {
    if (update.administrator) await User.getUserById(update.administrator);
    if (update.openHour) assert(update.openHour < 24 && update.openHour >= 0, "Opening hour cannot be negative or greater than 24");
    if (update.closeHour) assert(update.closeHour < 24 && update.closeHour >= 0, "Closing hour cannot be negative or greater than 24");
    if (update.pickupWindowLength) assert(update.pickupWindowLength > 0, "Pickup window length must be positive");
    if (update.ordersPerWindow) assert(update.ordersPerWindow > 0 && update.ordersPerWindow % 1 === 0, "Orders per window must be a positive integer");
    await this.profiles.updateOne({ _id }, update);
    return { msg: "Profile updated successfully!" };
  }

  async delete(_id: ObjectId) {
    await this.profiles.deleteOne({ _id });
    return { msg: "Profile deleted!" };
  }

  async assertEligible(profileId: ObjectId, user: SanitizedUserDoc) {
    const profile = await this.getProfileById(profileId);
    assert(profile !== null);
    const profileRules = profile.rules;
    if (profileRules.locationProximity) {
      assert(user.information !== undefined && user.information !== null, "User has no eligibility information");
      assert(user.information.location !== undefined, "User does not have a location");
      assert(profile.location === user.information.location, "User is not in same location as pantry");
    }
    if (profileRules.snapRequired) {
      assert(user.information !== undefined, "User has no eligibility information");
      assert(user.information.isSnapEligible !== undefined, "User's snap eligibility is not inputted");
      assert(user.information.isSnapEligible, "User is not snap eligible");
    }
  }

  async assertAdministrator(userId: ObjectId, profileId: ObjectId) {
    const profile = await this.getProfileById(profileId);
    assert(userId.equals(profile.administrator), "User is not the administrator for this pantry");
  }
}
