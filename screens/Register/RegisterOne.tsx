import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import { Input } from "../../components/common/input";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { CountryPicker } from "react-native-country-codes-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Calendar from "../../assets/icon/calendar.svg";
import ModalComp from "../../components/Modal/ModalComp";

type InputType = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  address: string;
  next_of_kin_full_name: string;
  next_of_kin_phone_no: string;
};

const RegisterOne = () => {
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("" || "+234");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEmail, setIsEmail] = useState(false);

  const navigation: any = useNavigation();

  const [userInput, setUserInput] = useState({} as InputType);

  const isIos = Platform.OS === "ios";

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  let formatted = date?.toISOString()?.split("T")[0];

  const dob = { dob: date === null ? "" : formatted };

  const handleSubmit = () => {
    const combinedData = { ...userInput, ...dob };

    if (
      !userInput?.phone?.trim() ||
      !userInput?.password?.trim() ||
      !userInput?.email?.trim() ||
      !userInput?.first_name?.trim() ||
      !userInput?.last_name?.trim() ||
      !userInput?.password_confirmation?.trim() ||
      !userInput?.address?.trim()
    ) {
      alert("All input fields are required");
    } else if (userInput?.password !== userInput?.password_confirmation) {
      alert("password must be the same with the confirmation password");
    } else {
      navigation.navigate("register2", { values: combinedData });
    }
    // navigation.navigate("register2", { values: combinedData }); // REMOVE THIS LATER
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.ScrollView>
          <Text style={styles.headerText}>Create your account</Text>
          <View style={styles.accountContainer}>
            <Text style={styles.accountText}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text style={styles.registerText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.completioncontainer}>
            <View style={styles.borderCompletionContainer}>
              <View style={styles.roundedContainer}>
                <Text style={styles.roundedText}>1/2</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Personal Details</Text>
              <Text style={styles.subtitle}>
                Please enter the correct information
              </Text>
            </View>
          </View>

          <KeyboardAvoidingView>
            <View style={{ position: "relative" }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>First Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="First Name"
                value={userInput.first_name}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, first_name: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Last Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Last Name"
                value={userInput.last_name}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, last_name: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Email address</Text>
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
                placeholder="Enter email"
                value={userInput.email}
                state={(text: string) => {
                  setUserInput((state) => ({ ...state, email: text }));
                  const emailRegex = /\S+@\S+\.\S+/;
                  if (emailRegex.test(text)) {
                    setIsEmail(true);
                  } else {
                    setIsEmail(false);
                  }
                }}
                style={{}}
                keyboard="email-address"
              />
            </View>

            {/* {isEmail && ( */}
              <View style={{ position: "relative", marginTop: 20 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelContent}>Phone number</Text>
                  <Text style={{ color: colors.primary }}>*</Text>
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
                  <SimpleLineIcons
                    name="arrow-down"
                    size={12}
                    color="#667085"
                  />
                </TouchableOpacity>
              </View>
            {/* )} */}

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>House Address</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="House Address"
                value={userInput.address}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, address: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Date of birth</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                  borderWidth: 1,
                  borderRadius: 8,
                  height: 48,
                  borderColor: date === null ? "#D0D5DD" : "#0077B6",
                }}
                onPress={showDatepicker}
              >
                <Text
                  style={{
                    color: date ? "#344054" : "#667085",
                    flex: 1,
                    paddingLeft: 15,
                  }}
                >
                  {date ? date?.toLocaleDateString() : "Select date of birth"}
                </Text>
                <View style={{ marginRight: 16 }}>
                  <Calendar width={20} height={20} />
                </View>
              </Pressable>
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Password</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                isPassword={true}
                placeholder="YUr123@"
                value={userInput.password}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, password: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Confirm Password</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                isPassword={true}
                placeholder="YUr123@"
                value={userInput.password_confirmation}
                state={(text: string) =>
                  setUserInput((state) => ({
                    ...state,
                    password_confirmation: text,
                  }))
                }
              />
            </View>

            <Text style={{ fontSize: 12, color: "#667085", marginTop: 30 }}>
              NEXT OF KIN
            </Text>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Full Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Full Name"
                value={userInput.next_of_kin_full_name}
                state={(text: string) =>
                  setUserInput((state) => ({
                    ...state,
                    next_of_kin_full_name: text,
                  }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Phone Number</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                keyboard="number-pad"
                placeholder="Phone Number"
                value={userInput.next_of_kin_phone_no}
                state={(text: string) =>
                  setUserInput((state) => ({
                    ...state,
                    next_of_kin_phone_no: text,
                  }))
                }
              />
            </View>

            <Button
              style={{ borderRadius: 10, padding: 3, marginTop: 40 }}
              labelStyle={{ fontWeight: "bold", flex: 1 }}
              buttonColor={colors.primary}
              mode="contained"
              textColor="white"
              onPress={handleSubmit}
            >
              Continue
            </Button>
          </KeyboardAvoidingView>
        </Layout.ScrollView>
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

      {/* date picker */}
      {showDatePicker && (
        <>
          {isIos ? (
            <ModalComp
              visible={showDatePicker}
              onClose={() => setShowDatePicker(!showDatePicker)}
            >
              <View style={{ marginTop: 25 }}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date || new Date()}
                  mode="date"
                  display="inline"
                  // is24Hour={true}
                  onChange={handleDateChange}
                />
              </View>
            </ModalComp>
          ) : (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              mode="date"
              is24Hour={true}
              onChange={handleDateChange}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
  completioncontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  borderCompletionContainer: {
    borderLeftWidth: 2,
    borderColor: "#0077B6",
    borderRadius: 9999,
  },
  roundedContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: "#0077B6",
    height: 56,
    width: 56,
    backgroundColor: "#EBF8FF",
    borderRadius: 28,
  },
  roundedText: {
    fontSize: 16,
    color: "#1D2939",
    fontFamily: "medium",
  },
  textContainer: {
    alignItems: "flex-start",
    marginLeft: 20,
  },
  title: {
    fontSize: 16,
    color: "#1D2939",
    fontFamily: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "regular",
  },
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 20,
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
  labelContainer: {
    marginBottom: 7,
    flexDirection: "row",
  },
  labelContent: {
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

export default RegisterOne;
