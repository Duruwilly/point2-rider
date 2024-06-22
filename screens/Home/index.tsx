import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFetchOrders } from "../../services/fetchOrders";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Octicons, MaterialIcons } from "@expo/vector-icons";
import Message from "../../assets/icon/message.svg";
import Decline from "../../assets/icon/decline.svg";
import { RootState } from "../../store/store";
import RecentOrders from "./components/RecentOrders";
import BottomSheet from "../../components/Bottomsheet/Bottomsheet";
import { Button, TextInput } from "react-native-paper";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import CustomRadioButton from "../../components/RadioButton/RadioButton";
import { colors } from "../../constants/colors";
import { ApiRequest } from "../../services/ApiNetwork";
import { useFetchUser } from "services/fetchUser";

const Home = ({ tab }: { tab: string }) => {
  const insets = useSafeAreaInsets();
  const { request } = ApiRequest();
  const navigation: any = useNavigation();
  const { user } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.appReducer);
  const { fetchOrders } = useFetchOrders();
  const { fetchUser } = useFetchUser();
  const isFocused = useIsFocused();
  const bottomSheetRef: any = useRef(null);
  const snapPoints = useMemo(() => ["25%", "40%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetToOpen, setBottomSheetToOpen] = useState("");
  const [trackingId, setTrackingId] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [radioBtnChecked, setRadioBtnChecked] = useState<number | null>(null);
  const [declineReasons, setDeclineReasons] = useState({
    reasons: "",
    others: "",
  });

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const options = [
    { value: "Long Distance" },
    { value: "Heavy Package" },
    { value: "Unavailable" },
    { value: "Package not at Pickup Point" },
  ];

  const setBottomSheetFn = (item: string, index: number) => {
    if (radioBtnChecked !== index) {
      setRadioBtnChecked(index);
      setDeclineReasons({ ...declineReasons, reasons: item });
    } else {
      setRadioBtnChecked(null);
      setDeclineReasons({ ...declineReasons, reasons: item });
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    const { others, reasons } = declineReasons;

    let payload: any = {
      others,
      reasons,
      trackingId,
    };

    if (others == "") {
      payload = { reasons, tracking_id: trackingId };
    } else {
      payload = { reasons: others, tracking_id: trackingId };
    }

    const resp = await request("POST", {
      url: "/rider/orders/cancel-order",
      payload: payload,
    });

    if (resp.status === "success") {
      await fetchOrders();
      setOpenBottomSheet(false);
      setLoading(false);
    }
  };

  const changeStatus = async () => {
    try {
      const resp = await request("POST", {
        url: "/rider/update-availability",
        payload: { availability_status: user?.availability_status === "ONLINE" ? "OFFLINE" : "ONLINE" },
      });

      if (resp.status === "success") {
        fetchUser();
      }
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, [tab, isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        {/* <Layout.ScrollView> */}
        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                style={styles.riderImage}
                source={
                  user?.profile_picture === null ||
                  user?.profile_picture === undefined
                    ? require("../../assets/images/no-img.png")
                    : { uri: user?.profile_picture }
                }
                alt="rider image"
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.helloText}>Hello,</Text>
                <Text style={styles.userNameText}>{user?.first_name}</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              {/* <TouchableOpacity
                onPress={() => navigation.navigate("chat-box")}
                style={styles.messageButton}
              >
                <Message />
                <View style={styles.messageBadge}>
                  <Text style={styles.messageBadgeText}>2</Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={changeStatus}
                style={styles.onlineStatusButton}
              >
                <Octicons name="dot-fill" size={20} color={user?.availability_status === "ONLINE" ? "#27AE60" : colors.secondary} />
                <Text style={styles.onlineStatusText}>
                  {`${user?.availability_status?.charAt(0).toUpperCase()}${user?.availability_status?.slice(1).toLowerCase()}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <RecentOrders
          setOpenBottomSheet={setOpenBottomSheet}
          setBottomSheetToOpen={setBottomSheetToOpen}
          setTrackingId={setTrackingId}
        />
        {/* </Layout.ScrollView> */}
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
          {bottomSheetToOpen === "first" ? (
            <View style={{ paddingHorizontal: 20, marginVertical: 15 }}>
              <View style={[styles.iconContainer, { alignSelf: "center" }]}>
                <Decline />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 17,
                  marginTop: 8,
                }}
              >
                Are you sure?
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  marginTop: 10,
                  color: "#1D2939",
                }}
              >
                Do you want to decline the pickup, once you decline it will be
                assigned to another rider
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
                  onPress={() => {
                    setBottomSheetToOpen("second");
                    setOpenBottomSheet(true);
                  }}
                >
                  Yes, Decline
                </Button>
                <Button
                  style={{
                    borderRadius: 10,
                    padding: 3,
                    marginTop: 30,
                    flex: 1,
                  }}
                  labelStyle={{ fontWeight: "bold", flex: 1 }}
                  buttonColor="#E4E7EC"
                  mode="contained"
                  textColor="#475467"
                  onPress={() => setOpenBottomSheet(false)}
                >
                  Go back
                </Button>
              </View>
            </View>
          ) : bottomSheetToOpen === "second" ? (
            <>
              <Text
                style={{
                  paddingHorizontal: 20,
                  marginVertical: 15,
                  textAlign: "left",
                  fontWeight: "700",
                  fontSize: 17,
                }}
              >
                What went wrong?
              </Text>
              <BottomSheetFlatList
                style={{ marginHorizontal: 10 }}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={[...options, { value: "Other Reasons" }]}
                renderItem={({ item, index }) => {
                  if (item.value === "Other Reasons") {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setBottomSheetToOpen("third");
                          setOpenBottomSheet(true);
                        }}
                        style={{
                          marginBottom: 5,
                          paddingVertical: 25,
                          paddingHorizontal: 15,
                          //   borderBottomWidth: 1,
                          //   borderBottomColor: "#ededed",
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
                            Other Reasons
                          </Text>
                          <MaterialIcons
                            name="keyboard-arrow-right"
                            size={24}
                            color="black"
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setBottomSheetFn(item?.value, index);
                        // setOpenBottomSheet(false);
                      }}
                      style={{
                        marginBottom: 5,
                        paddingVertical: 25,
                        paddingHorizontal: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ededed",
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
                          {item.value}
                        </Text>
                        <CustomRadioButton
                          value={index}
                          selected={radioBtnChecked === index}
                          onSelect={() => {
                            setBottomSheetFn(item?.value, index);
                            // setOpenBottomSheet(false);
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }}
                alwaysBounceVertical={false}
              />
              <View style={{ paddingHorizontal: 20 }}>
                <Button
                  style={{ borderRadius: 10, padding: 3, marginTop: 10 }}
                  labelStyle={{ fontWeight: "bold", flex: 1 }}
                  buttonColor={colors.primary}
                  mode="contained"
                  textColor="white"
                  onPress={handleDecline}
                  disabled={loading}
                  loading={loading}
                >
                  Done
                </Button>
              </View>
            </>
          ) : (
            <View style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  marginVertical: 15,
                  textAlign: "left",
                  fontWeight: "700",
                  fontSize: 17,
                }}
              >
                Other Reason?
              </Text>
              <TextInput
                value={declineReasons.others}
                onChangeText={(state) =>
                  setDeclineReasons({ ...declineReasons, others: state })
                }
                multiline={true}
                numberOfLines={3}
                placeholder="Please describe the problem"
                outlineColor={colors.inputBorder}
                activeOutlineColor={colors.primary + "99"}
                activeUnderlineColor="#00000000"
                placeholderTextColor="#667085"
                outlineStyle={{ borderRadius: 8 }}
                mode="outlined"
                style={{
                  backgroundColor: colors.inputBackground,
                  color: colors.primary,
                  height: 150,
                }}
              />
              <Button
                style={{ borderRadius: 10, padding: 3, marginTop: 10 }}
                labelStyle={{ fontWeight: "bold", flex: 1 }}
                buttonColor={colors.primary}
                mode="contained"
                textColor="white"
                onPress={handleDecline}
                disabled={loading}
                loading={loading}
              >
                Done
              </Button>
            </View>
          )}
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  riderImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  headerTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 4,
  },
  helloText: {
    color: "#475467",
    fontSize: 14,
    fontWeight: "500",
  },
  userNameText: {
    color: "#101828",
    fontSize: 16,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageButton: {
    position: "relative",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EBF8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#EB5757",
    height: 16,
    width: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  onlineStatusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 94,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3FFF8",
    borderWidth: 1.2,
    borderColor: "#475467",
    marginLeft: 3,
  },
  onlineStatusText: {
    color: "#475467",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F2F4F7",
  },
});

export default Home;
