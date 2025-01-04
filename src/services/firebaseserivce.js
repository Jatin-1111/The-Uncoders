// firebaseService.js
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  updateEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';

// Cache for user data
const userCache = new Map();
const adminCache = new Map();

// User Authentication Service
export const authService = {
  // Sign up with validation and Firestore integration
  async signUp(email, password, name) {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      throw new Error('Account already exists');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date(),
    });

    return user;
  },

  // Enhanced sign in with error handling
  async signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Email not registered');
      }
      throw error;
    }
  },

  // Password reset with custom action code settings
  async resetPassword(email, actionCodeSettings) {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  },

  // Logout with cleanup
  async signOut() {
    userCache.clear();
    adminCache.clear();
    await auth.signOut();
  }
};

// User Data Service
export const userService = {
  // Get user data with caching
  async getUserData(uid) {
    if (userCache.has(uid)) {
      return userCache.get(uid);
    }

    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      userCache.set(uid, userData);
      return userData;
    }
    return null;
  },

  // Update user profile with cache invalidation
  async updateProfile(uid, data) {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    userCache.delete(uid);
    
    if (data.email && auth.currentUser) {
      await updateEmail(auth.currentUser, data.email);
    }
  },

  // Get all users with optional filtering
  async getUsers(searchTerm = '') {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('name'));
    const snapshot = await getDocs(q);

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return users.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    }

    return users;
  }
};

// Admin Service
export const adminService = {
  // Check admin status with caching
  async isAdmin(uid) {
    if (adminCache.has(uid)) {
      return adminCache.get(uid);
    }

    const adminDoc = await getDoc(doc(db, 'admins', uid));
    const isAdmin = adminDoc.exists();
    adminCache.set(uid, isAdmin);
    return isAdmin;
  },

  // Get all admins
  async getAdmins() {
    const adminsRef = collection(db, 'admins');
    const snapshot = await getDocs(adminsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Add admin with validation
  async addAdmin(email) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const user = querySnapshot.docs[0];
    await setDoc(doc(db, 'admins', user.id), { email });
    adminCache.clear();
  },

  // Remove admin with cache invalidation
  async removeAdmin(adminId) {
    await deleteDoc(doc(db, 'admins', adminId));
    adminCache.delete(adminId);
  }
};

// Auth State Observer
export const initAuthStateObserver = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        callback({ user, userData });
      } catch (error) {
        console.error('Error in auth observer:', error);
        callback({ user, userData: null });
      }
    } else {
      callback({ user: null, userData: null });
    }
  });
};