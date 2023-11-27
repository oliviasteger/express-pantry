import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { ExpiringItem, Friend, Post, User, WebSession } from "./app";
import { ExpiringItemDoc, ExpiringItemStatus } from "./concepts/expiringitem";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc, UserType } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

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

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string, type: UserType) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password, type);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
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

  @Router.get("/users/:username/items")
  async getOrderableBarcodesAndQuantities(username: string) {
    // View all orderable items for a given pantry
    const administrator = await User.getUserByUsername(username);
    await User.isAdministrator(administrator._id);

    const items = await ExpiringItem.getExpiringItems({ administrator: administrator, status: "Claimable" });
    const barcodesToQuantities: { [key: string]: number } = {};

    for (const item in items) {
      if (item in barcodesToQuantities) {
        barcodesToQuantities[item] += 1;
      } else {
        barcodesToQuantities[item] = 1;
      }
    }

    return barcodesToQuantities;
  }

  @Router.get("/items")
  async getItems(session: WebSessionDoc) {
    // View all items in pantry inventory
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);

    return await ExpiringItem.getExpiringItems({ administrator: user });
  }

  @Router.post("/items")
  async createItem(session: WebSessionDoc, barcode: string, dropDate: string, expirationDate: string, status: ExpiringItemStatus) {
    // Create a pantry item
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);

    return await ExpiringItem.create(user, barcode, new Date(dropDate), new Date(expirationDate), status);
  }

  @Router.patch("/items/:id")
  async updateItem(session: WebSessionDoc, id: ObjectId, update: Partial<ExpiringItemDoc>) {
    // Update a pantry item
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);
    await ExpiringItem.isAdministrator(user, id);
    return await ExpiringItem.update(id, update);

    // TODO: update any corresponding orders
  }

  @Router.delete("/items/:id")
  async deleteItem(session: WebSessionDoc, id: ObjectId) {
    // Delete a pantry item
    const user = WebSession.getUser(session);
    await User.isAdministrator(user);
    await ExpiringItem.isAdministrator(user, id);
    return await ExpiringItem.delete(id);

    // TODO: update any corresponding orders
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }
}

export default getExpressRouter(new Routes());
