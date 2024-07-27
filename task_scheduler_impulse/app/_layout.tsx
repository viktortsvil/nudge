import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

const Layout: React.FC = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
};

export default Layout;
