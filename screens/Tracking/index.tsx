/** @format */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapViewDirections from "react-native-maps-directions";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { userConnectedToOrder } from "../ChatBox";
import { ApiRequest } from "../../services/ApiNetwork";
import BottomSheet from "../../components/Bottomsheet/Bottomsheet";
import Verified from "../../assets/icon/verified.svg";
import { colors } from "../../constants/colors";
import { Orders } from "../../models/Orders";
import { BASE_URL } from "../../constants/Base_urls";
// import { RenderScreenWebView } from "../CreateOrder/components/web-view";
import { GOOGLE_PLACES_API_KEY } from "../../constants/app";
import Box from "../../assets/icon/box.svg";
import { numberFormat } from "utils/helpers";

const Tracking = ({ route }: any) => {
  const { request } = ApiRequest();
  const { orders } = useSelector((state: RootState) => state.appReducer);
  const { location } = useSelector((state: RootState) => state.user);

  const orderItem = route?.params?.orderItem;
  const insets = useSafeAreaInsets();
  const [userConnectedToOrder, setUserConnectedToOrder] = useState(
    {} as userConnectedToOrder
  );
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const bottomSheetRef: any = useRef(null);
  const snapPoints = useMemo(() => ["25%", "35%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const onMapLayout = () => {
    setIsMapReady(true);
  };

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const apiKey = GOOGLE_PLACES_API_KEY;

  let orderDetails = null;

  if (orderItem?.tracking_id) {
    orderDetails = orders?.find(
      (item: Orders) => item?.tracking_id === orderItem?.tracking_id
    );
  }
  // const orderDetails = orders?.find(
  //   (item: Orders) => item?.tracking_id === orderItem?.tracking_id
  // );

  // console.log(orderDetails, orderItem?.tracking_id);
  // 6.597 3.343 6.367 4.817
  const originLatitude = orderDetails?.pickup_location_coordinate
    ? orderDetails?.pickup_location_coordinate[0]
    : null;
  const originLongitude = orderDetails?.pickup_location_coordinate
    ? orderDetails?.pickup_location_coordinate[1]
    : null;
  const destinationLatitude = orderDetails?.delivery_point_location_coordinate
    ? orderDetails?.delivery_point_location_coordinate[0]
    : null;
  const destinationLongitude = orderDetails?.delivery_point_location_coordinate
    ? orderDetails?.delivery_point_location_coordinate[1]
    : null;

  const [origin, setOrigin] = useState({
    latitude: originLatitude || 0,
    longitude: originLongitude || 0,
  });
  const [destination, setDestination] = useState({
    latitude: destinationLatitude || 0,
    longitude: destinationLongitude || 0,
  });

  useEffect(() => {
    if (
      originLatitude &&
      originLongitude &&
      destinationLatitude &&
      destinationLongitude
    ) {
      setOrigin({ latitude: originLatitude, longitude: originLongitude });
      setDestination({
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      });
    }
  }, [
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude,
  ]);

  const navigation: any = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const response = await request("GET", {
          url: `/messaging/get-user-connected-to-order?tracking_id=${orderItem?.tracking_id}`,
          // payload: { tracking_id: orderItem?.tracking_id },
          ignoreError: true,
        });

        if (response.status === "success") {
          setUserConnectedToOrder(response.data.data);
          setOpenBottomSheet(true);
        } else {
          // setOpenBottomSheet(true); // remove later
        }
      } catch (error) {
        // setOpenBottomSheet(true); // remove later
      }
    })();
  }, []);

  if (
    !originLatitude ||
    !originLongitude ||
    !destinationLatitude ||
    !destinationLongitude
    // !location
  ) {
    return (
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
        <Layout.Header />
        <Layout>
          <Layout.Body>
            <View style={[styles.container, { marginTop: 50 }]}>
              <Text style={styles.errorText}>
                No Location data available yet. You can check back later when
                you get a tracking Id.
              </Text>
            </View>
          </Layout.Body>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={[styles.map]}
        region={{
          latitude: (origin?.latitude + destination?.latitude) / 2,
          longitude: (origin?.longitude + destination?.longitude) / 2,
          // latitude: (location?.latitude + destination?.latitude) / 2,
          // longitude: (location?.longitude + destination?.longitude) / 2,
          // latitudeDelta: Math.abs(location?.latitude - destination?.latitude) * 2,
          // longitudeDelta:
          //   Math.abs(location?.longitude - destination?.longitude) * 2,
          latitudeDelta: Math.abs(origin?.latitude - destination?.latitude) * 2,
          longitudeDelta:
            Math.abs(origin?.longitude - destination?.longitude) * 2,
        }}
        loadingIndicatorColor="#e21d1d"
        provider={
          Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        scrollEnabled={true}
        rotateEnabled={true}
        showsUserLocation={true}
        loadingEnabled={true}
        pitchEnabled={true}
        showsIndoorLevelPicker={true}
        onMapReady={onMapLayout}
      >
        <Marker coordinate={origin}>
          {/* <Marker coordinate={location}> */}
          <MaterialCommunityIcons name="motorbike" size={24} color="black" />
        </Marker>
        {origin && <Marker coordinate={origin} />}
        {/* {location && <Marker coordinate={location} />} */}
        {destination && <Marker coordinate={destination} />}
        {isMapReady && origin && destination && (
          <MapViewDirections
            origin={origin}
            // origin={location}
            destination={destination}
            apikey={apiKey}
            strokeColor={colors.primary}
            strokeWidth={4}
            onReady={(args) => {
              setDistance(Number(args?.distance));
              setDuration(args?.duration);
            }}
            mode="DRIVING"
          />
        )}
      </MapView>
      {distance && duration ? (
        <View
          style={{
            padding: 16,
            position: "absolute",
            top: 100,
            right: 30,
          }}
        >
          <Text style={{ fontWeight: "800", color: "red" }}>
            Distance: {distance?.toFixed(2)}
          </Text>
          <Text style={{ fontWeight: "800", color: "red" }}>
            Duration: {Math.ceil(duration)} min
          </Text>
        </View>
      ) : null}
      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.backButton]}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
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
          <View style={{ marginTop: 0, flex: 1 }}>
            <View style={styles.header}>
              <View style={styles.productContainer}>
                <View style={styles.iconContainer}>
                  <Box />
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.packageName}>
                    {orderItem?.package_name}
                  </Text>
                  <View style={styles.trackingContainer}>
                    <Text style={styles.trackingText}>
                      Tracking ID: {orderItem?.tracking_id}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <View style={styles.detailsContainer}>
                {/* <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>Expected Delivery Time</Text>
              <Text style={styles.detailText}>1hr 3ms</Text>
            </View> */}
                <View style={[styles.detailBlock, styles.detailMargin]}>
                  <Text style={styles.amountTitle}>Amount Paid (N)</Text>
                  <Text style={styles.amountText}>{numberFormat(Number(orderItem?.amount))}</Text>
                </View>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20 }}
            >
              <TouchableOpacity
                onPress={async () =>
                  await Linking.openURL(`tel:${userConnectedToOrder?.phone}`)
                }
                style={[
                  {
                    flex: 1,
                    backgroundColor: "#27AE60",
                    paddingVertical: 10,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 7,
                    justifyContent: "center",
                  },
                ]}
              >
                <Feather name="phone" size={20} color="white" />
                <Text style={{ color: "white" }}>Call Recipient</Text>
              </TouchableOpacity>
              {/* {orderItem?.status === "ARRIVED" && ( */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("confirm-delivery", {
                      trackingId: orderItem?.tracking_id,
                    })
                  }
                  style={[
                    {
                      flex: 1,
                      backgroundColor: colors.secondary,
                      paddingVertical: 10,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 7,
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontFamily: "bold" }}>
                    Arrived
                  </Text>
                </TouchableOpacity>
              {/* )} */}
            </View>
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

export default Tracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  backButton: {
    backgroundColor: "#0077B6",
    height: 45,
    width: 45,
    position: "absolute",
    left: 30,
    top: 100,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 80,
  },
  errorText: {
    fontSize: 16,
    color: colors.black2,
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
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
  detailBlock: {
    marginVertical: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  detailMargin: {},
  amountTitle: {
    fontSize: 12,
    color: "#475467",
    fontWeight: "500",
  },
  amountText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "700",
    paddingTop: 1,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 8,
  },
});
