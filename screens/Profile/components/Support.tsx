import React, { Dispatch, SetStateAction } from "react";
import Layout from "../../../layouts/layout";
import {
  StyleSheet,
  Text,
  Linking,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { colors } from "../../../constants/colors";
import { Feather } from "@expo/vector-icons";
import Phone from "../../../assets/icon/phone.svg";
import Chat from "../../../assets/icon/chat.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const Support = ({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<number>>;
}) => {
  const { app_version } = useSelector((state: RootState) => state.appReducer);

  return (
    <Layout>
      <Layout.Header back={() => setPages(0)} />
      <Text style={[styles.headerText, { padding: 20 }]}>Help & Support</Text>
      <Layout.ScrollView>
        <Pressable
          onPress={async () => await Linking.openURL("tel:09130812426")}
          style={styles.contactContainer}
        >
          <View style={styles.iconContainer}>
            <Phone />
          </View>
          <Text style={styles.contactText}>Contact Us</Text>
        </Pressable>

        <View style={styles.faqContainer}>
          <View style={styles.iconContainer}>
            <Chat />
          </View>
          <Text style={styles.faqText}>FAQs</Text>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Point2 Delivery</Text>
          <Text style={styles.versionText}>Version {app_version}</Text>
        </View>
      </Layout.ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    // textAlign: "center",
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    // marginTop: 48,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
    backgroundColor: "#EBF8FF",
    borderRadius: 24,
  },
  contactText: {
    fontSize: 16,
    color: "#667085",
    fontWeight: "500",
    marginLeft: 20,
  },
  faqContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 15,
  },
  faqText: {
    fontSize: 16,
    color: "#667085",
    fontWeight: "500",
    marginLeft: 20,
  },
  footerContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 40,
  },
  footerText: {
    fontSize: 16,
    color: "#667085",
    fontWeight: "500",
  },
  versionText: {
    fontSize: 12,
    color: "#667085",
    fontWeight: "400",
  },
});

export default Support;
