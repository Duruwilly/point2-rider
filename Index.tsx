import { useCallback, useEffect, useState } from "react";
// import { expo as appName } from './app.json';
import { Alert, Image, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useCustomFonts } from "./constants/fonts-config";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiRequest } from "./services/ApiNetwork";
import * as Updates from "expo-updates";
import {
  clearErrors,
  clearMessages,
  setUserOrders,
} from "./store/reducers/app-reducer";
import {
  setAccessToken,
  setAuthId,
  setExpoPushToken,
  setIsAuthentication,
  setLocation,
  setUser,
} from "./store/reducers/users-reducer";
import { RootState } from "./store/store";
import { configurePushNotifications } from "./services/Notification";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./utils/helpers";
import { authNavigation } from "./navigations/auth-navigation";
import { Tab } from "./navigations/tab-navigation";
import { nonTabsNavigation } from "./navigations/non-tabs-navigation";
import { getUserLocation } from "./services/LocationUtil";
// import { Pusher, PusherEvent } from "@pusher/pusher-websocket-react-native";
import { CLUSTER_NAME, PUSHER_API_KEY } from "./constants/app";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

export default function Index() {
  useCustomFonts();
  const [appIsReady, setAppIsReady] = useState(false);
  const [retry, setRetry] = useState(false);
  const App = useSelector((state: RootState) => state.appReducer);
  const Stack = createNativeStackNavigator();

  const [fetchedUser, setFetchedUser] = useState(false);
  const [accessTokenIsSet, setAccessTokenIsSet] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  // const pusher = Pusher.getInstance();

  const { isAuthenticated, auth_Id, location } = useSelector(
    (state: RootState) => state.user
  );

  type EventName = `message_received${typeof auth_Id}`;

  const dispatch = useDispatch();

  const retryFailedRequest = async () => {
    try {
      // Call the request function again to handle the retry logic for network error
      const response = await request("GET", {
        url: `/profile/details`,
        ignoreError: true,
      });
      if (response.status === "success") {
        dispatch(setUser(response.data.data));
        setFetchedUser(true);
        setRetry(!retry);
      } else {
        setRetry(!retry);
        setFetchedUser(true);
      }
      // Handle the successful retry
    } catch (retryError: any) {}
  };

  const { request } = ApiRequest(retryFailedRequest);

  const fetchUser = useCallback(async () => {
    if (accessTokenIsSet) {
      const response = await request("GET", {
        url: "/profile/details",
      });

      if (response.status === "success") {
        dispatch(setUser(response?.data.data));
        dispatch(setAuthId(response.data.data?.id));
        dispatch(setIsAuthentication(true));
        // dispatch(setAccessToken(response.data.access_token));
        setFetchedUser(true);
      } else {
        // console.log("here");
        setFetchedUser(true);
      }
    }
    // setFetchedUser(true); // remove later if api is provided
  }, [accessTokenIsSet]);

  const fetchOrders = useCallback(async () => {
    if (fetchedUser) {
      const response = await request("GET", {
        url: `/rider/getorders`,
      });
      // console.log("order", response.data.data?.data);

      if (response.status === "success") {
        dispatch(setUserOrders(response?.data?.data?.data));
        setAppIsReady(true);
      }
      setAppIsReady(true);
    }
  }, [fetchedUser, retry]);

  // ask for notification permission
  useEffect(() => {
    (async () => {
      // if (!__DEV__) {
      const response = await configurePushNotifications();
      dispatch(setExpoPushToken(response));
      // }
    })();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      (async () => {
        try {
          const location = await getUserLocation();
          dispatch(setLocation(location));
          // console.log('User location:', location);
        } catch (error) {
          console.error("Error:", error);
        }
      })();
    }
  }, [appIsReady]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    if (appIsReady) {
      hideSplashScreen();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (accessTokenIsSet) {
      fetchUser();
    }
  }, [accessTokenIsSet]);

  useEffect(() => {
    if (fetchedUser) {
      fetchOrders();
    }
  }, [fetchedUser, retry]);

  useEffect(() => {
    AsyncStorage.getItem("access_token").then((data: any) => {
      dispatch(setAccessToken(data ?? ""));
      setAccessTokenIsSet(true);
    });
  }, []);

  useEffect(() => {
    if (App.errors.length > 0) {
      Alert.alert("Error!", App.errors.join("\n"), [
        {
          text: "Close",
          style: "cancel",
          onPress: () => dispatch(clearErrors()),
        },
      ]);
    }
  }, [App.errors]);

  useEffect(() => {
    if (App.messages.length > 0) {
      Alert.alert("VTpass!", App.messages.join("\n"), [
        {
          text: "Close",
          style: "cancel",
          onPress: () => dispatch(clearMessages()),
        },
      ]);
    }
  }, [App.messages]);

  useEffect(() => {
    // Function to check for updates and reload the app
    async function checkForUpdateAndReload() {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.reloadAsync();
        }
      }
    }
    checkForUpdateAndReload();
  }, []);

  useEffect(() => {
    if (!appIsReady) {
      const timer = setTimeout(() => {
        alert("This is taking longer than usual but kindly be patient");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);

  const sendLocationUpdate = async () => {
    // Send location to the backend
    if (location) {
      await request("POST", {
        url: "/rider/update-current-location",
        payload: {
          current_position: [location?.latitude, location?.longitude]
        },
      });
    }
  };

  // Call this function periodically
  useEffect(() => {
    if (appIsReady) {
      const id = setInterval(sendLocationUpdate, 20000);
      setIntervalId(id);

      // Clean up the interval on component unmount or if appIsReady changes
      return () => clearInterval(id);
    } else if (intervalId) {
      // Clear the interval if appIsReady is false and intervalId is set
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [appIsReady, location]);

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Image
          source={require("./assets/images/splashScreen.png")}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer ref={navigationRef as any}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            animation: "slide_from_right",
          }}
        >
          {!isAuthenticated &&
            authNavigation.map((route) => {
              return (
                <Stack.Screen
                  key={route.name}
                  name={route.name}
                  options={route.options}
                  component={route.component}
                />
              );
            })}
          <Stack.Screen
            name="tab"
            options={{ headerShown: false }}
            component={Tab}
          />
          {nonTabsNavigation.map((route) => {
            return (
              <Stack.Screen
                key={route.name}
                name={route.name}
                options={route.options}
                component={route.component}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// AppRegistry.registerComponent(appName.name, () => Index);
