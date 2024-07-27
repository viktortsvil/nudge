import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSession } from '../../context/AuthContext';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

const AppLayout = ({ children }) => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/signin" />;
  }

  return children;
};

export default function TabLayout() {
  return (
    <AppLayout>
      <Tabs
        screenOptions={{ tabBarActiveTintColor: 'blue' }}
      >
        <Tabs.Screen
          name="tasklist"
          options={{
            title: 'Task List',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="tasks" color={color} />,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="trophy" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
          }}
        />
      </Tabs>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
