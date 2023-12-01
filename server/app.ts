import ExpiringItemConcept from "./concepts/expiringitem";
import FriendConcept from "./concepts/friend";
import OrderConcept from "./concepts/order";
import PostConcept from "./concepts/post";
import ProfileConcept from "./concepts/profile";
import RequestConcept from "./concepts/request";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const ExpiringItem = new ExpiringItemConcept();
export const Profile = new ProfileConcept();
export const Request = new RequestConcept();
export const Order = new OrderConcept();
