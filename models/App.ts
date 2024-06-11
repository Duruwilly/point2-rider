// import { MessageType } from "./Message";
// import { userContacts } from "./UserContact";

import Charges from "./Charges";
import { UserMessages } from "./Message";
import { OrderResponse, Orders } from "./Orders";

export interface AppState {
  orders: Orders[];
  app_version: string,
  errors: string[];
	messages: string[];
  usersMessages: UserMessages[] ,
  orderCharges: Charges,
  orderResponse: OrderResponse,
}
