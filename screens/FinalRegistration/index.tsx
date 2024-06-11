import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../../constants/colors";
import { setIsAuthentication } from "../../store/reducers/users-reducer";
import { useDispatch } from "react-redux";

const FinalRegistration = ({ route }: any) => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  // Create an animated value
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define the animation sequence
    Animated.loop(
      Animated.sequence([
        // Reset to initial value if needed
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        // Animate to final values
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000, // Duration of the animation
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1, // Loop indefinitely
      }
    ).start();
  }, [animatedValue]);

  // Interpolate values for scaling and opacity
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5], // Scale up from original size to double
  });
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0], // Fade out animation
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.ping,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      <View style={styles.innerCircle}></View>
      <View style={styles.textContainer}>
        <Text style={styles.successText}>Welcome, {route?.params?.name}</Text>
        <Text style={{ color: "#475467", fontSize: 15, fontWeight: "500", textAlign: "center" }}>
          Proceed to your account dashboard to start picking up orders
        </Text>
      </View>
      <Button
        style={styles.button}
        labelStyle={{ fontWeight: "bold", flex: 1 }}
        buttonColor={colors.primary}
        mode="contained"
        textColor="white"
        onPress={() => {
          dispatch(setIsAuthentication(true));
          navigation.navigate("tab");
        }}
      >
        Go home
      </Button>
    </View>
  );
};

export default FinalRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
  },
  ping: {
    position: "absolute",
    top: 200,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#cdf4dd",
    padding: 10,
  },
  innerCircle: {
    position: "absolute",
    top: 260,
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "#27ae60",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    width: "80%",
    marginTop: 300,
    alignItems: "center",
  },
  successText: {
    fontWeight: "700",
    fontSize: 30,
    textAlign: "center",
  },
  button: {
    borderRadius: 10,
    padding: 3,
    marginTop: 40,
    alignSelf: "stretch",
    marginHorizontal: 20,
  },
});
