import { View, KeyboardAvoidingView, Platform, Image, Animated, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { loadingStyles } from '@/assets/styles/loading.styles'
import { COLORS } from '@/constants/colors';

const Loading = () => {
  const rotateValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 720, // Two full rotations
        duration: 4000, // Takes 4 seconds for two rotations
        useNativeDriver: true,
      })
    ).start();

    return () => {
      rotateValue.stopAnimation();
    };
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 720],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <View style={loadingStyles.container}>
      <KeyboardAvoidingView
        // style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Animated.View
          style={{ transform: [{ rotate }] }}
        >
          <View style={loadingStyles.loadingImageContainer}>
            <Image
              source={require("@/assets/images/loading.png")}
              style={loadingStyles.loadingImage}
            />
          </View>
        </Animated.View>
        {/* <ActivityIndicator size={100} color={COLORS.primary} /> */}
      </KeyboardAvoidingView>
    </View>
  )
}

export default Loading