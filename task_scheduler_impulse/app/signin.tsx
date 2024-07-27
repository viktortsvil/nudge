import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '../context/AuthContext';

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, user } = useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setError(null); // Reset error state before attempting to sign in
      await signIn(email, password);
      router.push('/(tabs)/tasklist'); // Redirect to TaskListScreen
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'An error occurred during sign in.');
    }
  };

  const navigateToSignUp = () => {
    router.push('/signup'); // Adjust the path to your sign-up screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Scheduler</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Sign In"
        onPress={handleSignIn}
      />
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={navigateToSignUp}>
        <Text style={[styles.signupText, styles.underlineText]}>Sign Up</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  signupContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupText: {
    marginBottom: 8,
    fontSize: 16,
    color: '#000', // Customize text color if needed
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
