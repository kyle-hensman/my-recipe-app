import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Platform } from 'react-native';
import { COLORS } from '@/constants/colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{
          flex: 1,
          backgroundColor: COLORS.background,
          bottom: Platform.OS === 'android' ? -25 : 0,
        }}>
          <Slot />
      </SafeAreaView>
    </ThemeProvider>
  );
}
