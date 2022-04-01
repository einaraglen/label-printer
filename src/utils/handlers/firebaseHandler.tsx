import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, Timestamp } from "firebase/firestore/lite";
import ReduxAccessor from "../../store/accessor";
import packagejson from "../../../package.json";
import { LogType } from "../enums";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

const FirebaseHandler = () => {
  const { username, log } = ReduxAccessor();
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const addUser = async (username: string) => {
    try {
      let path = `users`;
      await addDoc(collection(db, path), {
        username,
        created_at: Timestamp.fromDate(new Date()),
      });
    } catch (err: any) {
      console.warn(err);
      log(LogType.Failure, "Add User", err.toString());
    }
  };

  interface LabelArchive {
    version?: string;
    username?: string;
    ifs_page: string;
    label_count: number;
    label_images: string[];
    printed_at?: any;
  }

  const addArchive = async ({ ifs_page, label_count, label_images }: LabelArchive) => {
    try {
      let now = new Date();
      let path = `archive/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/entries`;
      await addDoc(collection(db, path), {
        version: packagejson.version,
        username,
        ifs_page,
        label_count,
        label_images,
        printed_at: Timestamp.fromDate(new Date()),
      });
    } catch (err: any) {
      console.warn(err);
      log(LogType.Failure, "Add Archive", err.toString());
    }
  };

  interface LabelFailure {
    version?: string;
    username?: any;
    statuscode: any;
    name: any;
    message: any;
    created_at?: any;
  }

  const addFailure = async ({ statuscode, name, message }: LabelFailure) => {
    try {
      let now = new Date();
      let path = `failures/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/entries`;
      await addDoc(collection(db, path), {
        version: packagejson.version,
        username,
        statuscode,
        name,
        message,
        created_at: Timestamp.fromDate(new Date()),
      });
    } catch (err: any) {
      console.warn(err);
      log(LogType.Failure, "Add Failure", err.toString());
    }
  };

  return { addArchive, addFailure, addUser };
};

export default FirebaseHandler;
