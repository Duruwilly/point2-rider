import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Bike from "../../../assets/icon/Character.svg";
import Base from "../../../assets/icon/base.svg";
import Bag from "../../../assets/icon/bag.svg";
import Line from "../../../assets/icon/line.svg";
import Location from "../../../assets/icon/location.svg";
import { Feather, Octicons } from "@expo/vector-icons";
import { Orders } from "../../../models/Orders";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../constants/colors";
import { ApiRequest } from "../../../services/ApiNetwork";
import { useFetchOrders } from "../../../services/fetchOrders";
import Layout from "layouts/layout";

const RecentOrders = ({
  setOpenBottomSheet,
  setBottomSheetToOpen,
  setTrackingId,
}: {
  setOpenBottomSheet: Dispatch<SetStateAction<boolean>>;
  setBottomSheetToOpen: Dispatch<SetStateAction<string>>;
  setTrackingId: Dispatch<SetStateAction<string | null>>;
}) => {
  const { orders } = useSelector((state: RootState) => state.appReducer);
  // console.log(orders);
  const { fetchOrders, refreshing } = useFetchOrders();
  // console.log("home", orders);

  return (
    <>
      {orders?.length === 0 && (
        <Layout.Body>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyContent}>
              <View style={styles.emptyIconContainer}>
                <Bike />
                <Base />
              </View>
              <Text style={styles.noOrdersText}>
                No orders available for {"\n"} you at the moment
              </Text>
              <TouchableOpacity
                onPress={fetchOrders}
                style={styles.refreshButton}
              >
                <Feather name="refresh-ccw" size={18} color="#344054" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Layout.Body>
      )}

      <View style={styles.ordersContainer}>
        {orders?.length > 0 && (
          // orders?.map((item, index) => (
          //   <OrderList
          //     item={item}
          //     setOpenBottomSheet={setOpenBottomSheet}
          //     setBottomSheetToOpen={setBottomSheetToOpen}
          //     setTrackingId={setTrackingId}
          //   />
          // ))
          <Layout.FlatList
            showsVerticalScrollIndicator={false}
            // style={{ flex: 1 }}
            data={orders}
            renderItem={({ item }) => {
              return (
                <OrderList
                  item={item}
                  setOpenBottomSheet={setOpenBottomSheet}
                  setBottomSheetToOpen={setBottomSheetToOpen}
                  setTrackingId={setTrackingId}
                />
              );
            }}
            alwaysBounceVertical={false}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
            }
          />
        )}
      </View>
    </>
  );
};

