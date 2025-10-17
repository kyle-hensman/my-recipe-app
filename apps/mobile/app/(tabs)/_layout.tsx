import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Recipes",
          headerShown: false,
          headerShadowVisible: false,
          tabBarStyle: {
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          headerShadowVisible: false,
          tabBarStyle: {
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
        />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          headerShown: false,
          headerShadowVisible: false,
          tabBarStyle: {
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabsLayout