import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
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
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isActive) return;

      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(firebaseUser);
        setProfile(null);
        setLoading(true);

        const userRef = doc(
          db,
          "outsold_users",
          firebaseUser.uid
        );

        const userSnap = await getDoc(userRef);

        if (!isActive) return;

        if (userSnap.exists()) {
          const firestoreProfile = userSnap.data();

          setProfile({
            ...firestoreProfile,
            uid: firebaseUser.uid,
            name:
              firestoreProfile?.name ||
              firebaseUser.displayName ||
              "",
            phone:
              firestoreProfile?.phone ||
              firebaseUser.phoneNumber ||
              "",
          });
        } else {
          setProfile({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            phone: firebaseUser.phoneNumber || "",
          });
        }
      } catch (error) {
        if (!isActive) return;

        console.error("Auth state error:", error);

        setProfile({
          uid: firebaseUser?.uid || "",
          name: firebaseUser?.displayName || "",
          phone: firebaseUser?.phoneNumber || "",
        });
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const saveProfile = async (name) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User is not authenticated.");
    }

    const cleanName = name?.trim();

    if (!cleanName) {
      throw new Error("Name is required.");
    }

    const userRef = doc(
      db,
      "outsold_users",
      currentUser.uid
    );

    if (currentUser.displayName !== cleanName) {
      await updateProfile(currentUser, {
        displayName: cleanName,
      });
    }

    const existingSnap = await getDoc(userRef);

    const profileData = {
      uid: currentUser.uid,
      name: cleanName,
      phone: currentUser.phoneNumber || "",
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      profileData.createdAt = serverTimestamp();
    }

    await setDoc(userRef, profileData, {
      merge: true,
    });

    const updatedProfile = {
      ...(existingSnap.exists() ? existingSnap.data() : {}),
      uid: currentUser.uid,
      name: cleanName,
      phone: currentUser.phoneNumber || "",
    };

    setUser({
      ...currentUser,
      displayName: cleanName,
    });

    setProfile(updatedProfile);

    localStorage.setItem(
      "outsold_user_profile",
      JSON.stringify(updatedProfile)
    );

    window.dispatchEvent(
      new Event("userProfileChanged")
    );

    return updatedProfile;
  };

  const logout = async () => {
    try {
      setUser(null);
      setProfile(null);
      setLoading(false);

      localStorage.removeItem("outsold_user_profile");

      window.dispatchEvent(
        new Event("userProfileChanged")
      );

      await signOut(auth);
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
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};