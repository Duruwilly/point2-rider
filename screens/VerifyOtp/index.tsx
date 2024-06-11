import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ApiRequest } from "../../services/ApiNetwork";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import { Button } from "react-native-paper";
import OtpInput from "../../components/otp-Input";

const VerifyOtp = ({ route }: any) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [resendOtptimeRemaining, setResendOtpTimeRemaining] = useState(30);

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };
  const { request } = ApiRequest();

  const navigation: any = useNavigation();

  const authRequest = async () => {
    // if (route.params.type === "password") {
    //   navigation.navigate("create-new-password");
    // } else {
    //   navigation.navigate("final-reg", { name: route?.params?.name });
    // }
    if (route.params.type === "password") {
      if (otp.length !== 4) {
        alert("Please enter a 4-digit OTP");
        return;
      }
      setLoading(true);
      try {
        const response = await request("POST", {
          url: "/auth/verify/password/token",
          payload: { verification_token: otp },
        });
        console.log("verify-otp a", response);
        if (response.status === "success") {
          Alert.alert("Success", response.data);
          navigation.navigate("create-new-password");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
      setResendOtpTimeRemaining(30);
    } else {
      if (otp.length !== 4) {
        alert("Please enter a 4-digit OTP");
        return;
      }
      setLoading(true);
      try {
        const response = await request("POST", {
          url: "/auth/verify/token",
          payload: { verification_token: otp },
        });
        console.log("verify-otp b", response);
        if (response.status === "success") {
          Alert.alert("Success", response.data?.data);
          navigation.navigate("final-reg", {name: route?.params?.name});
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
      setResendOtpTimeRemaining(30);
    }
  };

  const resendOtp = async () => {
    const response = await request("POST", {
      url: "/auth/resend/verify/token",
      payload: { email: route?.params?.email },
    });
    if(response.status === "success") {
      alert(response.data.message)
    }
    setResendOtpTimeRemaining(30);
  };

  useEffect(() => {
    if (resendOtptimeRemaining > 0) {
      const intervalId = setInterval(() => {
        setResendOtpTimeRemaining((prevTime: number) => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [resendOtptimeRemaining]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <Layout.Body>
          <Text style={styles.headerText}>
            {route.params.type === "password"
              ? "Verify OTP"
              : "Verify your account"}
          </Text>
          <Text style={styles.accountContainer}>
            <Text style={styles.accountText}>
              Enter the 4-digit code we sent to{" "}
            </Text>
            <Text style={{ fontWeight: "700" }}>{route.params.email}</Text>
          </Text>

          <OtpInput length={4} onChange={handleOtpChange} />

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
            Verify
          </Button>
          {resendOtptimeRemaining == 0 ? (
            <>
              <Text style={{ textAlign: "center" }}>
                Haven't received the code yet?
              </Text>
              <Pressable onPress={resendOtp}>
                <Text
                  style={{
                    color: colors.primary,
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  Tap to resend OTP
                </Text>
              </Pressable>
            </>
          ) : (
            <Text
              style={{
                color: colors.primary,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              Resend code in 0:{resendOtptimeRemaining}
            </Text>
          )}
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
    // flexDirection: "row",
    // alignItems: "center",
    // gap: 1,
    marginBottom: 25,
    flex: 1
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

export default VerifyOtp;
