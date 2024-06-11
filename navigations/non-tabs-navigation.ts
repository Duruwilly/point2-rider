// import CreateOrder from "../screens/CreateOrder/CreateOrder";
// import DeliveryLocation from "../screens/DeliveryLocation";
// import OrderDetails from "../screens/Activity/OrderDetails";
// import PackageSent from "../screens/OrderFinalScreen";
// import PickupDetails from "../screens/PickupDetails/PickupDetails";
// import Tracking from "../screens/LiveTracking";
// import NotificationDetails from "../screens/Notifications/Notification-details";
// import ChatBox from "../screens/ChatBox";

import NotificationDetails from "screens/Notifications/Notification-details";
import ChatBox from "../screens/ChatBox";
import ConfirmDelivery from "../screens/ConfirmDelivery";
import Confirmed from "../screens/ConfirmDelivery/Confirmed";
import Deliveries from "../screens/Deliveries";
import OrderDetails from "../screens/Home/components/OrderDetails";
import BankAddedSuccessfully from "../screens/Profile/components/BankAddedSuccessfully";
import Tracking from "../screens/Tracking";

interface routeInterface {
  name: string;
  component: React.FC;
  options?: {
    title?: string;
    headerShown?: boolean;
    headerShadowVisible?: boolean;
    headerStyle?: { backgroundColor: string };
  };
}

export const nonTabsNavigation: Array<routeInterface> = [
  {
    name: "order-details",
    component: OrderDetails,
    options: {
      headerShown: false,
    },
  },
  {
    name: "tracking",
    component: Tracking,
    options: {
      headerShown: false,
    },
  },
  {
    name: "view-notification-details",
    component: NotificationDetails,
    options: {
      headerShown: false,
    },
  },
  {
    name: "chat-box",
    component: ChatBox,
    options: {
      headerShown: false,
    },
  },
  {
    name: "confirm-delivery",
    component: ConfirmDelivery,
    options: {
      headerShown: false,
    },
  },
  {
    name: "confirmed",
    component: Confirmed,
    options: {
      headerShown: false,
    },
  },
  {
    name: "bank-added-successfully",
    component: BankAddedSuccessfully,
    options: {
      headerShown: false,
    },
  },
];
