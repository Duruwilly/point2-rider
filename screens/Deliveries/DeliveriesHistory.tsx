import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import Box from "../../assets/icon/box.svg";
import { Orders } from "../../models/Orders";

const DeliveriesHistory = ({ item }: { item: Orders }) => {

  return (
    <View>
      <View style={styles.ordersContainer}>
        <View key={item?.id} style={styles.orderItemContainer}>
          <View style={styles.orderItemRow}>
            <View style={styles.orderItemDetails}>
              <View style={styles.orderItemIconContainer}>
                <Box width={19.2} />
              </View>
              <View style={styles.orderItemTextContainer}>
                <Text style={styles.orderItemTitle}>{item?.package_name}</Text>
                <Text style={styles.orderItemSubtitle}>
                  Tracking ID: {item?.tracking_id}
                </Text>
              </View>
            </View>
            <View style={styles.orderItemStatusContainer}>
              <Text
                style={[
                  styles.orderItemStatusText,
                  item?.status === "DELIVERED" && styles.statusDelivered,
                  item?.status === "INTRANSIT" && styles.statusInTransit,
                  item?.status === "CANCELLED" && styles.statusCancelled,
                ]}
              >
                {item?.status === "INTRANSIT"
                  ? "In-transit"
                  : item?.status === "DELIVERED"
                  ? "Completed"
                  : item?.status === "CANCELLED" && "Cancelled"}
              </Text>
            </View>
          </View>
          <View style={styles.orderItemDivider}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ordersContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  orderItemContainer: {
    width: "100%",
    marginTop: 12,
  },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  orderItemDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderItemIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: "#EBF8FF",
  },
  orderItemTextContainer: {
    marginLeft: 12,
  },
  orderItemTitle: {
    color: "#344054",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "left",
  },
  orderItemSubtitle: {
    color: "#1D2939",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "left",
    marginTop: 8,
    width: 200,
  },
  orderItemStatusContainer: {
    alignItems: "center",
  },
  orderItemStatusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusDelivered: {
    color: "#27AE60",
  },
  statusInTransit: {
    color: "#F2C94C",
  },
  statusCancelled: {
    color: "#f2654c",
  },
  orderItemDivider: {
    width: "100%",
    height: 0.5,
    backgroundColor: "black",
    opacity: 0.05,
    marginTop: 16,
  },
});

export default DeliveriesHistory;
