// Fixed firebaseService.js - Improved user data loading for admin panel

import { auth, db } from '../lib/firebase';
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
  limit,
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
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        throw new Error('Account already exists');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document with UID as document ID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date(),
        lastModified: new Date(),
      });

      console.log('User created successfully:', user.uid);
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
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

// FIXED User Data Service
export const userService = {
  // Get user data with caching
  async getUserData(uid) {
    if (!uid) {
      console.warn('getUserData called with no UID');
      return null;
    }

    try {
      const cached = userCache.get(uid);
      if (cached) {
        console.log('Returning cached user data for:', uid);
        return cached;
      }

      console.log('Fetching user data from Firestore for:', uid);
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data found:', userData);
        userCache.set(uid, userData);
        return userData;
      } else {
        console.log('No user document found for:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
  },

  // Update user profile with cache invalidation
  async updateProfile(uid, data) {
    if (!uid) {
      throw new Error('User ID is required');
    }

    try {
      const updateData = {
        ...data,
        lastModified: new Date()
      };

      await setDoc(doc(db, 'users', uid), updateData, { merge: true });
      userCache.delete(uid);

      if (data.email && auth.currentUser) {
        await updateEmail(auth.currentUser, data.email);
      }

      console.log('User profile updated successfully:', uid);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  // FIXED: Get all users with better error handling and debugging
  async getUsers(searchTerm = '') {
    try {
      console.log('Starting to fetch all users...');

      // Check cache first for all users
      const cacheKey = `all_users_${searchTerm}`;
      const cached = userCache.get(cacheKey);
      if (cached) {
        console.log('Returning cached users list, count:', cached.length);
        return cached;
      }

      // Query Firestore for all users
      const usersRef = collection(db, 'users');
      let q;

      try {
        // Try to order by name, but handle cases where some documents might not have this field
        q = query(usersRef, orderBy('name', 'asc'));
      } catch (orderError) {
        console.warn('Could not order by name, falling back to basic query:', orderError);
        q = usersRef;
      }

      console.log('Executing Firestore query for users...');
      const snapshot = await getDocs(q);
      console.log('Firestore query completed. Document count:', snapshot.size);

      if (snapshot.empty) {
        console.warn('No users found in Firestore collection');
        return [];
      }

      const users = [];
      let errorCount = 0;

      snapshot.forEach(doc => {
        try {
          const userData = doc.data();

          // Ensure we have the document ID as uid if not present in data
          const user = {
            id: doc.id,
            uid: userData.uid || doc.id,
            name: userData.name || 'Unknown User',
            email: userData.email || 'No Email',
            createdAt: userData.createdAt,
            lastModified: userData.lastModified,
            ...userData
          };

          users.push(user);
          console.log('Processed user:', user.id, user.name, user.email);
        } catch (docError) {
          console.error('Error processing user document:', doc.id, docError);
          errorCount++;
        }
      });

      console.log(`Successfully processed ${users.length} users, ${errorCount} errors`);

      // Apply search filter if provided
      let filteredUsers = users;
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        filteredUsers = users.filter(user =>
          (user.name && user.name.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term))
        );
        console.log(`Search filtered to ${filteredUsers.length} users`);
      }

      // Cache the results
      userCache.set(cacheKey, filteredUsers);

      return filteredUsers;

    } catch (error) {
      console.error('Error in getUsers:', error);

      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied: Check Firestore security rules for users collection');
      } else if (error.code === 'unavailable') {
        throw new Error('Firestore service unavailable: Check your internet connection');
      } else if (error.code === 'not-found') {
        throw new Error('Users collection not found: Check your Firestore database setup');
      } else {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    }
  },

  // Test Firestore connection and collection access
  async testConnection() {
    try {
      console.log('Testing Firestore connection...');

      // Try to read a single document to test connection
      const usersRef = collection(db, 'users');
      const testQuery = query(usersRef, limit(1));
      const snapshot = await getDocs(testQuery);

      console.log('Firestore connection test successful');
      console.log('Sample document count:', snapshot.size);

      if (snapshot.size > 0) {
        const sampleDoc = snapshot.docs[0];
        console.log('Sample document ID:', sampleDoc.id);
        console.log('Sample document data:', sampleDoc.data());
      }

      return {
        success: true,
        documentCount: snapshot.size,
        message: 'Firestore connection successful'
      };
    } catch (error) {
      console.error('Firestore connection test failed:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  },

  // Get users count without loading all data
  async getUsersCount() {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting users count:', error);
      throw new Error(`Failed to get users count: ${error.message}`);
    }
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
        console.log(`Admin status from cache for ${uid}: ${cached}`);
        return cached;
      }

      // Check Firestore
      console.log('Checking admin status in Firestore for:', uid);
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
      console.log('Fetching all admins...');
      const adminsRef = collection(db, 'admins');
      const snapshot = await getDocs(adminsRef);

      console.log('Admins found:', snapshot.size);

      const admins = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Processed admins:', admins);
      return admins;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Failed to fetch admin list: ' + error.message);
    }
  },

  // Add admin with improved validation
  async addAdmin(email) {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }

    const trimmedEmail = email.trim().toLowerCase();
    console.log('Adding admin for email:', trimmedEmail);

    try {
      // Find user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', trimmedEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found with this email address');
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      console.log('Found user ID:', userId);

      // Check if already admin
      const existingAdmin = await getDoc(doc(db, 'admins', userId));
      if (existingAdmin.exists()) {
        throw new Error('User is already an admin');
      }

      // Add to admins collection
      await setDoc(doc(db, 'admins', userId), {
        email: trimmedEmail,
        addedAt: new Date(),
        addedBy: auth.currentUser?.uid
      });

      // Clear admin cache to force refresh
      adminCache.delete(userId);
      adminCache.delete('all_admins');

      console.log('Admin added successfully:', userId);
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
      console.log('Removing admin:', adminId);

      // Verify admin exists before deletion
      const adminDoc = await getDoc(doc(db, 'admins', adminId));
      if (!adminDoc.exists()) {
        throw new Error('Admin not found');
      }

      await deleteDoc(doc(db, 'admins', adminId));
      adminCache.delete(adminId);
      adminCache.delete('all_admins');

      console.log('Admin removed successfully:', adminId);
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
        console.log('Auth state changed - user logged in:', user.uid);

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        if (!userData) {
          console.warn('User authenticated but no Firestore document found');
        }

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
      console.log('Auth state changed - user logged out');
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

// Debug function to help diagnose issues
export const debugFirestore = async () => {
  console.log('=== Firestore Debug Information ===');

  try {
    // Test basic connection
    const connectionTest = await userService.testConnection();
    console.log('Connection test:', connectionTest);

    // Get users count
    const usersCount = await userService.getUsersCount();
    console.log('Total users count:', usersCount);

    // Test admin collection
    const admins = await adminService.getAdmins();
    console.log('Admins found:', admins.length);

    return {
      connection: connectionTest,
      usersCount,
      adminsCount: admins.length,
      success: true
    };
  } catch (error) {
    console.error('Debug failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};