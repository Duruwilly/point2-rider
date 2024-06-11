import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Layout from "../../../layouts/layout";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../constants/colors";
import { Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import Bank from "../../../assets/icon/bank.svg";
import Delete from "../../../assets/icon/delete.svg";
import { Button } from "react-native-paper";
import BottomSheet from "../../../components/Bottomsheet/Bottomsheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import CustomRadioButton from "../../../components/RadioButton/RadioButton";
import { Input } from "../../../components/common/input";
import { ApiRequest } from "../../../services/ApiNetwork";
import { useNavigation } from "@react-navigation/native";
import { getBanks } from "../../../services/fetchBanks";

interface BankType {
  code: string;
  name: string;
}

interface BankDetails {
  account_number: string;
  account_name: string;
  bank_id: number;
}

const ManageCards = ({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<number>>;
}) => {
  const [addCard, setAddCard] = useState(false);
  const { request } = ApiRequest();
  const { fetchBanks, getBankAccountDetails } = getBanks();

  const bottomSheetRef: any = useRef(null);
  const snapPoints = useMemo(() => ["25%", "70%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetToOpen, setBottomSheetToOpen] = useState("");
  const [radioBtnChecked, setRadioBtnChecked] = useState<number | null>(null);
  const navigation: any = useNavigation();
  const [banks, setBanks] = useState<BankType[]>([]);
  const [bankSelected, setBankSelected] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [bankDetails, setBanksDetails] = useState({} as BankDetails);

  const [userInput, setUserInput] = useState({
    name: "",
    bank_code: "",
    account_no: "",
  });

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const setBottomSheetFn = (item: BankType, index: number) => {
    if (radioBtnChecked !== index) {
      setRadioBtnChecked(index);
      // setUserInput({ ...userInput, bank: item });
      setUserInput({ ...userInput, bank_code: item.code });
      setBankSelected(item.name);
    } else {
      setRadioBtnChecked(null);
      // setUserInput({ ...userInput, bank: item });
      setUserInput({ ...userInput, bank_code: "" });
      setBankSelected("");
    }
  };

  const handleAddCard = async () => {
    try {
      const resp = await request("POST", {
        url: "",
        payload: { ...userInput },
      });
      if (resp.status === "success") {
        navigation.navigate("bank-added-successfully", {
          number: userInput.account_no,
        });
        // recall the function that fetches the bank details here
      }
    } catch (error) {}
    // navigation.navigate("bank-added-successfully", { number: "1234567789" });
  };

  // useEffect(() => {
  //   (async () => {
  //     const banks = await fetchBanks(bankSearch);
  //     setBanks(banks);
  //   })();
  // }, [bankSearch]);

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
    <Layout>
      <Layout.Header back={() => setPages(0)} />
      <Text style={[styles.headerText, { padding: 20 }]}>Bank Account</Text>
      <Layout.ScrollView>
        <View style={styles.container}>
          <View style={styles.cardInfoContainer}>
            <View style={styles.cardDetailsContainer}>
              <View style={styles.cardIconContainer}>
                <Bank />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTypeText}>Samuel Ajayi</Text>
                <Text style={styles.cardNumberText}>
                  Firstbank of Nigeria (7160)
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setOpenBottomSheet(true);
                setBottomSheetToOpen("first");
              }}
              style={styles.deleteButton}
            >
              <Text style={{ color: "#EB5757" }}>Delete</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setAddCard(!addCard)}
            style={styles.cardInfoContainer}
          >
            <View style={styles.cardDetailsContainer}>
              <View style={styles.cardIconContainer}>
                <Entypo name="plus" size={24} color={colors.primary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTypeText}>New Account</Text>
              </View>
            </View>
            {!addCard ? (
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            ) : (
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="black"
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10 }}>
          {addCard && (
            <KeyboardAvoidingView
              style={{ backgroundColor: "#F9FAFB", padding: 20 }}
            >
              <View style={{ position: "relative" }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelContent}>Bank Account Number</Text>
                  <Text style={{ color: colors.primary }}>*</Text>
                </View>
                <Input
                  placeholder="3265 5956 23**"
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
                  onPress={() => {
                    setOpenBottomSheet(true);
                    setBottomSheetToOpen("second");
                  }}
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
                  <View style={styles.selectionIcon}>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {verifying && <Text>Verifying...</Text>}

              <View style={{ position: "relative", marginTop: 20 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelContent}>Bank Account Name</Text>
                  <Text style={{ color: colors.primary }}>*</Text>
                </View>
                <Input
                  disabled
                  placeholder="Full Name"
                  value={bankDetails?.account_name}
                />
              </View>

              <Button
                style={{ borderRadius: 10, padding: 3, marginTop: 30 }}
                labelStyle={{ fontWeight: "bold", flex: 1 }}
                buttonColor={colors.primary}
                mode="contained"
                textColor="white"
                onPress={handleAddCard}
              >
                Continue
              </Button>
            </KeyboardAvoidingView>
          )}
        </View>
      </Layout.ScrollView>

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
          {bottomSheetToOpen === "first" ? (
            <View style={{ paddingHorizontal: 20 }}>
              <View style={[styles.deleteIconBtn, { alignSelf: "center" }]}>
                <Delete />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 17,
                  marginTop: 8,
                }}
              >
                Confirm Delete
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <Button
                  style={{
                    borderRadius: 10,
                    padding: 3,
                    marginTop: 30,
                    flex: 1,
                  }}
                  labelStyle={{ fontWeight: "bold", flex: 1 }}
                  buttonColor="#EB5757"
                  mode="contained"
                  textColor="white"
                  //   onPress={() => setAddCard(true)}
                >
                  Yes, delete
                </Button>
                <Button
                  style={{
                    borderRadius: 10,
                    padding: 3,
                    marginTop: 30,
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#D0D5DD",
                  }}
                  labelStyle={{ fontWeight: "bold", flex: 1 }}
                  buttonColor="#F9FAFB"
                  mode="contained"
                  textColor="black"
                  onPress={() => setOpenBottomSheet(false)}
                >
                  Go back
                </Button>
              </View>
            </View>
          ) : (
            <>
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
                        paddingHorizontal: 15,
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
                        <Text
                          style={{ fontWeight: "400", fontSize: 13, flex: 1 }}
                        >
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
            </>
          )}
        </BottomSheet>
      )}
    </Layout>
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
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
    // width: "100%",
    // marginTop: 48,
    // paddingHorizontal: 20,
  },
  cardsText: {
    fontSize: 12,
    color: "#475467",
    fontWeight: "500",
  },
  cardInfoContainer: {
    flexDirection: "row",
    // alignItems: "flex-start",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cardDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
  },
  cardTextContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  cardTypeText: {
    fontSize: 17,
    color: "#475467",
    fontWeight: "600",
  },
  cardNumberText: {
    fontSize: 14,
    color: "#667085",
    fontWeight: "500",
    paddingTop: 4,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    // width: 40,
    // height: 40,
    borderWidth: 1,
    borderColor: "#EB5757",
    borderRadius: 20,
    // backgroundColor: "#FCE6E6",
  },
  deleteIconBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FCE6E6",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 96,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#0077B6",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  labelContainer: {
    marginBottom: 7,
    flexDirection: "row",
  },
  labelContent: {
    fontWeight: "bold",
  },
  selectionIcon: {
    position: "absolute",
    top: 15,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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

export default ManageCards;
