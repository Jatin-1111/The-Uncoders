// src/services/contentService.js
import { db } from '../firebase';
import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs
} from 'firebase/firestore';

class ContentService {
    constructor() {
        this.cache = new Map();
        this.COLLECTION_NAME = 'course_content';
    }

    // Save content to Firebase
    async saveContent(contentData) {
        try {
            const docRef = doc(db, this.COLLECTION_NAME, 'main');
            await setDoc(docRef, {
                ...contentData,
                lastModified: new Date(),
                version: Date.now()
            });

            // Update cache
            this.cache.set('main', contentData);
            return true;
        } catch (error) {
            console.error('Error saving content:', error);
            throw new Error('Failed to save content: ' + error.message);
        }
    }

    // Load content from Firebase
    async loadContent() {
        try {
            // Check cache first
            if (this.cache.has('main')) {
                return this.cache.get('main');
            }

            const docRef = doc(db, this.COLLECTION_NAME, 'main');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Remove metadata before caching
                const { lastModified, version, ...contentData } = data;
                this.cache.set('main', contentData);
                return contentData;
            } else {
                // Return default structure if no data exists
                const defaultData = {
                    itContent: {},
                    gateContent: {}
                };
                return defaultData;
            }
        } catch (error) {
            console.error('Error loading content:', error);
            throw new Error('Failed to load content: ' + error.message);
        }
    }

    // Add new IT content
    async addITContent(semester, subject, chapter, links) {
        try {
            const currentData = await this.loadContent();

            if (!currentData.itContent[semester]) {
                currentData.itContent[semester] = {};
            }

            if (!currentData.itContent[semester][subject]) {
                currentData.itContent[semester][subject] = {};
            }

            currentData.itContent[semester][subject][chapter] = {
                ytLink: links.ytLink || '',
                pyqs: links.pyqs || '',
                notes: links.notes || '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            await this.saveContent(currentData);
            return true;
        } catch (error) {
            console.error('Error adding IT content:', error);
            throw error;
        }
    }

    // Add new GATE content
    async addGateContent(subject, chapter, links) {
        try {
            const currentData = await this.loadContent();

            if (!currentData.gateContent[subject]) {
                currentData.gateContent[subject] = {};
            }

            currentData.gateContent[subject][chapter] = {
                ytLink: links.ytLink || '',
                notes: links.notes || '',
                pyqs: links.pyqs || '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            await this.saveContent(currentData);
            return true;
        } catch (error) {
            console.error('Error adding GATE content:', error);
            throw error;
        }
    }

    // Update existing content
    async updateContent(type, path, newData) {
        try {
            const currentData = await this.loadContent();

            if (type === 'it') {
                const [semester, subject, chapter] = path;
                if (currentData.itContent[semester]?.[subject]?.[chapter]) {
                    currentData.itContent[semester][subject][chapter] = {
                        ...currentData.itContent[semester][subject][chapter],
                        ...newData,
                        lastModified: new Date()
                    };
                }
            } else if (type === 'gate') {
                const [subject, chapter] = path;
                if (currentData.gateContent[subject]?.[chapter]) {
                    currentData.gateContent[subject][chapter] = {
                        ...currentData.gateContent[subject][chapter],
                        ...newData,
                        lastModified: new Date()
                    };
                }
            }

            await this.saveContent(currentData);
            return true;
        } catch (error) {
            console.error('Error updating content:', error);
            throw error;
        }
    }

    // Delete content
    async deleteContent(type, path) {
        try {
            const currentData = await this.loadContent();

            if (type === 'it') {
                const [semester, subject, chapter] = path;
                if (chapter && currentData.itContent[semester]?.[subject]) {
                    delete currentData.itContent[semester][subject][chapter];
                } else if (subject && currentData.itContent[semester]) {
                    delete currentData.itContent[semester][subject];
                } else if (semester) {
                    delete currentData.itContent[semester];
                }
            } else if (type === 'gate') {
                const [subject, chapter] = path;
                if (chapter && currentData.gateContent[subject]) {
                    delete currentData.gateContent[subject][chapter];
                } else if (subject) {
                    delete currentData.gateContent[subject];
                }
            }

            await this.saveContent(currentData);
            return true;
        } catch (error) {
            console.error('Error deleting content:', error);
            throw error;
        }
    }

    // Validate URL format
    validateUrl(url) {
        if (!url) return true; // Empty URLs are allowed

        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Validate content data
    validateContentData(type, data) {
        const errors = [];

        if (type === 'it') {
            if (!data.semester) errors.push('Semester is required');
            if (!data.subject) errors.push('Subject is required');
            if (!data.chapter) errors.push('Chapter is required');
        } else {
            if (!data.subject) errors.push('Subject is required');
            if (!data.chapter) errors.push('Chapter is required');
        }

        // Validate URLs
        if (data.ytLink && !this.validateUrl(data.ytLink)) {
            errors.push('Invalid YouTube URL');
        }
        if (data.notes && !this.validateUrl(data.notes)) {
            errors.push('Invalid Notes URL');
        }
        if (data.pyqs && !this.validateUrl(data.pyqs)) {
            errors.push('Invalid PYQs URL');
        }

        return errors;
    }

    // Create backup
    async createBackup() {
        try {
            const currentData = await this.loadContent();
            const backup = {
                ...currentData,
                backupCreatedAt: new Date(),
                version: Date.now()
            };

            const backupRef = doc(db, this.COLLECTION_NAME, `backup_${Date.now()}`);
            await setDoc(backupRef, backup);

            return true;
        } catch (error) {
            console.error('Error creating backup:', error);
            throw error;
        }
    }

    // Get all backups
    async getBackups() {
        try {
            const backupsRef = collection(db, this.COLLECTION_NAME);
            const snapshot = await getDocs(backupsRef);

            const backups = [];
            snapshot.forEach(doc => {
                if (doc.id.startsWith('backup_')) {
                    backups.push({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            });

            return backups.sort((a, b) => b.backupCreatedAt - a.backupCreatedAt);
        } catch (error) {
            console.error('Error getting backups:', error);
            throw error;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Import data from JSON
    async importFromJSON(jsonData) {
        try {
            // Validate the imported data structure
            if (!jsonData.itContent && !jsonData.gateContent) {
                throw new Error('Invalid data format');
            }

            // Create backup before import
            await this.createBackup();

            // Save imported data
            await this.saveContent(jsonData);

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    }

    // Export data to JSON
    async exportToJSON() {
        try {
            const data = await this.loadContent();
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
export const contentService = new ContentService();