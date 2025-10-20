import { authStyles } from '@/assets/styles/auth.styles';
import Loading from '@/components/loading';
import { COLORS } from '@/constants/colors';
import { loggedInRedirect } from '@/constants/routes';
import { auth } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LogInScreen = () => {
  const { signIn, status } = auth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogIn() {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const results = await signIn(email, password);
    
      if (results) {
        console.log('log in successful');
        router.replace(loggedInRedirect);
      } else {
        Alert.alert('Error', 'Log in failed, please try again.');
      }
    } catch (error) {
      console.log(error);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={authStyles.scrollContent}>
          {/* IMAGE CONTAINER */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require('../../assets/images/i1.png')}
              style={authStyles.image}
            />
          </View>

          <Text style={authStyles.title}>Welcome Back</Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            
            {/* EMAIL INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter email'
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>

            {/* PASSWORD INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter password'
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize='none'
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleLogIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
            </TouchableOpacity>

            {/* LINK TO SIGN UP */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text style={authStyles.linkText}>Don&apos;t have an account? <Text style={authStyles.link}>Sign Up</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default LogInScreen