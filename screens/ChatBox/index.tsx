import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Verified from "../../assets/icon/verified.svg";
import Phone from "../../assets/icon/phone3.svg";
import { FontAwesome } from "@expo/vector-icons";
import { ApiRequest } from "../../services/ApiNetwork";
import User from "../../models/User";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clearUserMessages, setUserMessages } from "../../store/reducers/app-reducer";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

export interface userConnectedToOrder extends User {
  user_id: string;
}

const ChatBox = ({ route }: any) => {
  const { usersMessages } = useSelector((state: RootState) => state.appReducer);
  const { auth_Id } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState("");
  const [textInputMessage, setTextInputMessage] = useState("");
  const [textMessageDate, setTextMessageDate] = useState<Date | null>(null);
  const { request } = ApiRequest();
  const [userConnectedToOrder, setUserConnectedToOrder] = useState(
    {} as userConnectedToOrder
  );

  const handleInputChange = (input: string) => {
    setMessage(input);
  };

  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();
  const ScreenWidth = Dimensions.get("window").width;

  //  1 get user connected to user
  useEffect(() => {
    (async () => {
      try {
        const response = await request("GET", {
          url: `/messaging/get-user-connected-to-order?tracking_id=${route?.params?.trackingId}`,
          // payload: { tracking_id: route?.params?.trackingId },
        });
        // console.log("user-conected-to-order", response);

        if (response.status === "success") {
          setUserConnectedToOrder(response.data.data);
        }
      } catch (error) {}
    })();

    return () => {
      dispatch(clearUserMessages());
    };
  }, []);

  //   2 get messages between users
  // useEffect(() => {
  const getMessage = async () => {
    try {
      const response = await request("GET", {
        url: `/messaging/get-messages?to_user_id=${userConnectedToOrder?.user_id}`,
        // payload: { to_user_id: userConnectedToOrder?.user_id },
        ignoreError: true,
      });
      // console.log("users-messages", response.data?.data);

      if (response.status === "success") {
        dispatch(setUserMessages(response.data.data[0]));
      }
    } catch (error) {}
  };
  // }, []);

  const sendMessage = async () => {
    if (message.length > 0) {
      try {
        const response = await request("POST", {
          url: `/messaging/send-message`,
          payload: {
            to_user_id: userConnectedToOrder?.user_id,
            message: message,
          },
        });
        // console.log("send-messages", response);

        if (response.status === "success") {
          // setTextInputMessage(message);
          // setTextMessageDate(date);
          setMessage("");
          getMessage();
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    getMessage();
  }, [userConnectedToOrder?.user_id]);

  useEffect(() => {
    const pusher = new Pusher("fbuopzuamzxyjydgetkb", {
      cluster: "",
    });

    const echo = new Echo({
      client: pusher,
      broadcaster: "reverb",
      key: "fbuopzuamzxyjydgetkb",
      wsHost: "ws.point2.ng",
      wsPort: 80,
      wssPort: 80,
      forceTLS: "https",
      enabledTransports: ["ws", "wss"],
    });

    echo.channel("message").listen(`message_received${auth_Id}`, (e: any) => {
      console.log("Event data:", e);
      getMessage()
    });

    return () => {
      echo.disconnect();
    };
  }, [auth_Id]);

  const messagess = [
    [
      {
        id: 1,
        message:
          "Hello this is a sent message hdllo lorem s bvjhvj hgvhv hvhu hvuh ",
        type: "sent",
        date_sent: "2024/05/24 10:48:42",
      },
      {
        id: 2,
        message:
          "Hello this is a received message hguyg jjhgj gu hvuvu hvhuv hgvhgv",
        type: "received",
        date_sent: "2024/05/24 10:48:50",
      },
      {
        id: 3,
        message: "Hello this is a sent message",
        type: "sent",
        date_sent: "2024/05/24 10:48:53",
      },
    ],
  ];

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.riderImageContainer}>
              <Image
                style={styles.riderImage}
                source={
                  userConnectedToOrder?.profile_picture
                    ? { uri: userConnectedToOrder?.profile_picture }
                    : require("../../assets/images/rider.jpg")
                }
                alt="Rider"
              />
              <View style={styles.verifiedIcon}>
                <Verified />
              </View>
            </View>
            <View style={styles.riderInfo}>
              <View style={styles.riderNameContainer}>
                <Text style={styles.riderName}>
                  {userConnectedToOrder?.first_name ?? ""}{" "}
                  {userConnectedToOrder?.last_name ?? ""}
                </Text>
                {/* <View style={styles.riderBadge}>
                  <Text style={styles.riderBadgeText}>Rider</Text>
                </View> */}
              </View>
              {/* <Text style={styles.riderDetails}>AJKHR81 | Red Bike</Text> */}
            </View>
          </View>
          <TouchableOpacity
            onPress={async () =>
              await Linking.openURL(`tel:${userConnectedToOrder?.phone}`)
            }
            style={styles.callButton}
          >
            <Phone />
          </TouchableOpacity>
        </View>

        {/* <Layout.ScrollView> */}
        <KeyboardAvoidingView>
          <View style={styles.messagesContainer}>
            <FlatList
              data={usersMessages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    alignSelf:
                      item?.type === "received" ? "flex-start" : "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  <View
                    style={[
                      styles.messageBubbleIncoming,
                      {
                        backgroundColor:
                          item.type === "received" ? "#F2F4F7" : "#D9F2FF",
                      },
                    ]}
                  >
                    <Text style={styles.messageText}>{item.message}</Text>
                  </View>
                  <Text style={styles.timestamp}>{item.date_sent}</Text>
                </View>
              )}
            />
            {/* {textInputMessage && (
              <View
                style={{
                  alignSelf: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 5,
                }}
              >
                <View
                  style={[
                    styles.messageBubbleIncoming,
                    {
                      backgroundColor: "#D9F2FF",
                    },
                  ]}
                >
                  <Text style={styles.messageText}>{textInputMessage}</Text>
                </View>
                <Text
                  style={styles.timestamp}
                >{`${textMessageDate?.toLocaleDateString()} ${textMessageDate?.toLocaleTimeString()}`}</Text>
              </View>
            )} */}
          </View>
        </KeyboardAvoidingView>
        {/* </Layout.ScrollView> */}

      </Layout>
        {/* BOTTOM INPUT */}
        <View style={styles.bottomInputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type Message"
              placeholderTextColor="#1D2939"
              onChangeText={handleInputChange}
              value={message}
              keyboardType="default"
            />
            {/* <TouchableOpacity style={styles.addButton}>
              <FontAwesome6 name="add" size={18} color="#EBF8FF" />
            </TouchableOpacity> */}
            {/* <View style={styles.rightIconsContainer}>
              <View style={styles.verticalSeparator}></View>
              {message ? (
                <TouchableOpacity style={styles.sendButton}>
                  <FontAwesome name="send" size={15} color="#EBF8FF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.speakerButton}>
                  <Speaker />
                </TouchableOpacity>
              )}
            </View> */}
            <View style={styles.rightIconsContainer}>
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <FontAwesome name="send" size={15} color="#EBF8FF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 5,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    left: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  backButtonText: {
    fontSize: 12,
    color: "#344054",
    fontFamily: "medium",
    paddingLeft: 2,
    paddingBottom: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  riderImageContainer: {
    position: "relative",
  },
  riderImage: {
    width: 54,
    height: 54,
    borderRadius: 9999,
  },
  verifiedIcon: {
    position: "absolute",
    right: -1,
    top: -1,
  },
  riderInfo: {
    marginLeft: 16,
    alignItems: "flex-start",
  },
  riderNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  riderName: {
    fontSize: 16,
    color: "#344054",
    fontFamily: "bold",
  },
  riderBadge: {
    height: 22,
    width: 46,
    backgroundColor: "#F2C94C",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  riderBadgeText: {
    fontSize: 12,
    color: "#344054",
    fontFamily: "bold",
  },
  riderDetails: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "medium",
    marginTop: 1,
  },
  callButton: {
    height: 48,
    width: 48,
    backgroundColor: "#EBF8FF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewContent: {
    // width: ScreenWidth,
    paddingBottom: 110,
  },
  messagesContainer: {
    // alignItems: "center",
    // justifyContent: "flex-start",
    // width: "100%",
    marginTop: 6,
    marginBottom: 180,
    paddingHorizontal: 20,
  },
  messageIncomingContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  messageSentContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%",
  },
  messageBubbleIncoming: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    // backgroundColor: "#F2F4F7",
    borderRadius: 16,
    marginVertical: 1,
    maxWidth: 265,
  },
  messageBubbleSent: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    // backgroundColor: "#D9F2FF",
    borderRadius: 16,
    marginVertical: 1,
    maxWidth: 265,
  },
  messageText: {
    fontSize: 14,
    color: "#1D2939",
    fontFamily: "medium",
  },
  timestamp: {
    fontSize: 12,
    color: "#667085",
    fontFamily: "regular",
    marginTop: 2,
  },
  bottomInputContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    paddingTop: 3,
    backgroundColor: "#fff",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    width: "100%",
    paddingHorizontal: 5,
    paddingBottom: 6,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 32,
    height: 64,
    width: "100%",
    color: "#000",
    fontSize: 14,
    // fontFamily: "regular",
    // paddingLeft: 50,
    paddingLeft: 16,
  },
  addButton: {
    position: "absolute",
    top: "24%",
    left: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0077B6",
    height: 33,
    width: 33,
    borderRadius: 16.5,
  },
  rightIconsContainer: {
    position: "absolute",
    top: "24%",
    right: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  verticalSeparator: {
    borderColor: "#D0D5DD",
    height: 33,
    borderWidth: 1,
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0077B6",
    height: 33,
    width: 33,
    borderRadius: 16.5,
    marginLeft: 4,
  },
  speakerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0077B6",
    height: 33,
    width: 33,
    borderRadius: 16.5,
    marginLeft: 4,
  },
});

export default ChatBox;
