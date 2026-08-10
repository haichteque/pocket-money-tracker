/**
 * Root layout — wraps the app in the EntriesProvider and configures
 * the Expo Router stack with a dark theme.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EntriesProvider } from '@/context/EntriesContext';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <EntriesProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="create"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="entry/[id]" />
        <Stack.Screen
          name="edit/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </EntriesProvider>
  );
}
