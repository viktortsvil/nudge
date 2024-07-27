import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { getLeaderboard } from '../../services/TaskService';
import { theme } from '../../constants/GlobalStyles';
const { width } = Dimensions.get('window');
const ITEM_CONTAINER_WIDTH = width * 0.9; // Adjust the width percentage as needed

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timePeriod, setTimePeriod] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true); // Start loading
      try {
        const data = await getLeaderboard(timePeriod);
        console.log('Fetched data:', data);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false); // End loading
      }
    };
    console.log('Fetching leaderboard for:', timePeriod);
    fetchLeaderboard();
  }, [timePeriod]);

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.completedTasks}>{item.completedTasks}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setTimePeriod('daily')}>
            <Text style={[styles.button, timePeriod === 'daily' && styles.selectedButton]}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimePeriod('weekly')}>
            <Text style={[styles.button, timePeriod === 'weekly' && styles.selectedButton]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimePeriod('monthly')}>
            <Text style={[styles.button, timePeriod === 'monthly' && styles.selectedButton]}>Monthly</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subheading}>
          <Text style={styles.subheadingText}>RANK</Text>
          <Text style={styles.subheadingText}>USER</Text>
          <Text style={styles.subheadingText}>TASKS</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.foreground} />
        ) : (
          <FlatList
            data={leaderboard}
            keyExtractor={(item) => item.userName}
            renderItem={renderLeaderboardItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
    width: '95%',
    maxWidth: 500,
  },
  header: {
    width: '100%',
    textAlign: 'center',
    paddingTop: '5%',
    fontSize: theme.textVariants.header.fontSize,
    fontFamily: theme.textVariants.header.fontFamily,
    color: theme.colors.foreground,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    fontSize: 18,
    padding: 10,
    color: theme.colors.foreground,
  },
  selectedButton: {
    fontWeight: 'bold',
    color: theme.colors.focused,
  },
  subheading: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subheadingText: {
    width: '33%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: theme.textVariants.body.fontSize,
    fontFamily: theme.textVariants.body.fontFamily,
    color: theme.colors.foreground,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    width: ITEM_CONTAINER_WIDTH, // Set the width to a percentage of the screen width
    alignSelf: 'center', // Center the container on the screen
  },
  rank: {
    width: '33%',
    textAlign: 'center',
    fontSize: theme.textVariants.body.fontSize,
    fontFamily: theme.textVariants.body.fontFamily,
    color: theme.colors.foreground,
  },
  userName: {
    width: '33%',
    textAlign: 'center',
    fontSize: theme.textVariants.body.fontSize,
    fontFamily: theme.textVariants.body.fontFamily,
    color: theme.colors.foreground,
  },
  completedTasks: {
    width: '33%',
    textAlign: 'center',
    fontSize: theme.textVariants.body.fontSize,
    fontFamily: theme.textVariants.body.fontFamily,
    color: theme.colors.foreground,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Leaderboard;
