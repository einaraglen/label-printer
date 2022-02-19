import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc } from "firebase/firestore/lite";

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

  const addArchive = async () => {
    const archive = collection(db, "archive");
    const snapshot = await getDocs(archive);
    const archive_list = snapshot.docs.map((doc) => doc.data());
    console.log(archive_list);
  };

  return { addArchive };
};

export default FirebaseHandler;
