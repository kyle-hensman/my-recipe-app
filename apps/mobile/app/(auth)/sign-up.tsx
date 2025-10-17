import { authStyles } from '@/assets/styles/auth.styles';
import { COLORS } from '@/constants/colors';
import { auth } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import VerifyEmailScreen from './verify-email';
import Loading from '@/components/loading';

const SignUpScreen = () => {
  const { signUp, status } = auth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);


  async function handleSignUp() {
    if (!email || !password) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }
    
    if (password.length < 6) {
      return Alert.alert('Error', 'Password must be at least 6 characters.');
    }

    setLoading(true);

    try {
      const results = await signUp(name, email, password);

      if (results) {
        console.log('sign up was successful.');
        setPendingVerification(true);
      } else {
        Alert.alert('Error', 'Failed to create account.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'pending') return <Loading />
  if (status === 'logged-in') router.replace('/');

  if (pendingVerification) return <VerifyEmailScreen email={email} onBack={() => setPendingVerification(false)} />

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
              source={require('../../assets/images/i2.png')}
              style={authStyles.image}
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>

            {/* EMAIL INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter name'
                placeholderTextColor={COLORS.textLight}
                value={name}
                onChangeText={setName}
              />
            </View>

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
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? 'Signin Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            {/* LINK TO SIGN UP */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push('/(auth)/log-in')}
            >
              <Text style={authStyles.linkText}>Already an account? <Text style={authStyles.link}>Log In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUpScreen