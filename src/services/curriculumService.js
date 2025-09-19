// src/services/curriculumService.js
import { db } from '../lib/firebase';
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    updateDoc,
} from 'firebase/firestore';

class CurriculumService {
    constructor() {
        this.cache = new Map();
        this.COLLECTION_NAME = 'it_curriculum';
    }

    // Initialize the curriculum collection with your existing data
    async initializeCurriculum() {
        const curriculumData = {
            semester1: {
                subjects: {
                    "Applied Physics": {
                        chapters: {
                            "Oscillations": {
                                ytLink: "https://www.youtube.com/playlist?list=PLSWDszNFa1Q3aQmaSthNcX-mMgjjKIxOZ",
                                pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
                                notes: "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs"
                            },
                            "Electromagnetic Waves": {
                                ytLink: "https://www.youtube.com/playlist?list=PL5zwY2E7i60UOvHJEOpJEw-lR2Zdmg2Ik",
                                pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
                                notes: "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs"
                            },
                            "Polarization": {
                                ytLink: "https://www.youtube.com/playlist?list=PLAPKGqvQGg6rKWLDXQ3i3O0P5DVA5uxs8",
                                pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
                                notes: "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs"
                            },
                            "Laser": {
                                ytLink: "https://www.youtube.com/watch?v=2BzQYDwZeZk&list=PL5zwY2E7i60XzRPOrKzvSzjvxnyK6jQB3",
                                pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
                                notes: "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs"
                            },
                            "Optical Fibre": {
                                ytLink: "https://www.youtube.com/watch?v=QQPjAIHRhFk&list=PL5zwY2E7i60WKxGzyMVr7U71VWuCAU5Jj",
                                pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
                                notes: "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs"
                            }
                        }
                    },
                    "Calculus": {
                        chapters: {
                            "Sequences and Series": {
                                ytLink: "https://www.youtube.com/playlist?list=PLhSp9OSVmeyI3uivqqHzrlomwD6gZx2-R",
                                pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
                                notes: "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V"
                            },
                            "Partial Differentiation": {
                                ytLink: "https://www.youtube.com/playlist?list=PLVCBPCYGv7bDiiZ5fP856_EGNyf34avaH",
                                pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
                                notes: "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V"
                            },
                            "Integral Calculus": {
                                ytLink: "https://youtube.com/playlist?list=PL-s82sZoRUdDxjKVucnabhn9kO3GWrAS1",
                                pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
                                notes: "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V"
                            },
                            "Vector Calculus": {
                                ytLink: "https://youtube.com/playlist?list=PL-s82sZoRUdARGbMQAn4M7AZwC0uLK9yY",
                                pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
                                notes: "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V"
                            }
                        }
                    },
                    "Programming Fundamentals": {
                        chapters: {
                            "C Programming": {
                                ytLink: "https://youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR",
                                pyqs: "https://drive.google.com/drive/folders/1p5wpghO4Q1MgX0vJ6HMEP85FZVU73-On",
                                notes: "https://drive.google.com/drive/folders/1THvTeoJ6OT1PrPRFBpeTqnD1xp6iD35t"
                            }
                        }
                    },
                    "Professional Communication": {
                        chapters: {
                            "Professional Communication Skills": {
                                ytLink: "https://youtube.com/playlist?list=PL9RcWoqXmzaKWxaNoDhW4O1kA0hK9AYys",
                                pyqs: "https://drive.google.com/drive/folders/1EAstkD36g_k-6ds6E_uqZnTlmQU6kX5t",
                                notes: "https://drive.google.com/drive/folders/1YQ2p7Zf5wR-osyNbyQvBxm7CTOHLFee-"
                            }
                        }
                    },
                    "Workshop": {
                        chapters: {
                            "Workshop": {
                                ytLink: "https://youtube.com/playlist?list=PLJu6FW_RN3r69JZbDBMNtBICM8NbmtplZ",
                                pyqs: "",
                                notes: "https://drive.google.com/drive/folders/1yYH46q9KMBbzl2wkBsT1o1YNro6g8CRE"
                            }
                        }
                    }
                }
            },
            semester2: {
                subjects: {
                    "Applied Chemistry": {
                        chapters: {
                            "Chemical Bonding": {
                                ytLink: "https://www.youtube.com/watch?v=Ym0jn-dHnPE&list=PLYqywOLBPSb0Zo0ByarczrB4vRKgC9AS0",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd"
                            },
                            "Stereochemistry of Organic Compounds": {
                                ytLink: "https://www.youtube.com/playlist?list=PLLf6O8XdGj03fWMXEe-8QJNVJ-ySOF0jO",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd"
                            },
                            "Spectroscopy": {
                                ytLink: "https://youtube.com/playlist?list=PLLf6O8XdGj03ktP4MHmIV87pHZHBEUF6f&si=ESEYTAPocaTPmBeY",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd"
                            },
                            "Thermodynamics": {
                                ytLink: "https://www.youtube.com/watch?v=kkUWKF7TFno",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd"
                            },
                            "Catalysis": {
                                ytLink: "",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd"
                            },
                            "Polymers": {
                                ytLink: "https://youtube.com/playlist?list=PLiYAH68F-CTDvXZ2G5JICP91oxb1WX1d_&si=rAkvQVOhwWwuhDnC",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd"
                            }
                        }
                    },
                    "Differential Equation and Transformation": {
                        chapters: {
                            "Ordinary Differential Equations": {
                                ytLink: "https://www.youtube.com/playlist?list=PLVCBPCYGv7bB7ZxAx2rT0Ln2G6ad4ME-1",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: ""
                            },
                            "Partial Differential Equations": {
                                ytLink: "https://www.youtube.com/playlist?list=PLhSp9OSVmeyJoNnAqghUK-Lit3qBgfa6o",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: ""
                            },
                            "Laplace Transformation": {
                                ytLink: "https://www.youtube.com/playlist?list=PLVCBPCYGv7bB5mBCyEIBxFnl3OLW0Vmu1",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: ""
                            },
                            "Fourier Series": {
                                ytLink: "https://www.youtube.com/playlist?list=PLhSp9OSVmeyLke5_cby8i8ZhK8FHpw3qs",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: ""
                            },
                            "Fourier Transformation": {
                                ytLink: "https://www.youtube.com/playlist?list=PLhSp9OSVmeyJ5N-JUEZj7uS6IAT9a79nD",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: ""
                            }
                        }
                    },
                    "BEEE": {
                        chapters: {
                            "BEE": {
                                ytLink: "https://www.youtube.com/playlist?list=PL9RcWoqXmzaLTYUdnzKhF4bYug3GjGcEc",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1Kj7lXZbREk9EjUK3Vf_9G2CI1m47KXNi"
                            },
                            "Diodes": {
                                ytLink: "https://www.youtube.com/playlist?list=PL3qvHcrYGy1uF5KAGntUITTJ85Dm3Dtdy",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1Kj7lXZbREk9EjUK3Vf_9G2CI1m47KXNi"
                            },
                            "Transformers": {
                                ytLink: "https://www.youtube.com/playlist?list=PL4K9r9dYCOors6MRFwoIe9_iBzSzUp2Zi",
                                pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
                                notes: "https://drive.google.com/drive/u/0/folders/1Kj7lXZbREk9EjUK3Vf_9G2CI1m47KXNi"
                            }
                        }
                    },
                    "Engineering Graphics": {
                        chapters: {
                            "Orthographic Projections": {
                                ytLink: "https://www.youtube.com/playlist?list=PLDN15nk5uLiBpnIOK5r3KXdfFOVzGHJSt",
                                pyqs: "",
                                notes: "https://drive.google.com/drive/u/0/folders/1SEGMvIYs5PuV7LA8EzHUAO9VLDUreh4W"
                            },
                            "Isometric Projections": {
                                ytLink: "https://www.youtube.com/playlist?list=PLDN15nk5uLiCf-raL06kSCeqR8h61eYIC",
                                pyqs: "",
                                notes: "https://drive.google.com/drive/u/0/folders/1SEGMvIYs5PuV7LA8EzHUAO9VLDUreh4W"
                            },
                            "Projection of Regular Solids": {
                                ytLink: "",
                                pyqs: "",
                                notes: "https://drive.google.com/drive/u/0/folders/1SEGMvIYs5PuV7LA8EzHUAO9VLDUreh4W"
                            }
                        }
                    },
                    "OOPS with C++": {
                        chapters: {
                            "Complete Playlist": {
                                ytLink: "https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL",
                                pyqs: "",
                                notes: ""
                            }
                        }
                    }
                }
            },
            semester3: {
                subjects: {
                    "Linear Algebra and Probability": {
                        chapters: {
                            "Matrices and Linear Equations": { ytLink: "", pyqs: "", notes: "" },
                            "Vector Spaces": { ytLink: "", pyqs: "", notes: "" },
                            "Probability Concepts": { ytLink: "", pyqs: "", notes: "" },
                            "Random Variables": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "Digital Electronics": {
                        chapters: {
                            "Boolean Algebra": { ytLink: "", pyqs: "", notes: "" },
                            "Combinational Circuits": { ytLink: "", pyqs: "", notes: "" },
                            "Sequential Circuits": { ytLink: "", pyqs: "", notes: "" },
                            "Memory and PLDs": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "DBMS": {
                        chapters: {
                            "Database Concepts": { ytLink: "", pyqs: "", notes: "" },
                            "SQL": { ytLink: "", pyqs: "", notes: "" },
                            "Normalization": { ytLink: "", pyqs: "", notes: "" },
                            "Transaction Management": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "Data Structure": {
                        chapters: {
                            "Arrays and Linked Lists": { ytLink: "", pyqs: "", notes: "" },
                            "Stacks and Queues": { ytLink: "", pyqs: "", notes: "" },
                            "Trees": { ytLink: "", pyqs: "", notes: "" },
                            "Graphs": { ytLink: "", pyqs: "", notes: "" },
                            "Searching and Sorting": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "Computer Architecture and Organisation": {
                        chapters: {
                            "Computer Organization Basics": { ytLink: "", pyqs: "", notes: "" },
                            "CPU Architecture": { ytLink: "", pyqs: "", notes: "" },
                            "Memory Organization": { ytLink: "", pyqs: "", notes: "" },
                            "I/O Organization": { ytLink: "", pyqs: "", notes: "" }
                        }
                    }
                }
            },
            semester4: {
                subjects: {
                    "Economics": {
                        chapters: {
                            "Basic Economic Concepts": { ytLink: "", pyqs: "", notes: "" },
                            "Market Structure": { ytLink: "", pyqs: "", notes: "" },
                            "Financial Management": { ytLink: "", pyqs: "", notes: "" },
                            "Project Management": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "Discrete Structure": {
                        chapters: {
                            "Set Theory": { ytLink: "", pyqs: "", notes: "" },
                            "Relations and Functions": { ytLink: "", pyqs: "", notes: "" },
                            "Graph Theory": { ytLink: "", pyqs: "", notes: "" },
                            "Boolean Algebra": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "Computer Network": {
                        chapters: {
                            "Network Fundamentals": { ytLink: "", pyqs: "", notes: "" },
                            "Data Link Layer": { ytLink: "", pyqs: "", notes: "" },
                            "Network Layer": { ytLink: "", pyqs: "", notes: "" },
                            "Transport Layer": { ytLink: "", pyqs: "", notes: "" },
                            "Application Layer": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "Micro-Processor": {
                        chapters: {
                            "8085 Architecture": { ytLink: "", pyqs: "", notes: "" },
                            "Assembly Language Programming": { ytLink: "", pyqs: "", notes: "" },
                            "Interfacing": { ytLink: "", pyqs: "", notes: "" },
                            "8086 Microprocessor": { ytLink: "", pyqs: "", notes: "" }
                        }
                    },
                    "Operating System": {
                        chapters: {
                            "OS Introduction": { ytLink: "", pyqs: "", notes: "" },
                            "Process Management": { ytLink: "", pyqs: "", notes: "" },
                            "Memory Management": { ytLink: "", pyqs: "", notes: "" },
                            "File Systems": { ytLink: "", pyqs: "", notes: "" },
                            "Deadlocks": { ytLink: "", pyqs: "", notes: "" }
                        }
                    }
                }
            }
        };

        try {
            // Save each semester as a separate document
            for (const [semesterKey, semesterData] of Object.entries(curriculumData)) {
                await setDoc(doc(db, this.COLLECTION_NAME, semesterKey), {
                    ...semesterData,
                    createdAt: new Date(),
                    lastModified: new Date()
                });
            }
            console.log('Curriculum initialized successfully!');
            return true;
        } catch (error) {
            console.error('Error initializing curriculum:', error);
            throw error;
        }
    }

    // Get all semesters
    async getAllSemesters() {
        try {
            const cacheKey = 'all_semesters';
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const semesterCollectionRef = collection(db, this.COLLECTION_NAME);
            const snapshot = await getDocs(semesterCollectionRef);

            const semesters = {};
            snapshot.forEach(doc => {
                semesters[doc.id] = {
                    id: doc.id,
                    ...doc.data()
                };
            });

            this.cache.set(cacheKey, semesters);
            return semesters;
        } catch (error) {
            console.error('Error fetching semesters:', error);
            throw error;
        }
    }

    // Get specific semester
    async getSemester(semesterKey) {
        try {
            if (this.cache.has(semesterKey)) {
                return this.cache.get(semesterKey);
            }

            const semesterDoc = await getDoc(doc(db, this.COLLECTION_NAME, semesterKey));

            if (semesterDoc.exists()) {
                const data = semesterDoc.data();
                this.cache.set(semesterKey, data);
                return data;
            }

            return null;
        } catch (error) {
            console.error('Error fetching semester:', error);
            throw error;
        }
    }

    // Get subjects for a semester
    async getSubjects(semesterKey) {
        try {
            const semesterData = await this.getSemester(semesterKey);
            return semesterData?.subjects || {};
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    }

    // Get chapters for a subject
    async getChapters(semesterKey, subjectName) {
        try {
            const subjects = await this.getSubjects(semesterKey);
            return subjects[subjectName]?.chapters || {};
        } catch (error) {
            console.error('Error fetching chapters:', error);
            throw error;
        }
    }

    // Add new chapter
    async addChapter(semesterKey, subjectName, chapterName, chapterData) {
        try {
            const semesterData = await this.getSemester(semesterKey);

            if (!semesterData.subjects[subjectName]) {
                semesterData.subjects[subjectName] = { chapters: {} };
            }

            semesterData.subjects[subjectName].chapters[chapterName] = {
                ...chapterData,
                createdAt: new Date(),
                lastModified: new Date()
            };

            await updateDoc(doc(db, this.COLLECTION_NAME, semesterKey), {
                subjects: semesterData.subjects,
                lastModified: new Date()
            });

            // Clear cache
            this.cache.delete(semesterKey);
            this.cache.delete('all_semesters');

            return true;
        } catch (error) {
            console.error('Error adding chapter:', error);
            throw error;
        }
    }

    // Update chapter
    async updateChapter(semesterKey, subjectName, chapterName, updates) {
        try {
            const semesterData = await this.getSemester(semesterKey);

            if (semesterData.subjects[subjectName]?.chapters[chapterName]) {
                semesterData.subjects[subjectName].chapters[chapterName] = {
                    ...semesterData.subjects[subjectName].chapters[chapterName],
                    ...updates,
                    lastModified: new Date()
                };

                await updateDoc(doc(db, this.COLLECTION_NAME, semesterKey), {
                    subjects: semesterData.subjects,
                    lastModified: new Date()
                });

                // Clear cache
                this.cache.delete(semesterKey);
                this.cache.delete('all_semesters');

                return true;
            }

            return false;
        } catch (error) {
            console.error('Error updating chapter:', error);
            throw error;
        }
    }

    // Delete chapter
    async deleteChapter(semesterKey, subjectName, chapterName) {
        try {
            const semesterData = await this.getSemester(semesterKey);

            if (semesterData.subjects[subjectName]?.chapters[chapterName]) {
                delete semesterData.subjects[subjectName].chapters[chapterName];

                await updateDoc(doc(db, this.COLLECTION_NAME, semesterKey), {
                    subjects: semesterData.subjects,
                    lastModified: new Date()
                });

                // Clear cache
                this.cache.delete(semesterKey);
                this.cache.delete('all_semesters');

                return true;
            }

            return false;
        } catch (error) {
            console.error('Error deleting chapter:', error);
            throw error;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Validate URLs
    validateUrl(url) {
        if (!url) return true; // Empty URLs are allowed
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Validate chapter data
    validateChapterData(data) {
        const errors = [];

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
}

export const curriculumService = new CurriculumService();