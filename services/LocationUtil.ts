import * as Location from "expo-location";
import { Platform } from "react-native";

export const getUserLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    // Location.watchPositionAsync
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    // For iOS, check and request background permission
    if (Platform.OS === "ios") {
      let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== "granted") {
        throw new Error("Background location access denied");
      }
    }

    // Retrieve user location
    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  } catch (error) {
    throw new Error(`Error getting user location: ${error}`);
  }
};