const OrderList = ({
  item,
  setOpenBottomSheet,
  setBottomSheetToOpen,
  setTrackingId,
}: {
  item: Orders;
  setOpenBottomSheet: Dispatch<SetStateAction<boolean>>;
  setBottomSheetToOpen: Dispatch<SetStateAction<string>>;
  setTrackingId: Dispatch<SetStateAction<string | null>>;
}) => {
  const [loading, setLoading] = useState({
    accept: false,
    picked: false,
  });
  const [orderAccepted, setOrderAccepted] = useState<boolean>(false);
  const { request } = ApiRequest();
  const [singleDetailsview, setSingleDetailsview] = useState(false);
  const { fetchOrders } = useFetchOrders();

  const [pickedUp, setPickedUp] = useState(false);
  const navigation: any = useNavigation();

  const handleAccept = async (item: string | null) => {
    try {
      setLoading({ ...loading, accept: true });
      const resp = await request("POST", {
        url: "/rider/orders/accept",
        payload: { tracking_id: item },
      });
      if (resp.status === "success") {
        await fetchOrders();
        setOrderAccepted(true);
        setLoading({ ...loading, accept: false });
      } else {
        setLoading({ ...loading, accept: false });
      }
    } catch (error) {
      setLoading({ ...loading, accept: false });
    }
  };

  const handlePickup = async (item: string | null) => {
    try {
      setLoading({ ...loading, picked: true });
      const resp = await request("POST", {
        url: "/rider/orders/pick-up",
        payload: { tracking_id: item },
      });
      if (resp.status === "success") {
        await fetchOrders();
        setPickedUp(true);
        setLoading({ ...loading, picked: false });
      } else {
        setLoading({ ...loading, picked: false });
      }
    } catch (error) {
      setLoading({ ...loading, picked: false });
    }
  };

  const handleSingleItem = async (item: Orders) => {
    try {
      setSingleDetailsview(true);
      const itemId = item?.id;
      const response = await request("GET", {
        url: `/rider/getorders?id=${itemId}`,
      });
      const { data, status } = response;

      if (status === "success") {
        navigation.navigate("order-details", { data: data.data });
        setSingleDetailsview(false);
      }
    } catch (error) {
      console.log("error", error);
      setSingleDetailsview(false);
    }
    // navigation.navigate("order-details", {data: null});
  };

  return (
    <View key={item?.id} style={styles.orderCard}>
      {/* PACKAGE */}
      <View style={styles.packageContainer}>
        <Bag />
        <Text style={styles.packageText}>PACKAGE {item?.id}</Text>
      </View>

      {/* PICK ADDRESS */}
      <View style={styles.pickAddressContainer}>
        <View style={styles.pickAddressIconContainer}>
          <Octicons name="dot-fill" size={18} color="#0077B6" />
          <View style={styles.lineContainer}>
            <Line />
          </View>
        </View>

        <View style={styles.addressTextContainer}>
          <Text style={styles.addressTitleText}>Pick Up</Text>
          <Text style={styles.addressText}>{item?.pickup_location}</Text>
        </View>
      </View>

      {/* DELIVERY LOCATION */}
      <View style={styles.deliveryLocationContainer}>
        <View style={styles.locationIconContainer}>
          <Location />
        </View>

        <View style={styles.addressTextContainer}>
          <Text style={styles.addressTitleText}>To {item?.recepient_name}</Text>
          <Text style={styles.addressText}>
            {item?.delivery_point_location}
          </Text>
        </View>
      </View>

      {/* DURATION */}
      <View style={styles.durationContainer}>
        <View style={styles.durationTextContainer}>
          <Text style={styles.labelText}>Phone number</Text>
          <Text style={styles.valueText}>{item?.recepient_phone}</Text>
        </View>
        {/* 
        <View style={styles.durationTextContainer}>
          <Text style={styles.labelText}>Delivery time</Text>
          <Text style={styles.valueText}>{item?.status}</Text>
        </View> */}
      </View>
      <View style={{marginTop: 30}}>
        {item?.status === "ASSIGNEDTORIDER" && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              disabled={loading.accept}
              onPress={() => handleAccept(item?.tracking_id)}
              style={[styles.button, { backgroundColor: colors.primary }]}
            >
              {loading?.accept ? (
                <ActivityIndicator />
              ) : (
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Accept Order
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetToOpen("first");
                setOpenBottomSheet(true);
                setTrackingId(item?.tracking_id);
              }}
              style={[styles.button, { backgroundColor: colors.secondary }]}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.status === "ACCEPTED" && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              disabled={loading?.picked}
              onPress={() => handlePickup(item?.tracking_id)}
              style={[styles.button, { backgroundColor: colors.primary }]}
            >
              {loading?.picked ? (
                <ActivityIndicator />
              ) : (
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Picked Up
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSingleItem(item)}
              style={[styles.button, { backgroundColor: colors.secondary }]}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                {singleDetailsview ? "Please wait..." : "View Details"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.status === "INTRANSIT" && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              onPress={() => handleSingleItem(item)}
              style={[
                styles.button,
                { backgroundColor: colors.secondary, width: "100%" },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.status === "DELIVERED" && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "#F2F4F7",
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#D0D5DD",
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: "#667085" }]}>
                Order Delivered
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.status === "CANCELLED" && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "#F2F4F7",
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#D0D5DD",
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: "#667085" }]}>
                Order Declined
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 100,
  },
  emptyIconContainer: {
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  noOrdersText: {
    color: "#344054",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 20,
    marginTop: 36,
  },
  refreshButtonText: {
    color: "#344054",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 3,
  },
  emptyContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ordersContainer: {
    width: "100%",
    marginTop: 7,
  },
  orderCard: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: "#FCFCFD",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
    marginTop: 10,
    marginBottom: 5,
  },
  packageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  packageText: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 12,
  },
  pickAddressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
  },
  pickAddressIconContainer: {
    alignItems: "center",
  },
  lineContainer: {
    marginTop: -6,
  },
  addressTextContainer: {
    marginLeft: 12,
  },
  addressTitleText: {
    color: "#344054",
    fontSize: 16,
    fontWeight: "600",
  },
  addressText: {
    color: "#475467",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 8,
  },
  deliveryLocationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: -1,
    marginLeft: -3,
  },
  locationIconContainer: {
    alignItems: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
  durationTextContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  labelText: {
    color: "#344054",
    fontSize: 14,
    fontWeight: "400",
  },
  valueText: {
    color: "#1D2939",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 1,
  },
  buttonsRow: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  button: {
    width: "48%",
    height: 44,
    // backgroundColor: "#0077B6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default RecentOrders;
