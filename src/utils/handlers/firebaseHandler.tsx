import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, Timestamp } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

interface LabelArchive {
  username: string;
  ifs_page: string;
  label_count: number;
  label_images: string[];
  printed_at?: any
}

const FirebaseHandler = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const addUser = async (username: string) => {
    try {
      let path = `users`
      await addDoc(collection(db, path), {
        username,
        created_at: Timestamp.fromDate(new Date())
      });
    } catch (err: any) {
      console.warn(err)
    }
  }

  const addArchive = async ({ username, ifs_page, label_count, label_images }: LabelArchive) => {
    try {
      let now = new Date();
      let path = `archive/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/entries`
      await addDoc(collection(db, path), {
        username,
        ifs_page,
        label_count,
        label_images,
        printed_at: Timestamp.fromDate(new Date())
      });
    } catch (err: any) {
      console.warn(err)
    }
  };

  const addFailure = async ({ statuscode, name, message }: any) => {
    try {
      let now = new Date();
      let path = `failures/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/entries`
      await addDoc(collection(db, path), {
        statuscode,
        name,
        message,
        created_at: Timestamp.fromDate(new Date())
      });
    } catch (err: any) {
      console.warn(err)
    }
  };

  return { addArchive, addFailure, addUser };
};

export default FirebaseHandler;
