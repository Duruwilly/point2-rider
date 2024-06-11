import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { colors } from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Input } from "../../components/common/input";
import BottomSheet from "../../components/Bottomsheet/Bottomsheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import CustomRadioButton from "../../components/RadioButton/RadioButton";
import { Button } from "react-native-paper";
import {
  setAccessToken,
  setAuthId,
  setUser,
} from "../../store/reducers/users-reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ApiRequest } from "../../services/ApiNetwork";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBanks } from "../../services/fetchBanks";

type UserInputType = {
  id_card: string;
  account_no: string;
  bvn: string;
  bank_code: string;
  nin: string;
  bike_photo: string;
  bike_license: string;
  riders_card: string;
  bike_number: string;
  road_worthiness: string;
  passport: string;
  // bank: string;
  mime: string | undefined;
};

interface BankType {
  code: string;
  name: string;
}

interface BankDetails {
  account_number: string;
  account_name: string;
  bank_id: number;
}

const RegisterTwo = ({ navigation, route }: any) => {
  const { values } = route.params;
  const { fetchBanks, getBankAccountDetails } = getBanks();
  const dispatch = useDispatch();
  const { expoPushtoken } = useSelector((state: RootState) => state.user);
  const { request } = ApiRequest();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<BankType[]>([]);
  const [bankSelected, setBankSelected] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [bankDetails, setBanksDetails] = useState({} as BankDetails);
  const [verifying, setVerifying] = useState(false);
  const [userInput, setUserInput] = useState<UserInputType>({
    id_card: "",
    account_no: "",
    bvn: "",
    bank_code: "",
    nin: "",
    bike_photo: "",
    bike_license: "",
    riders_card: "",
    bike_number: "",
    road_worthiness: "",
    passport: "",
    // bank: "",
    mime: "",
  });

  const bottomSheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ["25%", "70%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  const [radioBtnChecked, setRadioBtnChecked] = useState<number | null>(null);

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const setBottomSheetFn = (item: BankType, index: number) => {
    if (radioBtnChecked !== index) {
      setRadioBtnChecked(index);
      setUserInput({ ...userInput, bank_code: item.code });
      setBankSelected(item.name);
    } else {
      setRadioBtnChecked(null);
      setUserInput({ ...userInput, bank_code: "" });
      setBankSelected("");
    }
  };

  const pickPhoto = async (type: keyof UserInputType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize;
      if (fileSize && fileSize > MAX_FILE_SIZE) {
        alert("File size exceeds the maximum limit of 1 MB");
      } else {
        setUserInput({
          ...userInput,
          [type]: result.assets[0].uri,
          mime: result.assets[0].mimeType,
        });
      }
    }
  };

  const combinedValues = {
    ...values,
    ...userInput,
    device_token: expoPushtoken,
  };

  const authRequest = async () => {
    //   navigation.navigate('verify-otp', {
    //     email: combinedValues?.email,
    //     phone: combinedValues?.phone,
    //     name: combinedValues?.firstname,
    //     type: 'register',
    //   });
    setLoading(true);
    try {
      if (
        !userInput?.id_card?.trim() ||
        !userInput?.account_no?.trim() ||
        !userInput?.bvn?.trim() ||
        !userInput?.bank_code?.trim() ||
        !userInput?.nin?.trim() ||
        !userInput?.bike_photo?.trim() ||
        !userInput?.bike_license?.trim() ||
        !userInput?.riders_card?.trim() ||
        !userInput?.bike_number?.trim() ||
        !userInput?.road_worthiness?.trim() ||
        !userInput?.passport?.trim()
      ) {
        alert("All input fields are required");
        setLoading(false);
      } else {
        let formData = new FormData();
        for (const key in combinedValues) {
          let value: any = combinedValues[key];
          if (
            [
              "bike_photo",
              "bike_license",
              "riders_card",
              "road_worthiness",
              "id_card",
              "passport",
            ].includes(key)
          ) {
            formData.append(key, {
              uri: combinedValues[key],
              type: userInput.mime,
              name: key,
            } as any);
          } else {
            formData.append(key, value);
          }
          // console.log("key:", key, "combinedValue:", combinedValues[key]);
        }

        const response = await request("POST", {
          url: "/auth/rider/register",
          payload: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("registration:", response);

        if (response.status === "success") {
          await AsyncStorage.setItem(
            "access_token",
            response.data.data.access_token
          );
          dispatch(setAccessToken(response.data.data.access_token));
          dispatch(setAuthId(response.data.data.user_data.id));
          dispatch(setUser(response.data.data.user_data));
          navigation.navigate("verify-otp", {
            email: combinedValues?.email,
            phone: combinedValues?.phone,
            name: combinedValues?.firstname,
            type: "register",
          });
          setLoading(false);
        } else {
          // console.log(response.message);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const banks = await fetchBanks(bankSearch);
      setBanks(banks);
    })();
  }, [bankSearch]);

  useEffect(() => {
    if (userInput?.account_no.length === 10 && userInput?.bank_code) {
      (async () => {
        const bankDetails = await getBankAccountDetails(
          userInput?.bank_code,
          userInput?.account_no,
          setVerifying
        );
        setBanksDetails(bankDetails);
      })();
    }
  }, [userInput?.account_no, userInput?.bank_code]);

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
                <Text style={styles.roundedText}>2/2</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Additional Details</Text>
              <Text style={styles.subtitle}>
                Please enter the correct information
              </Text>
            </View>
          </View>
          <KeyboardAvoidingView>
            <View style={{ position: "relative" }}>
              <Text style={styles.topLabelContainer}>IDENTIFICATION</Text>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Valid ID Photo</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => pickPhoto("id_card")}
                style={[
                  styles.uploadButton,
                  userInput?.id_card !== "" && styles.uploadButtonActive,
                ]}
              >
                {userInput?.id_card ? (
                  <View style={styles.uploadedContainer}>
                    <MaterialIcons name="verified" size={32} color="#27AE60" />
                    <Text style={styles.uploadedText}>
                      ID photo successfully uploaded
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.uploadText}>
                    Upload (NIN, Drivers License, Voters Card) (png/jpeg/pdf
                    formats)
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Passport Photograph</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => pickPhoto("passport")}
                style={[
                  styles.uploadButton,
                  userInput?.passport !== "" && styles.uploadButtonActive,
                ]}
              >
                {userInput?.passport ? (
                  <View style={styles.uploadedContainer}>
                    <MaterialIcons name="verified" size={32} color="#27AE60" />
                    <Text style={styles.uploadedText}>
                      Passport photograph successfully uploaded
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.uploadText}>
                    Upload passport photograph (png/jpeg/pdf formats)
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ position: "relative" }}>
              <Text style={[styles.topLabelContainer, { marginTop: 20 }]}>
                Payment Details
              </Text>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Bank Account Number</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Enter account number"
                keyboardType="number-pad"
                value={userInput.account_no}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, account_no: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Bank Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => setOpenBottomSheet(true)}
                style={{
                  borderColor: colors.inputBorder,
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                }}
              >
                <Text style={{ color: "#667085", fontSize: 16 }}>
                  {bankSelected ? bankSelected : "Select bank"}
                </Text>
              </TouchableOpacity>
            </View>
            {verifying && <Text>Verifying...</Text>}

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Bank Account Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Full Name"
                keyboardType="number-pad"
                value={bankDetails?.account_name}
                disabled
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>
                  Bank Verification Number
                </Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Enter BVN"
                keyboardType="number-pad"
                value={userInput.bvn}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, bvn: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>
                  National Identification Number
                </Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Enter NIN"
                keyboardType="number-pad"
                value={userInput.nin}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, nin: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <Text style={[styles.topLabelContainer, { marginTop: 20 }]}>
                BIKE DETAILS
              </Text>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Bike Passport Photo</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => pickPhoto("bike_photo")}
                style={[
                  styles.uploadButton,
                  userInput?.bike_photo !== "" && styles.uploadButtonActive,
                ]}
              >
                {userInput?.bike_photo ? (
                  <View style={styles.uploadedContainer}>
                    <MaterialIcons name="verified" size={32} color="#27AE60" />
                    <Text style={styles.uploadedText}>
                      Bike passport photo successfully uploaded
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.uploadText}>
                    Upload bike passport photo (png/jpeg/pdf formats)
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Bike License</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => pickPhoto("bike_license")}
                style={[
                  styles.uploadButton,
                  userInput?.bike_license !== "" && styles.uploadButtonActive,
                ]}
              >
                {userInput?.bike_license ? (
                  <View style={styles.uploadedContainer}>
                    <MaterialIcons name="verified" size={32} color="#27AE60" />
                    <Text style={styles.uploadedText}>
                      Bike license successfully uploaded
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.uploadText}>
                    Upload bike license (png/jpeg/pdf formats)
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Riders Card</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => pickPhoto("riders_card")}
                style={[
                  styles.uploadButton,
                  userInput?.riders_card !== "" && styles.uploadButtonActive,
                ]}
              >
                {userInput?.riders_card ? (
                  <View style={styles.uploadedContainer}>
                    <MaterialIcons name="verified" size={32} color="#27AE60" />
                    <Text style={styles.uploadedText}>
                      Riders card successfully uploaded
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.uploadText}>
                    Upload riders card (png/jpeg/pdf formats)
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>
                  Bike Registration Number
                </Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Enter bike registration number"
                keyboardType="number-pad"
                value={userInput.bike_number}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, bike_number: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Road Worthiness</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => pickPhoto("road_worthiness")}
                style={[
                  styles.uploadButton,
                  userInput?.road_worthiness !== "" &&
                    styles.uploadButtonActive,
                ]}
              >
                {userInput?.road_worthiness ? (
                  <View style={styles.uploadedContainer}>
                    <MaterialIcons name="verified" size={32} color="#27AE60" />
                    <Text style={styles.uploadedText}>
                      Road worthiness document successfully uploaded
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.uploadText}>
                    Upload road worthiness document (png/jpeg/pdf formats)
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <Button
            style={{ borderRadius: 10, padding: 3 }}
            labelStyle={{
              fontWeight: "bold",
              alignSelf: "center",
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
            }}
            buttonColor={colors.primary}
            mode="contained"
            textColor="white"
            onPress={authRequest}
            disabled={loading}
            loading={loading}
          >
            {loading ? "Please wait..." : "Create your account"}
          </Button>
          <Button
            style={{ borderRadius: 10, padding: 3 }}
            labelStyle={{ fontWeight: "bold", flex: 1 }}
            buttonColor={colors.secondary}
            mode="contained"
            textColor={colors.primary}
            onPress={() => navigation.navigate("register")}
          >
            Go back
          </Button>
        </Layout.ScrollView>
      </Layout>

      {openBottomSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          style={{ padding: 0 }}
          onChange={(index) => {
            if (index === -1 || index === 0) {
              closeBottomSheet();
            }
          }}
        >
          <View style={{ paddingHorizontal: 10, marginVertical: 20 }}>
            <TextInput
              style={styles.textInput}
              placeholder="Search bank"
              placeholderTextColor="#98A2B3"
              value={bankSearch}
              onChangeText={(text) => setBankSearch(text)}
            />
          </View>
          <BottomSheetFlatList
            style={{ marginHorizontal: 10 }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={banks}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setBottomSheetFn(item, index);
                    setOpenBottomSheet(false);
                  }}
                  style={{
                    marginBottom: 5,
                    paddingVertical: 25,
                    paddingHorizontal: 20,
                    backgroundColor: "#f6f6f6",
                    borderWidth: 1,
                    borderColor: "#ededed",
                    borderRadius: 8,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 20,
                    }}
                  >
                    <Text style={{ fontWeight: "400", fontSize: 13, flex: 1 }}>
                      {item.name}
                    </Text>
                    <CustomRadioButton
                      value={index}
                      selected={radioBtnChecked === index}
                      onSelect={() => {
                        setBottomSheetFn(item, index);
                        setOpenBottomSheet(false);
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
            alwaysBounceVertical={false}
          />
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

export default RegisterTwo;

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
    borderWidth: 2,
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
  topLabelContainer: {
    width: "100%",
    fontSize: 12,
    color: "#667085",
    fontFamily: "medium",
    // marginTop: 20,
    marginBottom: 15,
    textTransform: "uppercase",
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
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    height: 154,
    width: "100%",
    fontSize: 16, // base size
    fontFamily: "regular",
  },
  uploadButtonActive: {
    borderColor: "#0077B6",
  },
  uploadedContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 32,
  },
  uploadedText: {
    textAlign: "center",
    color: "#667085",
    fontSize: 14,
    fontFamily: "regular",
    marginTop: 8,
  },
  uploadText: {
    textAlign: "center",
    color: "#667085",
    fontSize: 14,
    fontFamily: "regular",
    paddingTop: 4,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingLeft: 12,
    paddingVertical: 15,
    fontSize: 14,
    fontWeight: "500",
    borderColor: colors.inputBorder,
    borderWidth: 1,
  },
});
