import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const Splash = () => {
  const navigation: any = useNavigation();

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

  // navigate to second screen after 2 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.navigate("welcome");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

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
      <View style={styles.innerCircle}>
        <Text style={[styles.text, styles.dot]}>.</Text>
        <Text style={[styles.text, styles.number]}>2</Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: 'white',
    },
    ping: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: 130,
        borderRadius: 9999,
        backgroundColor: '#D9EBf4',
        padding: 10,
      },
    innerCircle: {
      position: 'absolute',
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: '#0077B6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'white',
      fontSize: 24,
    },
    dot: {
      marginBottom: 3,
    },
    number: {
      fontWeight: 'bold',
    },
  });
