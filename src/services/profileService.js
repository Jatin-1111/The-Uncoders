// profileService.js
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// LRU Cache implementation for profile data
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, value);
    }

    remove(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

// Initialize cache with capacity of 100 users
const profileCache = new LRUCache(100);

// Debounce function for batching updates
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

class ProfileService {
    constructor() {
        this.pendingUpdates = new Map();
        this.processPendingUpdates = debounce(this._processPendingUpdates.bind(this), 2000);
    }

    // Initialize new user profile
    async initializeProfile(name, email) {
        const user = auth.currentUser;
        if (!user) throw new Error('No authenticated user');

        const sanitizedName = this._sanitizeName(name);
        this._validateName(sanitizedName);

        const profileData = {
            uid: user.uid,
            name: sanitizedName,
            email,
            createdAt: new Date(),
            lastModified: new Date()
        };

        // Set document with UID as document ID
        await setDoc(doc(db, 'users', user.uid), profileData);
        profileCache.put(user.uid, { ...profileData, lastFetched: Date.now() });

        return profileData;
    }

    // Get user profile with optimized caching
    async getUserProfile(uid) {
        if (!uid) throw new Error('User ID is required');

        console.log('Fetching profile for uid:', uid); // Add this debug log

        // Check cache first
        const cachedProfile = profileCache.get(uid);
        if (cachedProfile && !this._isProfileStale(cachedProfile)) {
            console.log('Returning cached profile:', cachedProfile); // Add this debug log
            return cachedProfile;
        }

        // Fetch from Firestore using UID as document ID
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            console.log('Firestore response:', userDoc.data()); // Add this debug log

            if (!userDoc.exists()) {
                console.log('No document exists for uid:', uid); // Add this debug log
                return null;
            }

            const profileData = {
                ...userDoc.data(),
                lastFetched: Date.now()
            };

            profileCache.put(uid, profileData);
            return profileData;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return cachedProfile || null;
        }
    }

    // Update name with UID as document ID
    async updateName(newName) {
        const user = auth.currentUser;
        if (!user) throw new Error('No authenticated user');

        const sanitizedName = this._sanitizeName(newName);
        this._validateName(sanitizedName);

        // Update cache immediately for optimistic UI
        const currentProfile = profileCache.get(user.uid) || {};
        const updatedProfile = {
            ...currentProfile,
            name: sanitizedName,
            lastModified: new Date()
        };
        profileCache.put(user.uid, updatedProfile);

        // Add to pending updates using UID as key
        this.pendingUpdates.set(user.uid, {
            ...this.pendingUpdates.get(user.uid),
            name: sanitizedName,
        });

        // Trigger debounced update
        this.processPendingUpdates();

        return sanitizedName;
    }

    // Process pending updates with UID as document ID
    async _processPendingUpdates() {
        if (this.pendingUpdates.size === 0) return;

        const updates = new Map(this.pendingUpdates);
        this.pendingUpdates.clear();

        const batch = [];
        for (const [uid, data] of updates) {
            batch.push(
                updateDoc(doc(db, 'users', uid), {
                    ...data,
                    lastModified: new Date()
                })
            );
        }

        try {
            await Promise.all(batch);
        } catch (error) {
            console.error('Error processing profile updates:', error);
            // Revert cache for failed updates
            for (const [uid] of updates) {
                profileCache.remove(uid);
            }
            throw error;
        }
    }

    _sanitizeName(name) {
        return name
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 50);
    }

    _validateName(name) {
        if (name.length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }
        if (!/^[a-zA-Z\s-']+$/.test(name)) {
            throw new Error('Name contains invalid characters');
        }
    }

    _isProfileStale(profile) {
        const staleThreshold = 5 * 60 * 1000; // 5 minutes
        return Date.now() - profile.lastFetched > staleThreshold;
    }

    clearCache() {
        profileCache.clear();
    }
}

export const profileService = new ProfileService();