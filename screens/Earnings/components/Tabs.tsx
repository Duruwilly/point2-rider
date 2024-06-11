import { useScreenContext } from "../context/ScreenContext";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { colors } from "../../../constants/colors";

const Tabs = ({tabs}: {tabs: any[]}) => {
  const { handleTab, selectedTab, setSelectedTab } = useScreenContext();

  useEffect(() => {
    setSelectedTab(tabs[0].title);
  }, []);

  return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={styles.scrollViewContent}
      >
        {tabs.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleTab({ tab: item.title, path: item.title })}
            style={[
              styles.tabButton,
              { borderColor: "#0077B6", backgroundColor: "#EBF8FF" },
              selectedTab === item.title
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            <Text style={styles.tabText}>{item.title}</Text>
            {/* <View
              style={[
                styles.quantityContainer,
                { backgroundColor: item.quantityColor },
              ]}
            >
              <Text style={[styles.quantityText, { color: item.textColor }]}>
                {item.quantity}
              </Text>
            </View> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
  );
};

export default Tabs;
const styles = StyleSheet.create({
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 9999,
    marginHorizontal: 7,
  },
  activeTab: {
    opacity: 1,
  },
  inactiveTab: {
    opacity: 0.4,
  },
  tabText: {
    fontSize: 14,
    color: "#344054",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 9999,
    marginLeft: 6,
  },
  quantityText: {
    fontSize: 12,
  },
});
