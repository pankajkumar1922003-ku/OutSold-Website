import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile(userSnap.data());
        } else {
          setProfile({
            uid: firebaseUser.uid,
            phone: firebaseUser.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Auth state error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveProfile = async (name) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const profileData = {
      uid: user.uid,
      name: name.trim(),
      phone: user.phoneNumber || "",
      updatedAt: serverTimestamp(),
    };

    await setDoc(
      userRef,
      {
        ...profileData,
        createdAt: profile?.createdAt || serverTimestamp(),
      },
      { merge: true }
    );

    const updatedProfile = {
      ...profile,
      ...profileData,
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      "outsold_user_profile",
      JSON.stringify(updatedProfile)
    );

    window.dispatchEvent(new Event("userProfileChanged"));
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      localStorage.removeItem("outsold_user_profile");
      window.dispatchEvent(new Event("userProfileChanged"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isLoggedIn: !!user,
        saveProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};