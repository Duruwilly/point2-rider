import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ApiRequest } from "../../services/ApiNetwork";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { colors } from "../../constants/colors";
import { Input } from "../../components/common/input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

type InputType = {
  email: string;
};

const ForgotPassword = () => {
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("" || "+234");
  const [loading, setLoading] = useState(false);
  const { request } = ApiRequest();

  const navigation: any = useNavigation();

  const dispatch = useDispatch();

  const [userInput, setUserInput] = useState({} as InputType);

  const authRequest = async () => {
    setLoading(true);
    if (!userInput.email.trim()) {
      alert("All input fields are required");
    } else {
      try {
        const response = await request("POST", {
          url: "/auth/forget/password",
          payload: { ...userInput },
        });
        console.log(response);

        if (response.status === "success") {
          setUserInput(() => ({
            email: "",
          }));
          setLoading(false);
          alert(response.data.message);
          navigation.navigate("verify-otp", {
            email: userInput.email,
            type: "password",
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    }
    // navigation.navigate("verify-otp", {email: userInput.email, type: "password"})
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <Layout.Body>
          <Text style={styles.headerText}>Forgot Password</Text>
          <View style={styles.accountContainer}>
            <Text style={styles.accountText}>
              Please enter the email address you registered and we'll send a SMS
              to with code to reset your password
            </Text>
          </View>

          <View style={{ position: "relative" }}>
            <View style={styles.phoneNumberLabelContainer}>
              <Text style={styles.phoneNumberLabel}>Email Address</Text>
              <Text style={{ color: colors.primary }}>*</Text>
            </View>
            <Input
              hasIcon={true}
              Icon={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="#667085"
                />
              }
              placeholder="example@gmail.com"
              value={userInput.email}
              state={(text: string) =>
                setUserInput((state) => ({ ...state, email: text }))
              }
              style={{ }}
              keyboard="email-address"
            />
          </View>

          <Button
            style={{ borderRadius: 10, padding: 3 }}
            labelStyle={{ fontWeight: "bold", flex: 1 }}
            buttonColor={colors.primary}
            mode="contained"
            textColor="white"
            onPress={authRequest}
            disabled={loading}
            loading={loading}
          >
            Send Code
          </Button>
        </Layout.Body>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 25,
  },
  accountText: {
    color: "#475467",
    fontSize: 15,
    fontWeight: "500",
  },
  registerText: {
    color: "#0077B6",
    fontSize: 15,
    fontWeight: "500",
  },
  phoneNumberLabelContainer: {
    marginBottom: 7,
    flexDirection: "row",
  },
  phoneNumberLabel: {
    fontWeight: "bold",
  },
  inputField: {
    paddingLeft: 60,
  },
  countryCodeContainer: {
    position: "absolute",
    top: 40,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  countryCodeText: {
    color: "#101828",
    fontSize: 16,
    marginRight: 1,
  },
});

export default ForgotPassword;
