import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "../../layouts/layout";
import { colors } from "../../constants/colors";
import DeliveriesHistory from "./DeliveriesHistory";
import { ApiRequest } from "../../services/ApiNetwork";
import { Orders } from "../../models/Orders";
import Bike from "../../assets/icon/Character.svg";
import Base from "../../assets/icon/base.svg";
import Bag from "../../assets/icon/bag.svg";
import { Feather, Octicons, MaterialIcons } from "@expo/vector-icons";

type Pages = {
  data: Orders[];
  links: { first: string; last: string; prev: string; next: string };
  meta: {
    per_page: number;
    to: number;
    total: number;
    from: string;
    last_page: number;
    current_page: number;
  };
  stat: {
    all_orders_count: number;
    declined_orders_count: number;
    delivered_orders_count: number;
  };
};

const Deliveries = () => {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState({} as Pages);
  const { request } = ApiRequest();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState({ state: false, page: 1, more: true });

  const [dropdown, setDropdown] = useState(false);

  const items = ["Last Month", "Last 3 Months", "This Month", "Last Year"];

  const handleSelect = (item: string) => {
    setStatus(item);
    setDropdown(false);
  };

  let queryStatus = "";

  if (status === "Last Month") {
    queryStatus = "last-month";
  }

  if (status === "Last 3 Months") {
    queryStatus = "last-3months";
  }
  if (status === "This Month") {
    queryStatus = "this-month";
  }
  if (status === "Last Year") {
    queryStatus = "last-year";
  }

  const getorders = async (page: number) => {
    try {
      setLoading({ ...loading, state: true });
      setRefreshing(true);
      let url =
        status === ""
          ? `/rider/getorders?status=DELIVERED`
          : `/rider/getorders?range=${queryStatus}`;
      const response = await request("GET", {
        url,
      });
      console.log("deliveries", response.data?.data);

      if (response.status === "success") {
        setOrders(response?.data?.data);
        setLoading({
          page,
          state: false,
          more: orders?.data?.length < 10 ? false : true,
        });
      }
    } catch (error) {
      console.log("error fetchinr activities", error);
      setLoading({ ...loading, state: false });
    } finally {
      setLoading({ ...loading, state: false });
      setRefreshing(false);
    }
  };

  const handleRefreshing = async () => {
    try {
      setRefreshing(true);
      await getorders(loading.page);
    } catch (error) {}
    setRefreshing(false);
  };

  const getMore = () => {
    if (orders.links?.next != null) {
      setLoading({ ...loading, state: true });
      getorders(loading.page + 1);
    }
  };

  useEffect(() => {
    getorders(loading.page);
  }, [status]);

  // useEffect(() => {
  //   setStatus("DELIVERED")
  // }, [])

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Text style={[styles.headerText, { paddingTop: 20 }]}>Deliveries</Text>
        {/* <View style={{ paddingHorizontal: 0 }}> */}
        <View style={styles.container}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Bag />
                <Text style={styles.summaryText}>TOTAL ORDER RECEIVED</Text>
              </View>
              <Text style={styles.summaryValue}>{orders?.stat?.all_orders_count}</Text>
            </View>

            <View style={styles.ordersRow}>
              <View style={[styles.orderBox, styles.deliveredBox]}>
                <View style={styles.orderRow}>
                  <Bag />
                  <Text style={styles.orderText}>ORDERS DELIVERED</Text>
                </View>
                <Text style={styles.orderValue}>{orders?.stat?.delivered_orders_count}</Text>
              </View>

              <View style={[styles.orderBox, styles.declinedBox]}>
                <View style={styles.orderRow}>
                  <Bag />
                  <Text style={styles.orderText}>ORDERS DECLINED</Text>
                </View>
                <Text style={styles.orderValue}>{orders?.stat?.declined_orders_count}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider}></View>
          <View style={styles.dropdownContainer}>
            <Pressable
              onPress={() => setDropdown(!dropdown)}
              style={styles.dropdownButton}
            >
              <Text style={styles.dropdownText}>
                {status === "" ? "Selct range" : status}
              </Text>
              {dropdown ? (
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={20}
                  color="#1D2939"
                />
              ) : (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#1D2939"
                />
              )}
            </Pressable>
            {dropdown && (
              <View style={styles.dropdownMenu}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => handleSelect(item)}
                    style={styles.dropdownMenuItem}
                  >
                    <Text style={styles.dropdownMenuItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {loading.state ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0077B6" />
            </View>
          ) : orders?.data?.length > 0 ? (
            <Layout.FlatList
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              data={orders.data}
              renderItem={({ item }) => {
                return (
                  <View style={styles.mainContent}>
                    {<DeliveriesHistory item={item} />}
                  </View>
                );
              }}
              alwaysBounceVertical={false}
              onEndReached={getMore}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefreshing}
                />
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyContent}>
                <View style={styles.emptyIconContainer}>
                  <Bike />
                  <Base />
                </View>
                <Text style={styles.noOrdersText}>
                  No deliveries available for {"\n"} you at the moment
                </Text>
                <TouchableOpacity
                  onPress={() => getorders(loading.page)}
                  style={styles.refreshButton}
                >
                  <Feather name="refresh-ccw" size={18} color="#344054" />
                  <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {/* </View> */}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    // fontWeight: "bold",
    fontSize: 24,
    textAlign: "left",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  title: {
    color: "#1D2939",
    fontSize: 24,
    fontWeight: "500",
    width: "100%",
    textAlign: "left",
    paddingHorizontal: 20,
  },
  summaryContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
  },
  summaryBox: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    height: 96,
    borderRadius: 12,
    // marginTop: 24,
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  summaryText: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 8,
  },
  summaryValue: {
    color: "#1D2939",
    fontSize: 36,
    fontWeight: "700",
  },
  ordersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
  },
  orderBox: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "48.5%",
    height: 96,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  deliveredBox: {
    backgroundColor: "#EBF8FF",
  },
  declinedBox: {
    backgroundColor: "#FFB4B4" + 60,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  orderText: {
    color: "#667085",
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 8,
  },
  orderValue: {
    color: "#1D2939",
    fontSize: 36,
    fontWeight: "700",
  },
  divider: {
    width: "100%",
    height: 0.5,
    backgroundColor: "black",
    opacity: 0.1,
    marginTop: 24,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    // height: '70vh',
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainer: {
    zIndex: 9999,
    position: "relative",
    width: "100%",
    paddingHorizontal: 20,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 107,
    height: 42,
    borderWidth: 1,
    borderColor: "#0077B6",
    borderRadius: 8,
  },
  dropdownText: {
    color: "#1D2939",
    fontSize: 12,
    fontWeight: "500",
    marginRight: 4,
  },
  dropdownMenu: {
    position: "absolute",
    left: 20,
    top: 44,
    // zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 107,
    borderRadius: 8,
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  dropdownMenuItem: {
    width: "100%",
    paddingVertical: 10,
  },
  dropdownMenuItemText: {
    color: "#1D2939",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "left",
  },
  mainContent: {
    position: "relative",
    paddingVertical: 2,
    // paddingHorizontal: 20
  },
  emptyContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    //   marginTop: 176,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    color: "#1D2939",
    marginTop: 5,
    fontFamily: "medium",
  },
  emptyContent: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    // marginTop: 100,
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
});

export default Deliveries;
