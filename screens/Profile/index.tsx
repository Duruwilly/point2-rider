import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import Profile from "./components/Profile";
import EditDetails from "./components/EditDetails";
import ManageCards from "./components/ManageCards";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Support from "./components/Support";
import ReportIssue from "./components/ReportIssue";

const ProfilePage = () => {
  const insets = useSafeAreaInsets();

  const [pages, setPages] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      {/* <Layout>
        <Text style={[styles.headerText, { paddingTop: 20 }]}>
          ProfilePage
        </Text>
        <Layout.ScrollView> */}
        {pages === 0
         ? <Profile setPages={setPages} />
         : pages === 1 
         ? <EditDetails setPages={setPages} />
         : pages === 2
         ? <ManageCards setPages={setPages} />
         : pages === 3
         ? <PrivacyPolicy setPages={setPages} />
         : pages === 4
         ? <Support setPages={setPages} />
         : pages === 5
         && <ReportIssue setPages={setPages} />
        }
        {/* </Layout.ScrollView>
      </Layout> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
});

export default ProfilePage;
