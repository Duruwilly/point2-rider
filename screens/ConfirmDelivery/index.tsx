import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ApiRequest } from "../../services/ApiNetwork";

const ConfirmDelivery = ({ route }: any) => {
  const navigation: any = useNavigation();
  const trackingId = route?.params?.trackingId;
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const { request } = ApiRequest();
  const [loading, setLoading] = useState(false);

  const confirmCode = async () => {
    setLoading(true);
    try {
      const resp = await request("POST", {
        url: "/rider/orders/mark-as-delivered",
        payload: { confirmation_code: code, tracking_id: trackingId },
      });
      
      if (resp.status === "success") {
        navigation.navigate("confirmed");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
    // navigation.navigate("confirmed");
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
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
            <Text
              style={{
                color: "#475467",
                fontSize: 15,
                fontWeight: "500",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Enter the unique 4-digit code from the sender to verify recipient
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="enter code here"
              placeholderTextColor="#98A2B3"
              value={code}
              onChangeText={(text) => setCode(text)}
            />
            <TouchableOpacity
              onPress={confirmCode}
              disabled={code === ""}
              style={[styles.button, code === "" && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </Layout.Body>
      </Layout>
    </SafeAreaView>
  );
};

export default ConfirmDelivery;

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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    height: 36,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 14,
    fontWeight: "500",
    borderColor: colors.inputBorder,
    borderWidth: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#003B5B",
    height: 36,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
