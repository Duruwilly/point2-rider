// import { lazy, Suspense } from "react";
import CreateNewPassword from "../screens/CreateNewPassWord";
import FinalRegistration from "../screens/FinalRegistration";
import ForgotPassword from "../screens/ForgotPassword";
import Login from "../screens/Login";
import PasswordResetSucess from "../screens/PasswordResetSuccess";
import RegisterOne from "../screens/Register/RegisterOne";
import RegisterTwo from "../screens/Register/RegisterTwo";
import Splash from "../screens/Splash";
import VerifyOtp from "../screens/VerifyOtp";
import Welcome from "../screens/welcome";

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

export const authNavigation: Array<routeInterface> = [
  {
    name: "splash",
    component: Splash,
    options: {
      headerShown: false,
    },
  },
  {
    name: "welcome",
    component: Welcome,
    options: {
      headerShown: false,
    },
  },
  {
    name: "login",
    component: Login,
    options: {
      headerShown: false,
    },
  },
  {
    name: "register",
    component: RegisterOne,
    options: {
      headerShown: false,
    },
  },
  {
    name: "register2",
    component: RegisterTwo,
    options: {
      headerShown: false,
    },
  },
  {
    name: "forgot-password",
    component: ForgotPassword,
    options: {
      headerShown: false,
    },
  },
  {
    name: "verify-otp",
    component: VerifyOtp,
    options: {
      headerShown: false,
    },
  },
  {
    name: "create-new-password",
    component: CreateNewPassword,
    options: {
      headerShown: false,
    },
  },
  {
    name: "password-reset-success",
    component: PasswordResetSucess,
    options: {
      headerShown: false,
    },
  },
  {
    name: "final-reg",
    component: FinalRegistration,
    options: {
      headerShown: false,
    },
  },
];
