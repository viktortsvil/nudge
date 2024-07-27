import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useSession } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const { signOut, user } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const storedName = await AsyncStorage.getItem('userName');
        setName(storedName || user.displayName || '');
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    //   router.push('/signin'); // Redirect to sign-in screen after sign out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{name}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  displayText: {
    height: 40,
    fontSize: 18,
    paddingHorizontal: 8,
    width: '100%',
    textAlignVertical: 'center',
  },
});

export default ProfileScreen;
