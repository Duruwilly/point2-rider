import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Layout from "../../layouts/layout";
import { colors } from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "../../components/common/input";
import { ApiRequest } from "../../services/ApiNetwork";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

type InputType = {
  password: string;
  password_confirmation: string;
};

const CreateNewPassword = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const { request } = ApiRequest();

  const [userInput, setUserInput] = useState({} as InputType);

  const [validations, setValidations] = useState({
    length: false,
    number: false,
    uppercaseLowercase: false,
  });

  useEffect(() => {
    validatePassword(userInput.password || "");
  }, [userInput.password]);

  const validatePassword = (password: string) => {
    const length = password.length >= 8;
    const number = /\d/.test(password);
    const uppercaseLowercase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    setValidations({
      length,
      number,
      uppercaseLowercase,
    });
  };

  const authRequest = async () => {
    // navigation.navigate("password-reset-success");
    try {
      setLoading(true);
      if (
        !userInput?.password?.trim() ||
        !userInput?.password_confirmation?.trim()
      ) {
        alert("All input fields are required");
      } else if (userInput?.password !== userInput?.password_confirmation) {
        alert("password must be the same with the confirmation password");
      } else {
        const response = await request("POST", {
          url: "/auth/forget/password/change",
          payload: { ...userInput },
        });
        console.log(response);

        if (response.status === "success") {
          setUserInput(() => ({
            password: "",
            password_confirmation: "",
          }));
          setLoading(false);
          navigation.navigate("password-reset-success");
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <Layout.ScrollView>
          <Text style={styles.headerText}>Create New Password</Text>
          <View style={styles.accountContainer}>
            <Text style={styles.accountText}>
              Please enter new password to continue
            </Text>
          </View>

          <View style={{ position: "relative" }}>
            <View style={styles.phoneNumberLabelContainer}>
              <Text style={styles.phoneNumberLabel}>Password</Text>
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

          <View style={{ position: "relative" }}>
            <View style={styles.phoneNumberLabelContainer}>
              <Text style={styles.phoneNumberLabel}>Confirm Password</Text>
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

          <View style={styles.checklist}>
            <ChecklistItem
              label="At least 8 characters"
              isValid={validations.length}
            />
            <ChecklistItem
              label="At least 1 number"
              isValid={validations.number}
            />
            <ChecklistItem
              label="Both Uppercase and Lowercase letters"
              isValid={validations.uppercaseLowercase}
            />
          </View>

          <Button
            style={{ borderRadius: 10, padding: 3, marginTop: 40 }}
            labelStyle={{ fontWeight: "bold", flex: 1 }}
            buttonColor={colors.primary}
            mode="contained"
            textColor="white"
            onPress={authRequest}
            loading={loading}
            disabled={loading}
          >
            Reset Password
          </Button>
        </Layout.ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

interface ChecklistItemProps {
    label: string;
    isValid: boolean;
  }
  
  const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, isValid }) => {
    return (
      <View style={styles.checklistItem}>
        <Ionicons
          name={isValid ? 'checkmark-circle-outline' : 'close-circle-outline'}
          size={20}
          color={isValid ? 'green' : 'red'}
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: isValid ? 'green' : 'red', fontWeight: "600" }}>{label}</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
  accountContainer: {
    //   flexDirection: "row",
    //   alignItems: "center",
    //   gap: 1,
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
  checklist: {
    marginTop: 20,
  },
  checklistTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

});

export default CreateNewPassword;
