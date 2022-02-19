import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, Timestamp } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  //databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

const FirebaseHandler = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const addArchive = async (user_email: string, ifs_page: string, label_count: number, label_images: string[]) => {
    await addDoc(collection(db, "archive"), {
        user_email,
        ifs_page,
        label_count,
        label_images,
        printed_at: Timestamp.fromDate(new Date())
      });
  };

  return { addArchive };
};

export default FirebaseHandler;
