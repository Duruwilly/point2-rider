import React, { useEffect, useState } from "react";
import Tabs from "./Tabs";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Layout from "../../../layouts/layout";
import { colors } from "../../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScreenContext } from "../context/ScreenContext";
import EmptyBox from "../../../assets/icon/emptyBox.svg";
import Salary from "../../../assets/icon/salary.svg";
import Commision from "../../../assets/icon/commission.svg";
import Bonus from "../../../assets/icon/bonus.svg";
import { ApiRequest } from "../../../services/ApiNetwork";
import { Orders } from "../../../models/Orders";

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
};

const EarningList = () => {
  const insets = useSafeAreaInsets();
  const { selectedTab } = useScreenContext();
  const [queryStatus, setQueryStatus] = useState("");
  const [earnings, setEarnings] = useState({} as Pages);
  const { request } = ApiRequest();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState({ state: false, page: 1, more: true });

  useEffect(() => {
    if (selectedTab === "Salary") {
      setQueryStatus("SALARY");
    }
    if (selectedTab === "Bonus") {
      setQueryStatus("BONUS");
    }
    if (selectedTab === "Tips") {
      setQueryStatus("TIPS");
    }
  }, [selectedTab]);

  const tabs = [
    {
      id: 1,
      title: "All",
      quantityColor: "#9333ea",
      textColor: "#FFFFFF",
    },
    {
      id: 2,
      title: "Salary",
      quantityColor: "#9333ea",
      textColor: "#FFFFFF",
    },
    {
      id: 3,
      title: "Bonus",
      quantityColor: "#F2C94C",
      textColor: "#1D2939",
    },
    {
      id: 4,
      title: "Tips",
      quantityColor: "#F2C94C",
      textColor: "#1D2939",
    },
  ];

  const getEarnings = async (page: number) => {
    try {
      setLoading({ ...loading, state: true });
      setRefreshing(true);
      let url =
        selectedTab === "All"
          ? `/earningsgetorders`
          : `/orders/getorders?status=${queryStatus}`;
      const response = await request("GET", {
        url,
      });
      // console.log("activity", response.data.data.orders);

      if (response.status === "success") {
        setEarnings(response?.data?.data?.orders);
        setLoading({
          page,
          state: false,
          more: earnings?.data?.length < 10 ? false : true,
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
      await getEarnings(loading.page);
    } catch (error) {}
    setRefreshing(false);
  };

  const getMore = () => {
    if (earnings?.links?.next != null) {
      setLoading({ ...loading, state: true });
      getEarnings(loading.page + 1);
    }
  };

  useEffect(() => {
    // getEarnings(loading.page);
  }, [queryStatus, selectedTab]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Text style={[styles.headerText, { paddingTop: 20 }]}>Earnings</Text>
        {/* <View style={[styles.row, styles.container]}>
          <Tabs tabs={tabs} />
        </View> */}
        <Layout.Body>
          <Text style={styles.emptyText}>Coming soon...</Text>
        </Layout.Body>
        {/* {loading.state ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0077B6" />
          </View>
        ) : earnings?.data?.length > 0 ? (
          <Layout.FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={earnings?.data}
            renderItem={({ item }) => {
              return (
                <View style={styles.mainContent}>
                  {<ListData item={item} />}
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
            <View style={styles.emptyBox}>
              <EmptyBox width={60} height={60} />
            </View>
            <Text style={styles.emptyText}>
              You have no recent {"\n"}earnings
            </Text>
          </View>
        )} */}

        {/* {orders?.data?.length > 0 ? (
          <Layout.FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={orders.data}
            renderItem={({ item }) => {
              return (
                <View style={styles.mainContent}>
                  {<ListData item={item} />}
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
            <View style={styles.emptyBox}>
              <EmptyBox width={60} height={60} />
            </View>
            <Text style={styles.emptyText}>
              Start sending packages {"\n"}to see activity here
            </Text>
          </View>
        )} */}
      </Layout>
    </SafeAreaView>
  );
};

const ListData = ({ item }: { item: any }) => {
  return (
    <View key={item.id} style={styles.itemContainer}>
      <View style={styles.itemRow}>
        <View style={styles.itemDetails}>
          <View
            style={[
              styles.itemIconContainer,
              item?.type === "salary" && styles.salaryBg,
              item?.type === "commission" && styles.commissionBg,
              item?.type === "bonus" && styles.bonusBg,
            ]}
          >
            {item?.type === "salary" ? (
              <Salary />
            ) : item?.type === "commission" ? (
              <Commision />
            ) : (
              <Bonus />
            )}
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{item?.title}</Text>
            <Text style={styles.itemDesc}>{item?.desc}</Text>
          </View>
        </View>

        <View style={styles.itemAmountContainer}>
          <Text style={styles.itemAmount}>{item?.amount}</Text>
          <Text
            style={[
              styles.itemStatus,
              item?.status === "Paid" && styles.statusPaid,
              item?.status === "Pending" && styles.statusPending,
            ]}
          >
            {item?.status}
          </Text>
        </View>
      </View>

      <View style={styles.itemDivider}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  container: {
    width: "100%",
    marginTop: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mainContent: {
    position: "relative",
    paddingVertical: 2,
  },
  loadingContainer: {
    flex: 1,
    // height: '70vh',
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 176,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f4fbff",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    color: "#1D2939",
    marginTop: 5,
    fontFamily: "medium",
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginTop: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    width: 52,
    borderRadius: 26,
  },
  salaryBg: {
    backgroundColor: "#EBF8FF",
  },
  commissionBg: {
    backgroundColor: "#ddf0e4",
  },
  bonusBg: {
    backgroundColor: "#EAEAEA",
  },
  itemTextContainer: {
    marginLeft: 12,
  },
  itemTitle: {
    color: "#1D2939",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
  },
  itemDesc: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    marginTop: 4,
    width: 200,
  },
  itemAmountContainer: {
    alignItems: "flex-end",
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "left",
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    marginTop: 4,
  },
  statusPaid: {
    color: "#27AE60",
  },
  statusPending: {
    color: "#F2994A",
  },
  itemDivider: {
    width: "100%",
    height: 0.5,
    backgroundColor: "black",
    opacity: 0.05,
    marginTop: 16,
  },
});

export default EarningList;
