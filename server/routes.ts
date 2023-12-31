import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import assert from "assert";
import { ExpiringItem, Order, Profile, Request, User, WebSession } from "./app";
import { NotAllowedError } from "./concepts/errors";
import { ExpiringItemDoc, ExpiringItemStatus } from "./concepts/expiringitem";
import { OrderStatus } from "./concepts/order";
import { ProfileDoc } from "./concepts/profile";
import { RequestDoc } from "./concepts/request";
import { UserDoc, UserDocUnparsed, UserType } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";

async function getAvailableTimes(profileId: string | ObjectId) {
  const profile = await Profile.getProfileById(new ObjectId(profileId));
  const availableTimes = new Map<string, number>();

  for (let day = 0; day < 7; day++) {
    for (let hour = profile.openHour; hour < profile.closeHour; hour += 1) {
      for (let minute = 0; minute < 60; minute += profile.pickupWindowLength) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        date.setUTCHours(hour, minute, 0, 0);
        availableTimes.set(date.toISOString(), 0);
      }
    }
  }
  // @ts-expect-error gte ruins type checking
  const profileOrders = await Order.getordersByQuery({ recipient: profile.administrator, pickup: { $gte: new Date() } });

  for (const order of profileOrders) {
    const currentOrdersAtTime = availableTimes.get(order.pickup.toISOString());
    if (currentOrdersAtTime !== undefined) {
      availableTimes.set(order.pickup.toISOString(), currentOrdersAtTime + 1);
      if (currentOrdersAtTime + 1 === profile.ordersPerWindow) {
        availableTimes.delete(order.pickup.toISOString());
      }
    }
  }

  const orderableTimes = availableTimes.keys();
  const parsedOrderableTimes = [];

  for (const time of orderableTimes) {
    parsedOrderableTimes.push(time);
  }

  return parsedOrderableTimes;
}

