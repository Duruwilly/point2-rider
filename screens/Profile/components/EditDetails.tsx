import React, { Dispatch, SetStateAction, useState } from "react";
import Layout from "../../../layouts/layout";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { CountryPicker } from "react-native-country-codes-picker";
import { Input } from "../../../components/common/input";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { ApiRequest } from "../../../services/ApiNetwork";
import { useFetchUser } from "../../../services/fetchUser";

const EditDetails = ({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<number>>;
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { request } = ApiRequest();
  const { fetchUser } = useFetchUser();
  const [userInput, setUserInput] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("" || "+234");

  const handleSubmit = async () => {
    // setPages(0);
    try {
      const resp = await request("POST", {
        url: "/profile/edit-details",
        payload: userInput,
      });
      if (resp.status === "success") {
        alert(resp.data.message);
        fetchUser();
      }
    } catch (error) {
      console.log("error editing user", error);
    }
  };

  return (
    <>
      <Layout>
        <Layout.Header back={() => setPages(0)} />
        <Text style={[styles.headerText, { padding: 20 }]}>Edit Details</Text>
        <Layout.ScrollView>
          <KeyboardAvoidingView style={{}}>
            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>First Name</Text>
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
                <Text style={styles.labelContent}>First Name</Text>
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
                <Text style={styles.labelContent}>Phone number</Text>
              </View>
              <Input
                disabled
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

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Email Address</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                disabled
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
              style={{ borderRadius: 10, padding: 3, marginTop: 30 }}
              labelStyle={{ fontWeight: "bold", flex: 1 }}
              buttonColor={colors.primary}
              mode="contained"
              textColor="white"
              onPress={handleSubmit}
            >
              Save Changes
            </Button>
          </KeyboardAvoidingView>
        </Layout.ScrollView>
      </Layout>

      <CountryPicker
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
        lang="en"
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    //   textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 32,
  },
  inputContainer: {
    position: "relative",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 12,
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
  label: {
    fontSize: 14,
    color: "#101828",
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    height: 48,
    width: "100%",
    fontSize: 16,
    fontWeight: "400",
    color: "#344054",
    paddingLeft: 20,
  },
  phoneInput: {
    paddingLeft: 87,
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
    fontSize: 16,
    color: "#101828",
    fontWeight: "400",
    marginRight: 4,
  },
  emailInput: {
    paddingLeft: 56,
  },
  emailIconContainer: {
    position: "absolute",
    bottom: 13,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 48,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#0077B6",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default EditDetails;
