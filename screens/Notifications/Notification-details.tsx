import React from 'react'
import Layout from '../../layouts/layout'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

const NotificationDetails = ({route}: any) => {
    const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <Text style={[styles.headerText, { padding: 20 }]}>
          Notifications
        </Text>
        <Layout.ScrollView>
        <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              {route?.params?.data.message}{" "}
              {/* <Text style={styles.notificationStatus}>{route?.params?.data?.status}</Text> */}
            </Text>
            <Text style={styles.notificationText}>
              {route?.params?.data?.message_body}{" "}
              <Text style={styles.estimatedTime}>{route?.params?.data?.estimated_time}</Text>
            </Text>
          </View>
        </Layout.ScrollView>
        </Layout>
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    headerText: {
      color: colors.darkGrey,
      fontWeight: "bold",
      fontSize: 24,
    //   textAlign: "center",
    },
    sectionContainer: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        marginTop: 24,
      },
      sectionTitle: {
        fontSize: 12,
        color: "#667085",
        fontFamily: "medium",
        marginBottom: 20,
      },
      notificationContainer: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
      },
      notification: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        marginBottom: 24,
      },
      notificationContent: {
        flex: 1,
        marginLeft: 16,
      },
      notificationTitle: {
        fontSize: 14,
        color: "#1D2939",
        fontFamily: "bold",
      },
      notificationStatus: {
        fontFamily: "medium",
      },
      notificationText: {
        fontSize: 14,
        color: "#667085",
        fontFamily: "regular",
        marginTop: 8,
      },
      estimatedTime: {
        fontSize: 14,
        color: "#0077B6",
        fontFamily: "medium",
        marginTop: 8,
      },
})

export default NotificationDetails