async function organizePantryItems(pantryAdminId: string | ObjectId) {
  const items = await ExpiringItem.getExpiringItems({ administrator: new ObjectId(pantryAdminId) });

  for (const item of items) {
    const today = new Date();
    const expirationDate = new Date(item.expirationDate);
    const dropDate = new Date(item.dropDate);
    // @ts-expect-error Doesn't understand mongo parsing for array queries
    const applicableOrders = await Order.getordersByQuery({ recipient: new ObjectId(pantryAdminId), items: new ObjectId(item._id) });
    if (dropDate > today) await ExpiringItem.update(item._id, { status: "Unreleased" });
    else if (applicableOrders.length === 0 && expirationDate > today) await ExpiringItem.update(item._id, { status: "Claimable" });
    else if (applicableOrders.length === 0 && expirationDate <= today) await ExpiringItem.update(item._id, { status: "Expired" });
    else if (applicableOrders[0].status !== "picked up" && expirationDate > today) await ExpiringItem.update(item._id, { status: "Ordered" });
    else if (applicableOrders[0].status === "picked up") await ExpiringItem.update(item._id, { status: "Used" });
    else if (expirationDate <= today) {
      if (item.status !== "Used") await ExpiringItem.update(item._id, { status: "Expired" });
      if (applicableOrders.length > 0) {
        assert(applicableOrders.length <= 1, "There should not be more than 1 order taking this item");
        const targetOrder = applicableOrders[0];
        const claimableItems = await ExpiringItem.getExpiringItems({ administrator: new ObjectId(pantryAdminId), barcode: item.barcode, status: "Claimable" });
        if (claimableItems.length > 0) {
          claimableItems.sort((i1, i2) => new Date(i1.expirationDate).getTime() - new Date(i2.expirationDate).getTime());
          const chosenItem = claimableItems[0];

          const orderItems = targetOrder.items.filter((itemId) => !new ObjectId(item._id).equals(itemId));
          orderItems.push(chosenItem._id);

          await Promise.all([ExpiringItem.update(chosenItem._id, { status: "Ordered" }), Order.update(targetOrder._id, { items: orderItems })]);
        } else {
          await Order.update(targetOrder._id, { items: targetOrder.items.filter((itemId) => !new ObjectId(item._id).equals(itemId)) });
        }
      }
    } else if (!["Expired", "Used", "Ordered"].includes(item.status) && item.dropDate.getTime() < today.getTime()) await ExpiringItem.update(item._id, { status: "Claimable" });
  }
}

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/id/:_id")
  async getUserById(_id: string) {
    return await User.getUserById(new ObjectId(_id));
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string, type: UserType, information?: string) {
    WebSession.isLoggedOut(session);
    let parsedInfo;
    if (information) parsedInfo = JSON.parse(information);
    return await User.create(username, password, type, parsedInfo);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDocUnparsed>) {
    const user = WebSession.getUser(session);
    let updateParsed: Partial<UserDoc> = {};
    let information: string | undefined = "";
    ({ information, ...updateParsed } = update);
    if (information) updateParsed.information = JSON.parse(information);
    return await User.update(user, updateParsed);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/users/:id/items")
  async getOrderableBarcodesAndQuantities(id: string) {
    // View all orderable items for a given pantry
    const administrator = await User.getUserById(new ObjectId(id));
    await User.isAdministrator(administrator._id);
    await organizePantryItems(administrator._id);

    const items = await ExpiringItem.getExpiringItems({ administrator: administrator._id, status: "Claimable" });
    const barcodesToQuantities: { [key: string]: number } = {};

    for (const item of items) {
      if (item.barcode in barcodesToQuantities) {
        barcodesToQuantities[item.barcode] += 1;
      } else {
        barcodesToQuantities[item.barcode] = 1;
      }
    }

    return barcodesToQuantities;
  }

  @Router.get("/items")
  async getItems(session: WebSessionDoc) {
    // View all items in pantry inventory
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);
    await organizePantryItems(user);

    return await ExpiringItem.getExpiringItems({ administrator: user });
  }

  @Router.post("/items")
  async createItem(session: WebSessionDoc, barcode: string, dropDate: string, expirationDate: string, status: ExpiringItemStatus) {
    // Create a pantry item
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);
    await organizePantryItems(new ObjectId(user));
    return await ExpiringItem.create(user, barcode, new Date(dropDate), new Date(expirationDate), status);
  }

  @Router.get("/items/:id")
  async getItemById(session: WebSessionDoc, id: ObjectId) {
    return await ExpiringItem.getExpiringItems({ _id: id });
  }

  @Router.patch("/items/:id")
  async updateItem(session: WebSessionDoc, id: ObjectId, update: Partial<ExpiringItemDoc>) {
    // Update a pantry item
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);
    await ExpiringItem.isAdministrator(user, id);
    const item = await ExpiringItem.update(id, update);
    // Organizes the orders and handles expirey information
    await organizePantryItems(user);
    return item;
  }

  @Router.delete("/items/:id")
  async deleteItem(session: WebSessionDoc, id: ObjectId) {
    // Delete a pantry item
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);
    await ExpiringItem.isAdministrator(user, id);

    const itemPromise = ExpiringItem.getExpiringItems({ _id: id });
    // @ts-expect-error Though items is an array, if we query it for an individual item mongo processes it as asking if that id is in items.
    const applicableOrders = await Order.getordersByQuery({ recipient: user, items: new ObjectId(id) });
    assert(applicableOrders.length <= 1, "There should not be more than 1 order taking this item");
    if (applicableOrders.length == 1) {
      const targetOrder = applicableOrders[0];
      const item = (await itemPromise)[0];
      const claimableItems = await ExpiringItem.getExpiringItems({ administrator: user, barcode: item.barcode, status: "Claimable" });
      if (claimableItems.length > 0) {
        claimableItems.sort((i1, i2) => i1.expirationDate.getTime() - i2.expirationDate.getTime());
        const chosenItem = claimableItems[0];

        const orderItems = targetOrder.items.filter((itemId) => !new ObjectId(id).equals(itemId));
        orderItems.push(chosenItem._id);
        void ExpiringItem.update(chosenItem._id, { status: "Ordered" });

        void Order.update(targetOrder._id, { items: orderItems });
      } else {
        void Order.update(targetOrder._id, { items: targetOrder.items.filter((itemId) => !new ObjectId(id).equals(itemId)) });
      }
    }
    await organizePantryItems(new ObjectId(user));
    return await ExpiringItem.delete(new ObjectId(id));
  }

  @Router.post("/profiles")
  async createProfile(session: WebSessionDoc, location: string, name: string, openHour: string, closeHour: string, pickupWindowLength: string, ordersPerWindow: string, rules?: string) {
    const user = WebSession.getUser(session);
    return await Profile.create(user, location, name, parseInt(openHour), parseInt(closeHour), parseInt(pickupWindowLength), parseInt(ordersPerWindow), rules && JSON.parse(rules));
  }

  @Router.get("/profiles/currentUser")
  async getProfileByCurrentUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const profiles = await Profile.getProfilesByQuery({ administrator: new ObjectId(user) });
    assert(profiles.length > 0, "Given user either has no profiles associated with them");
    return profiles[0];
  }

  @Router.get("/profiles/id/:_id")
  async getProfileById(_id: string) {
    return await Profile.getProfileById(new ObjectId(_id));
  }

  @Router.get("/profiles/location/:location")
  async getProfilesByLocation(location: string) {
    return await Profile.getProfilesByQuery({ location: location });
  }

  @Router.get("/profiles/admin/:administrator")
  async getProfilesByAdmin(administrator: string) {
    return await Profile.getProfilesByQuery({ administrator: new ObjectId(administrator) });
  }

  @Router.get("/profiles")
  async getProfiles(searchQuery: string) {
    return await Profile.getProfilesByQuery(JSON.parse(searchQuery));
  }

  @Router.patch("/profiles")
  async updateProfile(session: WebSessionDoc, _id: string, update: Partial<ProfileDoc>) {
    const user = WebSession.getUser(session);
    // @ts-expect-error thinks field is int
    if (update.openHour) update.openHour = parseInt(update.openHour);
    // @ts-expect-error thinks field is int
    if (update.closeHour) update.closeHour = parseInt(update.closeHour);
    // @ts-expect-error thinks field is int
    if (update.pickupWindowLength) update.pickupWindowLength = parseInt(update.pickupWindowLength);
    // @ts-expect-error thinks field is int
    if (update.ordersPerWindow) update.ordersPerWindow = parseInt(update.ordersPerWindow);
    await Profile.assertAdministrator(user, new ObjectId(_id));
    return await Profile.update(new ObjectId(_id), update);
  }

  @Router.delete("/profiles/:_id")
  async deleteProfile(session: WebSessionDoc, _id: string) {
    const user = WebSession.getUser(session);
    await Profile.assertAdministrator(user, new ObjectId(_id));
    return await Profile.delete(new ObjectId(_id));
  }

  @Router.get("/profiles/eligibility/:profileId/:username")
  async isEligible(profileId: ObjectId, username: string) {
    const user = await User.getUserByUsername(username);
    await Profile.isEligible(profileId, user);
    return { msg: "User is eligible" };
  }

  @Router.get("/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const userType = (await User.getUserById(user)).type;

    if (userType == "Client") {
      return await Request.getRequests({ requester: user });
    } else {
      return await Request.getRequests({ requestee: user });
    }
  }

  @Router.post("/requests")
  async createRequest(session: WebSessionDoc, barcode: string, requestee: ObjectId) {
    const user = WebSession.getUser(session);
    const userObject = await User.getUserById(user);

    if (userObject.type == "Administrator") throw new NotAllowedError(`Only pantry clients can create requests.`);

    // Check that user is eligible to access the pantry
    const requesteeProfile = (await Profile.getProfilesByQuery({ administrator: new ObjectId(requestee) }))[0]._id;
    await Profile.assertEligible(requesteeProfile, userObject);

    // Check that the item is out of stock
    const items = await ExpiringItem.getExpiringItems({ administrator: requestee, barcode, status: "Claimable" });
    if (items.length !== 0) throw new NotAllowedError(`Requests can only be made for items that are out of stock.`);

    return await Request.create(barcode, user, new ObjectId(requestee));
  }

  @Router.patch("/requests/:_id")
  async updateRequest(session: WebSessionDoc, _id: ObjectId, update: Partial<RequestDoc>) {
    const user = WebSession.getUser(session);
    const userObject = await User.getUserById(user);

    // Only requesters and requestees can update requests
    // Only requesters can update barcode, only requestees can update status
    if (userObject.type == "Administrator") {
      await Request.isRequestee(user, _id);
      if (update.barcode) throw new NotAllowedError(`Only clients can update request barcodes.`);
    } else {
      await Request.isRequester(user, _id);
      if (update.status) throw new NotAllowedError(`Only administrators can update request status.`);
    }

    return await Request.update(_id, update);
  }

  @Router.delete("/requests/:_id")
  async deleteRequest(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const userObject = await User.getUserById(user);

    // Only requesters can delete requests
    if (userObject.type == "Administrator") throw new NotAllowedError(`Only pantry clients can delete requests.`);

    // Can only delete a request that you created
    await Request.isRequester(user, _id);

    return await Request.delete(_id);
  }

  @Router.get("/map")
  async getMapLocations(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const userObject = await User.getUserById(user);

    // Only clients can view maps
    if (userObject.type == "Administrator") throw new NotAllowedError(`Only pantry clients can check eligibility.`);

    const pantries = await Profile.getProfilesByQuery({});
    const eligiblePantries = pantries.filter((pantry) => Profile.isEligible(pantry._id, userObject));

    return eligiblePantries;
  }
  @Router.get("/profiles/:profileId/availableTimes")
  async getAvailableTimes(profileId: string | ObjectId) {
    return getAvailableTimes(profileId);
  }

  @Router.get("/order/:_id")
  async getOrder(_id: string) {
    return await Order.getorderById(new ObjectId(_id));
  }
  @Router.get("/order/user/:userId")
  async getUserOrders(userId: string) {
    return await Order.getordersByQuery({ sender: new ObjectId(userId) });
  }

  @Router.get("/order/admin/:adminId")
  async getAdminOrders(adminId: string) {
    return await Order.getordersByQuery({ recipient: new ObjectId(adminId) });
  }

  @Router.patch("/order/status")
  async updateOrderStatus(session: WebSessionDoc, orderId: string, newStatus: OrderStatus) {
    const userId = WebSession.getUser(session);
    await organizePantryItems(new ObjectId(userId));
    const order = await Order.getorderById(new ObjectId(orderId));
    assert(order.recipient.equals(userId), new NotAllowedError("User lacks permissions to change order status"));

    const oldStatus = order.status;

    if (oldStatus === "picked up" && newStatus !== "picked up") {
      void Promise.all(order.items.map((itemId) => ExpiringItem.update(itemId, { status: "Ordered" })));
    } else if (newStatus === "picked up") {
      void Promise.all(order.items.map((itemId) => ExpiringItem.update(itemId, { status: "Used" })));
    }

    return await Order.update(new ObjectId(orderId), { status: newStatus });
  }

  @Router.delete("/order/:orderId")
  async deleteOrder(orderId: string, session: WebSessionDoc) {
    const userId = WebSession.getUser(session);
    const order = await Order.getorderById(new ObjectId(orderId));

    assert(order.recipient.equals(userId) || order.sender.equals(userId), new NotAllowedError("User lacks permission to delete this order"));
    assert(order.status !== "picked up", new NotAllowedError("Order is already picked up and cannot be deleted."));
    void Promise.all(order.items.map((itemId) => ExpiringItem.update(itemId, { status: "Claimable" })));

    return await Order.delete(new ObjectId(orderId));
  }

  @Router.post("/order")
  async placeOrder(session: WebSessionDoc, profileId: string, pickupTime: string, barcodes: string) {
    const userId = WebSession.getUser(session);
    const user = User.getUserById(new ObjectId(userId));
    await organizePantryItems(new ObjectId(userId));
    const profile = Profile.getProfileById(new ObjectId(profileId));
    const availableTimesPromise = getAvailableTimes(profileId);
    await Profile.assertEligible(new ObjectId(profileId), await user);
    const availableTimes = await availableTimesPromise;
    assert(availableTimes.includes(pickupTime), "Pickup time not available");

    const orderedItems: ExpiringItemDoc[] = [];
    // Type: [[string, number]]
    const barcodesParsed = JSON.parse(barcodes);

    for (const barcodeQuant of barcodesParsed) {
      const availableItems = await ExpiringItem.getExpiringItems({ barcode: barcodeQuant[0], administrator: (await profile).administrator, status: "Claimable" });
      assert(availableItems.length >= barcodeQuant[1], `Not enough ${barcodeQuant[0]} for order`);

      availableItems.sort((i1, i2) => i1.expirationDate.getTime() - i2.expirationDate.getTime());
      orderedItems.push(...availableItems.slice(0, barcodeQuant[1]));
    }
    void Promise.all(orderedItems.map((item) => ExpiringItem.update(item._id, { status: "Ordered" })));

    const order = Order.create(
      new ObjectId(userId),
      (await profile).administrator,
      orderedItems.map((itemDoc) => itemDoc._id),
      new Date(pickupTime),
    );
    return await order;
  }

  @Router.patch("/inventory/")
  async organizeInventory(adminId: string) {
    await organizePantryItems(adminId);
    return { msg: "Pantry organized" };
  }
}

export default getExpressRouter(new Routes());
