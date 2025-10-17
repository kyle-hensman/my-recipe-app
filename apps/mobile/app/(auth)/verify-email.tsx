import { authStyles } from "@/assets/styles/auth.styles";
import Loading from "@/components/loading";
import { COLORS } from "@/constants/colors";
import { loggedInRedirect } from "@/constants/routes";
import { auth } from "@/services/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const VerifyEmailScreen = ({ email, onBack } : { email: string, onBack: () => void }) => {
  const { verifyCode, status } = auth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  async function handleVerification() {
    if (!code) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const results = await verifyCode(email, code);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (results) {
        console.log("verification successful.");
        router.replace(loggedInRedirect);
      } else {
        Alert.alert("Error", "Failed to verify the code provided.");
        console.log("Code: ", code);
      }
    } catch (error) {
      console.log(error);
      console.log("Code: ", code);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'pending') return <Loading />
  if (status === 'logged-in') router.replace('/');

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView style={authStyles.scrollContent}>
          {/* IMAGE CONTAINER */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
            />
          </View>

          <Text style={authStyles.title}>Verify Your Email</Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>

            {/* VERIFY MESSAGE */}
            {email && <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to `{email}`</Text>}
          </View>

          {/* VERIFICATION CODE INPUT */}
          <View style={authStyles.formContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? "Verifying Now..." : "Verify Email"}</Text>
            </TouchableOpacity>

            {/* LINK TO SIGN UP */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push("/(auth)/sign-up")}
            >
              <Text style={authStyles.link}>Back to Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmailScreen