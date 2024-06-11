import React, { ReactNode, RefAttributes, forwardRef } from "react";
// import { Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FlatList as ReactFlatList,
  FlatListProps,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView as ReactScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  Text,
  ViewProps,
  Platform,
} from "react-native";

interface LayoutHeaderProps extends RefAttributes<View>, ViewProps {
  style?: StyleProp<any> | null;
  back?: Function | null;
  backIcon?: keyof typeof Feather.glyphMap;
}

interface LayoutBodyProps
  extends ScrollViewProps,
    RefAttributes<ReactScrollView> {
  children?: ReactNode;
}
interface LayoutRootProps extends ViewProps, RefAttributes<View> {
  children?: ReactNode;
}

interface LayoutFlatListProps
  extends FlatListProps<any>,
    RefAttributes<ReactFlatList> {}
interface LayoutScrollViewProps
  extends ScrollViewProps,
    RefAttributes<ReactScrollView> {}

function LayoutHeader({
  style,
  ...rest
}: LayoutHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={{paddingTop: 20, paddingHorizontal: 20}}>
    <Pressable onPress={() => rest.back ? rest.back() : navigation.goBack()} style={{flexDirection: "row", alignItems: "center", gap: 10}}>
      <Feather name="arrow-left" size={24} color="black" />
      <Text style={{fontWeight: "700", fontSize: 16}}>Back</Text>
    </Pressable>
  </View>
  );
}

function LayoutBody({ style, children, ...rest }: LayoutBodyProps) {
  const insets = useSafeAreaInsets();

  return (
    <ReactScrollView
    alwaysBounceVertical={false}
      style={{ ...(style as Object), ...styles.mainContent }}
      contentContainerStyle={{
        gap: 15,
        ...(rest.contentContainerStyle as Object),
        paddingBottom: insets.bottom + (Platform.OS == "android" ? 20 : 0),
      }}
      {...rest}
    >
      {children}
    </ReactScrollView>
  );
}

function LayoutScrollView(props: LayoutScrollViewProps) {
  const insets = useSafeAreaInsets();
  const { style, children, ...rest } = props;

  return (
    <ReactScrollView
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      style={{ ...(style as Object), ...styles.mainContent }}
      contentContainerStyle={{
        gap: 15,
        ...(rest.contentContainerStyle as Object),
        paddingBottom: insets.bottom + 30,
      }}
      {...rest}
    >
      {children}
    </ReactScrollView>
  );
}

function LayoutFlatList(props: LayoutFlatListProps) {
  const insets = useSafeAreaInsets();
  const { contentContainerStyle, ...rest } = props;
  return (
    <ReactFlatList
      contentContainerStyle={{
        ...(contentContainerStyle as Object),
        ...styles.mainContent,
        paddingBottom: insets.bottom + (Platform.OS == "android" ? 20 : 0),
      }}
      {...props}
    />
  );
}

function LayoutRoot({ style, children, ...rest }: LayoutRootProps) {
  return (
    <View style={{ ...(style as Object), flex: 1 }} {...rest}>
      {children}
    </View>
  );
}

const Header = forwardRef<View, LayoutHeaderProps>((props, ref) => (
  <LayoutHeader {...props} ref={ref as any} />
));
const Body = forwardRef<ReactScrollView, LayoutBodyProps>((props, ref) => (
  <LayoutBody {...props} ref={ref as any} />
));
const Root = forwardRef<View, LayoutRootProps>((props, ref) => (
  <LayoutRoot {...props} ref={ref as any} />
));
const FlatList = forwardRef<ReactFlatList, LayoutFlatListProps>(
  (props, ref) => <LayoutFlatList {...props} ref={ref as any} />
);
const ScrollView = forwardRef<ReactScrollView, LayoutScrollViewProps>(
  (props, ref) => <LayoutScrollView {...props} ref={ref as any} />
);

const Layout = Object.assign(Root, { Header, Body, ScrollView, FlatList });

export default Layout;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    position: "relative",
  },
  leftIcon: {
    left: 15,
  },
  headerMainContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTextContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
  headerTextDesc: {
    color: "white",
    flex: 1,
  },

  mainContent: {
    position: "relative",
    padding: 20,
  },
});
