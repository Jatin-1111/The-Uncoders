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

// Cache for user data with expiration
const createCache = () => {
  const cache = new Map();
  const expiration = new Map();
  const TTL = 5 * 60 * 1000; // 5 minutes

  return {
    get: (key) => {
      if (expiration.has(key) && Date.now() > expiration.get(key)) {
        cache.delete(key);
        expiration.delete(key);
        return null;
      }
      return cache.get(key) || null;
    },
    set: (key, value) => {
      cache.set(key, value);
      expiration.set(key, Date.now() + TTL);
    },
    delete: (key) => {
      cache.delete(key);
      expiration.delete(key);
    },
    clear: () => {
      cache.clear();
      expiration.clear();
    }
  };
};

const userCache = createCache();
const adminCache = createCache();

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
    if (!uid) return null;

    const cached = userCache.get(uid);
    if (cached) {
      return cached;
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

// Enhanced Admin Service with better error handling
export const adminService = {
  // Check admin status with improved caching and error handling
  async isAdmin(uid) {
    if (!uid) {
      console.warn('isAdmin called with no UID');
      return false;
    }

    try {
      // Check cache first
      const cached = adminCache.get(uid);
      if (cached !== null) {
        return cached;
      }

      // Check Firestore
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      const isAdmin = adminDoc.exists();

      // Cache the result
      adminCache.set(uid, isAdmin);

      console.log(`Admin check for ${uid}: ${isAdmin}`);
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      // In case of error, check cache or return false
      const cached = adminCache.get(uid);
      return cached !== null ? cached : false;
    }
  },

  // Get all admins with error handling
  async getAdmins() {
    try {
      const adminsRef = collection(db, 'admins');
      const snapshot = await getDocs(adminsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Failed to fetch admin list');
    }
  },

  // Add admin with improved validation
  async addAdmin(email) {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }

    const trimmedEmail = email.trim().toLowerCase();

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', trimmedEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found with this email address');
      }

      const user = querySnapshot.docs[0];

      // Check if already admin
      const existingAdmin = await getDoc(doc(db, 'admins', user.id));
      if (existingAdmin.exists()) {
        throw new Error('User is already an admin');
      }

      await setDoc(doc(db, 'admins', user.id), {
        email: trimmedEmail,
        addedAt: new Date()
      });

      // Clear admin cache to force refresh
      adminCache.delete(user.id);

      return true;
    } catch (error) {
      console.error('Error adding admin:', error);
      throw error;
    }
  },

  // Remove admin with validation
  async removeAdmin(adminId) {
    if (!adminId) {
      throw new Error('Admin ID is required');
    }

    try {
      // Verify admin exists before deletion
      const adminDoc = await getDoc(doc(db, 'admins', adminId));
      if (!adminDoc.exists()) {
        throw new Error('Admin not found');
      }

      await deleteDoc(doc(db, 'admins', adminId));
      adminCache.delete(adminId);

      return true;
    } catch (error) {
      console.error('Error removing admin:', error);
      throw error;
    }
  },

  // Clear admin cache manually
  clearAdminCache() {
    adminCache.clear();
  }
};

// Enhanced Auth State Observer with better error handling
export const initAuthStateObserver = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        // Check admin status
        const isAdmin = await adminService.isAdmin(user.uid);

        callback({
          user,
          userData,
          isAdmin,
          loading: false
        });
      } catch (error) {
        console.error('Error in auth observer:', error);
        callback({
          user,
          userData: null,
          isAdmin: false,
          loading: false,
          error: error.message
        });
      }
    } else {
      callback({
        user: null,
        userData: null,
        isAdmin: false,
        loading: false
      });
    }
  });
};

// Utility function to wait for auth state to be determined
export const waitForAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Enhanced function for components that need to check auth + admin status
export const checkAuthAndAdmin = async () => {
  try {
    const user = await waitForAuthState();

    if (!user) {
      return {
        authenticated: false,
        isAdmin: false,
        user: null,
        error: 'Not authenticated'
      };
    }

    const isAdmin = await adminService.isAdmin(user.uid);

    return {
      authenticated: true,
      isAdmin,
      user,
      error: null
    };
  } catch (error) {
    console.error('Error checking auth and admin status:', error);
    return {
      authenticated: false,
      isAdmin: false,
      user: null,
      error: error.message
    };
  }
};