import { View, KeyboardAvoidingView, Platform, Image } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
      <KeyboardAvoidingView
        // style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* IMAGE CONTAINER */}
        <View>
          <Image
            source={require("@/assets/images/react-logo.png")}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Loading