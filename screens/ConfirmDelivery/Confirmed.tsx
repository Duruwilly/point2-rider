import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "react-native-paper";

const Confirmed = () => {
  const navigation: any = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Body>
          <View
            style={{
              position: "relative",
              marginTop: 150,
              alignSelf: "center",
            }}
          >
            <SimpleLineIcons name="check" size={60} color="#27ae60" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.successText}>Package Delivered</Text>
          </View>
          <Button
            style={{ borderRadius: 10, padding: 3, marginTop: 30 }}
            labelStyle={{ fontWeight: "bold", flex: 1 }}
            buttonColor={colors.secondary}
            mode="contained"
            textColor={colors.primary}
            onPress={() => {
              navigation.navigate("tab");
            }}
          >
            Go home
          </Button>
        </Layout.Body>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  successText: {
    fontWeight: "700",
    fontSize: 30,
    textAlign: "center",
    marginTop: 10,
  },
  textContainer: {
    alignItems: "center",
  },
});

export default Confirmed;
