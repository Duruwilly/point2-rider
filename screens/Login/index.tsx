import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layouts/layout";
import { colors } from "../../constants/colors";
import { Input } from "../../components/common/input";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { CountryPicker } from "react-native-country-codes-picker";
import { ApiRequest } from "../../services/ApiNetwork";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAccessToken,
  setAuthId,
  setIsAuthentication,
  setUser,
} from "../../store/reducers/users-reducer";
import { RootState } from "../../store/store";

type InputType = {
  phone: string;
  password: string;
};

const Login = () => {
  const { expoPushtoken } = useSelector((state: RootState) => state.user)
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("" || "+234");
  const [loading, setLoading] = useState(false);
  const { request } = ApiRequest();

  const navigation: any = useNavigation();

  const dispatch = useDispatch();

  const [userInput, setUserInput] = useState({} as InputType);

  const authRequest = async () => {
    try {
      setLoading(true);
      if (!userInput?.phone?.trim() || !userInput?.password?.trim()) {
        alert("All input fields are required");
      } else {
        const response = await request("POST", {
          url: "/auth/login",
          payload: { ...userInput,  device_token: expoPushtoken },
        });

        if (response.status === "success") {
          await AsyncStorage.setItem(
            "riders_access_token",
            response.data.data.access_token
          );
          dispatch(setAccessToken(response?.data?.data.access_token));
          dispatch(setAuthId(response.data.data.user_data?.id));
          dispatch(setUser(response.data.data.user_data));
          dispatch(setIsAuthentication(true));
          setUserInput(() => ({
            password: "",
            phone: "",
          }));
          setLoading(false);
          // if(response.data.data.user_data.type === "USER") {
          // }
          navigation.navigate("tab");
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      await AsyncStorage.removeItem("riders_access_token");
      console.error("API Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Body>
          <Text style={styles.headerText}>Login</Text>
          <View style={styles.accountContainer}>
            <Text style={styles.accountText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("register")}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={{ position: "relative" }}>
            <View style={styles.phoneNumberLabelContainer}>
              <Text style={styles.phoneNumberLabel}>Phone number</Text>
            </View>
            <Input
              placeholder="90 0000 0000"
              value={userInput.phone}
              state={(text: string) =>
                setUserInput((state) => ({ ...state, phone: text }))
              }
              style={styles.inputField}
              keyboard="number-pad"
            />
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={styles.countryCodeContainer}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <SimpleLineIcons name="arrow-down" size={12} color="#667085" />
            </TouchableOpacity>
          </View>

          <View style={{ position: "relative" }}>
            <View style={styles.phoneNumberLabelContainer}>
              <Text style={styles.phoneNumberLabel}>Password</Text>
            </View>
            <Input
              isPassword={true}
              placeholder="********"
              value={userInput.password}
              state={(text: string) =>
                setUserInput((state) => ({ ...state, password: text }))
              }
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
            Login
          </Button>
          <Pressable
            onPress={() => navigation.navigate("forgot-password")}
            // onPress={() => navigation.navigate("tab")}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#344054",
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              Forgot Password
            </Text>
          </Pressable>
        </Layout.Body>
      </Layout>

      <CountryPicker
        lang="en"
        onBackdropPress={() => setShow(false)}
        style={{
          modal: {
            height: 500,
          },
        }}
        show={show}
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
      />
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
  },
  phoneNumberLabel: {
    fontWeight: "bold",
  },
  inputField: {
    paddingLeft: 60,
  },
  countryCodeContainer: {
    position: "absolute",
    top: 42,
    left: 16,
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

export default Login;
