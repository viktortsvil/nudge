import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity, Modal } from 'react-native';
import { getTasks, createTask, updateTask, deleteTask } from '../../services/TaskService';
import { auth } from '../../firebaseConfig';
import TaskForm from '../../components/TaskForm';
import { Image } from 'expo-image';
import Checkbox from 'expo-checkbox';

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser;
      if (user) {
        const tasks = await getTasks(user.uid);
        setTasks(tasks);
      }
    };
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchTasks();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async (task) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
    const createdTask = await createTask({ ...task, userId: user.uid, createdAt: new Date() }, task.image); // Use imageUrl
    if (createdTask) {
      console.log('createdTask', createdTask.image)
      setTasks([...tasks, createdTask]);
      setModalVisible(false);
    }
  };

  const handleUpdateTask = async (id, task) => {
    await updateTask(id, task, task.image); // Use imageUrl
    setTasks(tasks.map(t => (t.id === id ? { ...t, ...task } : t)));
    setModalVisible(false);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
    setModalVisible(false); // Close the modal after deletion
  };

  const handleCompleteTask = async (id, completed) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const completedAt = completed ? new Date() : null;
      await updateTask(id, { ...updatedTask, completed, completedAt });
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed, completedAt } : task)));
    }
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => { setCurrentTask(item); setModalVisible(true); }} style={styles.taskBubble}>
      <Checkbox
        value={item.completed}
        onValueChange={(newValue) => handleCompleteTask(item.id, newValue)}
        style={styles.checkbox}
      />
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      </View>
    </TouchableOpacity>
  );

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const ListHeaderComponent = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>In Progress</Text>
        <Button title="Add" onPress={() => { setCurrentTask({ title: '', description: '', completed: false, createdAt: new Date(), userId: auth.currentUser.uid}); setModalVisible(true); }} />
      </View>
    </View>
  );

  const ListFooterComponent = () => (
    <View>
      <Text style={styles.heading}>Completed Tasks</Text>
    </View>
  );

  const tasksWithSeparators = [
    ...incompleteTasks,
    { isSeparator: true }, // Add a separator object
    ...completedTasks,
  ];

  const renderItem = ({ item }) => {
    if (item.isSeparator) {
      return <ListFooterComponent />;
    }
    return renderTask({ item });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={tasksWithSeparators}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentTask(null);
        }}
      >
        <View style={styles.modalView}>
          {currentTask && (
            <TaskForm
              task={currentTask}
              onSubmit={(task) => {
                if (currentTask.id) {
                  handleUpdateTask(currentTask.id, task);
                } else {
                  handleAddTask(task);
                }
              }}
              onCancel={() => { setCurrentTask(null); setModalVisible(false); }}
              onDelete={() => handleDeleteTask(currentTask.id)} // Ensure the correct task ID is passed
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskDescription: {
    color: 'grey',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TaskListScreen;
