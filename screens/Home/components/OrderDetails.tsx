import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Octicons, Ionicons } from "@expo/vector-icons";
import Box from "../../../assets/icon/box3.svg";
import Line from "../../../assets/icon/line.svg";
import Copy from "../../../assets/icon/copy.svg";
import Navigation from "../../../assets/icon/navigation2.svg";
import { copyToClipboard, numberFormat } from "../../../utils/helpers";
import { useNavigation } from "@react-navigation/native";
import { useFetchOrders } from "../../../services/fetchOrders";
import { ApiRequest } from "../../../services/ApiNetwork";

const OrderDetails = ({ route }: any) => {
  const insets = useSafeAreaInsets();
  const data = route?.params?.data;
  const navigation: any = useNavigation();
  const { fetchOrders } = useFetchOrders();
  const { request } = ApiRequest();

  const handleArrived = async () => {
    // try {
    //   const resp = await request("POST", {
    //     url: "",
    //     payload: {tracking_id: data?.tracking_id}
    //   })
    //   if(resp.status === "success") {
    //     await fetchOrders()
    //   }
    // } catch (error) {

    // }
    navigation.navigate("chat-box", { trackingId: data?.tracking_id });
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <Layout.ScrollView>
          <View style={styles.productContainer}>
            <View style={styles.iconContainer}>
              <Box />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.packageName}>{data?.package_name}</Text>
              <View style={styles.trackingContainer}>
                <Text style={styles.trackingText}>
                  Tracking ID: {data?.tracking_id}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(data?.tracking_id)}
                  style={styles.copyButton}
                >
                  {/* <Copy /> */}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* PRODUCT DETAILS */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>Recipient Name</Text>
              <Text style={styles.detailText}>{data?.recepient_name}</Text>
            </View>
            {/* <View style={[styles.detailBlock, styles.detailMargin]}>
              <Text style={styles.detailTitle}>Package Quantity</Text>
              <Text style={styles.detailText}>30</Text>
            </View> */}
          </View>

          <View style={styles.detailsContainer}>
            {/* <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>Expected Delivery Time</Text>
              <Text style={styles.detailText}>1hr 3ms</Text>
            </View> */}
            <View style={[styles.detailBlock, styles.detailMargin]}>
              <Text style={styles.detailTitle}>Amount Paid (N)</Text>
              <Text style={styles.detailText}>
                {numberFormat(Number(data?.amount))}
              </Text>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <View style={[styles.statusItem, { marginTop: 5 }]}>
              <Octicons name="dot-fill" size={20} color="#CCE4F0" />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>From</Text>
                <Text style={styles.statusText}>{data?.pickup_location}</Text>
              </View>
            </View>

            <View style={[styles.statusItem, { marginTop: 15 }]}>
              <Octicons name="dot-fill" size={20} color="#32D583" />
              <View style={[styles.statusTextContainer]}>
                <Text style={styles.statusTitle}>Shipped to</Text>
                <Text style={styles.statusText}>
                  {data?.delivery_point_location}
                </Text>
              </View>
            </View>

            <View style={styles.finalStatus}>
              <Text style={styles.finalStatusText}>
                Status:{" "}
                {data?.status === "INTRANSIT"
                  ? "In-transit"
                  : data?.status === "DELIVERED"
                  ? "Delivered"
                  : data?.status === "ACCEPTED" && "Accepted"}
              </Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#27AE60"
              />
            </View>
          </View>

          {/* PRODUCT STATUSES */}
          {data?.status === "INTRANSIT" && (
            <View style={styles.productStatuses}>
              {/* PICKED UP */}
              <View style={[styles.statusItem, { marginTop: 5 }]}>
                <View style={styles.pickAddressIconContainer}>
                  <Octicons name="dot-fill" size={18} color="#0077B6" />
                  <View style={styles.lineContainer}>
                    <Line />
                  </View>
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>Picked up</Text>
                  {/* <Text style={styles.statusDate}>
                    February 2, 2024. 10:00am
                  </Text> */}
                </View>
              </View>

              {/* IN TRANSIT */}
              <View style={styles.statusItem}>
                <View style={styles.pickAddressIconContainer}>
                  <Octicons name="dot-fill" size={18} color="#0077B6" />
                  <View style={styles.lineContainer}>
                    <Line />
                  </View>
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>In Transit</Text>
                  <Text style={styles.statusDate}>
                    Package picked up by you.
                    {/* <Text style={styles.statusMediumText}>(KJA-884-RM)</Text> */}
                  </Text>
                </View>
              </View>

              {/* DELIVERED */}
              <View style={styles.statusItem}>
                <Navigation />
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>
                    {data?.status === "INTRANSIT"
                      ? "Delivering to"
                      : data?.status === "COMPLETED" && "Delivered to"}
                  </Text>
                  <Text style={styles.statusDate}>
                    {data?.delivery_point_location}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* BUTTON */}
          {/* {data?.status === "ARRIVED" && ( */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleArrived}
              style={styles.arrivedButton}
            >
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("tracking", { orderItem: data })
              }
              style={styles.mapButton}
            >
              <Text style={styles.mapButtonText}>View Map</Text>
            </TouchableOpacity>
          </View>
          {/* )} */}
        </Layout.ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 8,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EBF8FF",
  },
  productDetails: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 5,
  },
  packageName: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "700",
  },
  trackingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  trackingText: {
    fontSize: 14,
    color: "#1D2939",
    fontWeight: "400",
    paddingTop: 6,
  },
  copyButton: {
    marginLeft: 2,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 8,
  },
  detailBlock: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  detailTitle: {
    fontSize: 12,
    color: "#475467",
    fontWeight: "500",
  },
  detailText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "700",
    paddingTop: 1,
  },
  detailMargin: {
    // marginLeft: 12,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    marginTop: 5,
    padding: 16,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    // marginTop: 5,
  },
  statusTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 8,
    paddingTop: 2,
  },
  statusTitle: {
    fontSize: 12,
    color: "#1D2939",
    fontWeight: "500",
  },
  statusText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "700",
    paddingTop: 2,
  },
  finalStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 24,
    paddingBottom: 2,
    paddingLeft: 5,
  },
  finalStatusText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "600",
  },
  productStatuses: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 6,
  },
  statusDate: {
    fontSize: 14,
    color: "#475467",
    fontWeight: "400",
  },
  statusMediumText: {
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
  },
  arrivedButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "48.5%",
    borderRadius: 8,
    backgroundColor: "#0077B6",
  },
  mapButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "48.5%",
    borderRadius: 8,
    backgroundColor: "#D9F2FF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0077B6",
  },
  pickAddressIconContainer: {
    alignItems: "center",
  },
  lineContainer: {
    marginTop: -6,
  },
});

export default OrderDetails;
