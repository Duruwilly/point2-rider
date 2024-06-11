import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
// import Delivered from "../../assets/icon/delivered.svg";
// import Picked from "../../assets/icon/picked.svg";
// import Completed from "../../assets/icon/complete.svg";
import { ApiRequest } from "../../services/ApiNetwork";

export type NotificationsType = {
  id: number;
  status: string;
  message: string;
  message_body: string;
  estimated_time: string;
};

type Pages = {
  data: NotificationsType[];
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

// type DummyNotificationsType = {
//   id: number;
//   status_i: string;
//   icons: any;
//   message: string;
//   status: string;
//   message_body: string;
//   estimated_time: string;
// };

const Notifications = () => {
  const insets = useSafeAreaInsets();
  const { request } = ApiRequest();
  const [notifications, setNotifications] = useState({} as Pages);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState({ state: false, page: 1, more: true });

  const navigation: any = useNavigation();
  const isFocused = useIsFocused();

  const getNotifications = async (page: number) => {
    setRefreshing(true);
    setLoading({ ...loading, state: true });
    try {
      const response = await request("GET", { url: "/notifications" });

      if (response.status === "success") {
        setNotifications(response.data.data);
        setRefreshing(false);
        setLoading({
          page,
          state: false,
          more: notifications.data.length < 10 ? false : true,
        });
      } else {
        setLoading({ ...loading, state: false });
        setRefreshing(false);
      }
    } catch (error) {
      setRefreshing(false);
      setLoading({ ...loading, state: false });
    }
  };

  const handleRefreshing = async () => {
    try {
      setRefreshing(true);
      await getNotifications(loading?.page);
    } catch (error) {}
    setRefreshing(false);
  };

  const getMore = () => {
    if (notifications?.links?.next != null) {
      setLoading({ ...loading, state: true });
      getNotifications(loading.page + 1);
    }
  };

  useEffect(() => {
    getNotifications(loading.page);
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Text style={[styles.headerText, { paddingTop: 20 }]}>
          Notifications
        </Text>
        {loading.state ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0077B6" />
          </View>
        ) : notifications?.data?.length > 0 ? (
          <Layout.FlatList
            data={notifications.data}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.notificationContainer}>
                  <NotificationList item={item} />
                </View>
              );
            }}
            keyExtractor={(item) => item?.id.toString()}
            onEndReached={getMore}
            onEndReachedThreshold={0.1}
            alwaysBounceVertical={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefreshing}
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You have no recent {"\n"}notifications
            </Text>
          </View>
        )}
      </Layout>
    </SafeAreaView>
  );
};

const NotificationList = ({ item }: { item: NotificationsType }) => {
  const navigation: any = useNavigation();
  const { request } = ApiRequest();

  const handleSingleItem = async (item: NotificationsType) => {
    const itemId = item?.id;

    const response = await request("POST", {
      url: `/notifications/read`,
      payload: { id: itemId },
    });
    const { data, status } = response;

    if (status === "success") {
      navigation.navigate("view-notification-details", { data: item });
    }
  };

  return (
    <>
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          key={item.id}
          onPress={() => handleSingleItem(item)}
          style={styles.notification}
        >
          {/* <View
            style={[
              styles.iconContainer,
              item.status_id === "delivered"
                ? styles.delivered
                : item.status_id === "in_transit"
                ? styles.inTransit
                : item.status_id === "pending" && styles.pending,
            ]}
          >
            {item.icons}
          </View> */}
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              {item.message}{" "}
              <Text style={styles.notificationStatus}>{item.status}</Text>
            </Text>
            <Text style={styles.notificationText}>
              {item.message_body}{" "}
              <Text style={styles.estimatedTime}>{item.estimated_time}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    // height: '70vh',
    alignItems: "center",
    justifyContent: "center",
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
  iconContainer: {
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  delivered: {
    backgroundColor: "#DBF3E5",
  },
  inTransit: {
    backgroundColor: "#EBF8FF",
  },
  pending: {
    backgroundColor: "#FBF1D2",
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
});
export default Notifications;
