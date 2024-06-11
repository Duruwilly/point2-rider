import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  PixelRatio,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../../constants/colors";

const Welcome = ({ navigation }: any) => {
  const onboarders: { text: string; img: any; title: string }[] = [
    {
      img: require("../../assets/icon.png"),
      title: "Point2",
      text: `Become a Point2 Rider \n with easy steps`,
    },
    {
      img: require("../../assets/icon.png"),
      title: "Point2",
      text: "View and track your earnings \n and commissions",
    },
    {
      img: require("../../assets/icon.png"),
      title: "Point2",
      text: "Transperancy between \n riders and company",
    },
  ];

  const scrollRef: any = useRef();
  const viewRef: any = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <View style={styles.fullWidth}>
      <ScrollView
        style={styles.fullWidth}
        pagingEnabled
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const slideIndex = Math.max(
            0,
            Math.floor(nativeEvent.contentOffset.x / width)
          );
          setCurrentSlide(slideIndex);
        }}
        ref={scrollRef}
      >
        {onboarders.map((item, index) => (
          <View key={index} style={styles.image}>
            <View style={styles.imgOverlay}>
              <Image
                source={item.img}
                style={{ alignSelf: "center", marginBottom: 10 }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: colors.primary,
                  fontWeight: "700",
                  fontSize: 48,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: 6,
                  fontWeight: "600",
                  marginBottom: 40,
                  alignSelf: "center",
                  textAlign: "center"
                }}
              >
                RIDER
              </Text>
              <Text style={[styles.infoText]}>
                {onboarders[currentSlide]?.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.overlay} ref={viewRef}>
        <View style={{ gap: 10, width: "90%" }}>
          <View style={styles.indicatorContainer}>
            {onboarders.map((item, index) => (
              <View
                style={[
                  styles.indicator,
                  currentSlide == index ? styles.activeIndicator : null,
                ]}
                key={"indicator-" + index}
              ></View>
            ))}
          </View>
          <Button
            style={{ borderRadius: 10, padding: 3 }}
            labelStyle={{
              fontWeight: "bold",
              alignSelf: "center",
              width: "100%",
              textAlign: "center",
            }}
            buttonColor={colors.primary}
            mode="contained"
            textColor="white"
            onPress={() => navigation.navigate("login")}
          >
            Login
          </Button>
          <Button
            style={{ borderRadius: 10, padding: 3 }}
            labelStyle={{ fontWeight: "bold", flex: 1 }}
            buttonColor={colors.secondary}
            mode="contained"
            textColor={colors.primary}
            onPress={() => navigation.navigate("register")}
          >
            Create Account
          </Button>
          <Text style={{ alignSelf: "center", marginTop: 50 }}>
            <Text style={{ color: "#98A2B3", textAlign: "center" }}>
              By continuing, you agree to Point2
            </Text>
            {`\n`}
            <Text style={{ color: "#344054", textAlign: "center" }}>
              Terms & Condition
            </Text>
            <Text style={{ color: "#98A2B3", textAlign: "center" }}> and</Text>
            <Text style={{ color: "#344054", textAlign: "center" }}>
              {" "}
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("screen");

const fontScale = PixelRatio.getFontScale();

const getFontSize = (size: number) => size / fontScale;

const styles = StyleSheet.create({
  fullWidth: {
    width,
    height,
    backgroundColor: "white",
  },

  image: {
    width,
    height,
    resizeMode: "cover",
  },

  imgOverlay: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },

  activeIndicator: {
    backgroundColor: colors.primary,
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  indicator: {
    backgroundColor: "#759CB1" + "cc",
    height: 6,
    width: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },

  indicatorContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width,
    height: 300,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  infoText: {
    color: "#344054",
    fontSize: getFontSize(16),
    fontWeight: "500",
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    height: 320,
  },
});
export default Welcome;
