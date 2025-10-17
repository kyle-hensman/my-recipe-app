import React from 'react'
import { Text, View } from 'react-native'

import { COLORS } from '@/constants/colors'
import { auth } from '@/services/auth'
import Loading from '@/components/loading'
import { useRouter } from 'expo-router'

const HomeScreen = () => {
  const { status } = auth();
  const router = useRouter();

  if (status === 'pending') return <Loading />
  if (status === 'logged-in') router.replace('/');

  return (
    <View style={{ backgroundColor: COLORS.background }}>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen