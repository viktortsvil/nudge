import { db, storage, auth } from '../firebaseConfig';
import { collection, orderBy, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'; // for unique image names

const tasksCollection = collection(db, 'tasks');

export const getTasks = async (userId) => {
  try {
    const q = query(tasksCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasks;
  } catch (error) {
    console.error("Error getting tasks: ", error);
    return [];
  }
};



export const createTask = async (task, image) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    let imageUrl = null;

    if (image) {
      const imageRef = ref(storage, `tasks/${user.uid}/${uuidv4()}`);
      await uploadBytesResumable(imageRef, image, { contentType: 'image/jpeg' });
      imageUrl = await getDownloadURL(imageRef);
    }

    const taskWithUser = {
      ...task,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      ...(imageUrl && { imageUrl }), // Conditionally add imageUrl if it exists
    };

    const docRef = await addDoc(tasksCollection, taskWithUser);
    return { id: docRef.id, ...taskWithUser };
  } catch (error) {
    console.error('Error creating task: ', error);
    return null;
  }
};
export const updateTask = async (id, task, image) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    let imageUrl = task.image;
    if (image) {
      // TODO: Add logic that prevents uploading images that are too large
      const imageRef = ref(storage, `tasks/${user.uid}/${uuidv4()}`);
      await uploadBytesResumable(imageRef, image,{ contentType: 'image/jpeg' });
      imageUrl = await getDownloadURL(imageRef);
    }

    const taskDoc = doc(tasksCollection, id);
    await updateDoc(taskDoc, { ...task, imageUrl });
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};

export const deleteTask = async (id) => {
  try {
    const taskDoc = doc(tasksCollection, id);
    await deleteDoc(taskDoc);
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};

export const getLeaderboard = async (timePeriod) => {
  const now = Timestamp.now();
  let startDate;

  switch (timePeriod) {
    case 'daily':
      startDate = new Timestamp(now.seconds - 24 * 60 * 60, now.nanoseconds);
      break;
    case 'weekly':
      startDate = new Timestamp(now.seconds - 7 * 24 * 60 * 60, now.nanoseconds);
      break;
    case 'monthly':
      startDate = new Timestamp(now.seconds - 30 * 24 * 60 * 60, now.nanoseconds);
      break;
    default:
      startDate = new Timestamp(now.seconds - 24 * 60 * 60, now.nanoseconds);
  }

  const leaderboardQuery = query(
    tasksCollection,
    where('completed', '==', true),
    where('completedAt', '>=', startDate),
    orderBy('completedAt', 'desc') // Order by completedAt descending
  );
  const querySnapshot = await getDocs(leaderboardQuery);

  const userTaskCount = {};

  querySnapshot.forEach(doc => {
    const task = doc.data();
    const userName = task.userName;

    if (!userName) {
      console.warn(`Task ${doc.id} is missing userName field`);
      return;
    }

    if (!task.completedAt) {
      console.warn(`Task ${doc.id} is missing completedAt field`);
      return;
    }

    if (!userTaskCount[userName]) {
      userTaskCount[userName] = 0;
    }
    userTaskCount[userName] += 1;
  });

  const leaderboard = Object.keys(userTaskCount).map(userName => ({
    userName,
    completedTasks: userTaskCount[userName],
  }));

  leaderboard.sort((a, b) => b.completedTasks - a.completedTasks);

  return leaderboard;
};
