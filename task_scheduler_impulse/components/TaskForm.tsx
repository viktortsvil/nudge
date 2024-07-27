import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Dimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

const TaskForm = ({ task, onSubmit, onCancel, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [image, setImage] = useState(task.image); // Use imageUrl
  const [createdAt, setCreatedAt] = useState(task.createdAt);
  const [completedAt, setCompletedAt] = useState(task.completedAt);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setImage(task.image); // Use imageUrl
    setCreatedAt(task.createdAt);
    setCompletedAt(task.completedAt);
  }, [task]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Correctly get the URI from the result
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit({ ...task, title, description, image }); // Ensure the imageUrl is passed
    setIsLoading(false);
  };

  const { width } = Dimensions.get('window');
  const imageSize = width * 0.9;

  return (
    <View style={styles.formContainer}>
      <View style={styles.modalHeader}>
        <Button title="Cancel" onPress={onCancel} />
        <Text style={styles.modalTitle}>{task?.id ? 'Edit Task' : 'Add Task'}</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Button title="Done" onPress={handleSubmit} disabled={isLoading} />
        )}
      </View>
      <View style={styles.form}>
        {image && <Image source={{ uri: image }} style={[styles.image, { width: imageSize, height: imageSize * 0.75 }]} />}
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Pick Image" onPress={handleImagePick} />
        {task?.id && <Button title="Delete" onPress={() => onDelete(task.id)} color="red" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    height: '100%',
    width: '100%',
  },
  form: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '90%',
  },
  image: {
    marginVertical: 10,
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateContainer: {
    marginVertical: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default TaskForm;
