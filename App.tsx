import "react-native-reanimated"

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Index from "./Index";

export default function App() {
  // if (!__DEV__) {
  //   const inAppUpdates = new SpInAppUpdates(
  //     false // isDebug
  //   );
  //   inAppUpdates.checkNeedsUpdate().then((result) => {
  //     if (result.shouldUpdate) {
  //       let updateOptions: StartUpdateOptions = {};
  //       if (Platform.OS === "android") {
  //         // android only, on iOS the user will be prompted to go to your app store page
  //         updateOptions = {
  //           updateType: IAUUpdateKind.IMMEDIATE,
  //         };
  //       }
  //       inAppUpdates.startUpdate(updateOptions);
  //     }
  //   });
  // }

  return (
    <>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
            <Index />
        </Provider>
      </GestureHandlerRootView>
    </>
  );
}
