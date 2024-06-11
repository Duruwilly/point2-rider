// import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";

export const useCustomFonts = () => {
  let [fontsLoaded] = useFonts({
    black: require("../fonts/Satoshi-Black.otf"),
    bold: require("../fonts/Satoshi-Bold.otf"),
    medium: require("../fonts/Satoshi-Medium.otf"),
    regular: require("../fonts/Satoshi-Regular.otf"),
    light: require("../fonts/Satoshi-Light.otf"),
  });

  return fontsLoaded;
};
