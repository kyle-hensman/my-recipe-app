import { COLORS } from '@/constants/colors';
import React, { ReactNode } from 'react'
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({ children }: { children: ReactNode}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: COLORS.background,
      }}>
        {children}
    </View>
  )
}

export default SafeScreen