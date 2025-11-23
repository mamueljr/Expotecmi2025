import { Evaluation } from '../types';
import { firestore } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  writeBatch, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

const COLLECTION_KEY = 'evaluations';

export const db = {
  // Subscribe to real-time updates (for Admin Dashboard)
  subscribeToEvaluations: (callback: (data: Evaluation[]) => void) => {
    try {
      const q = query(collection(firestore, COLLECTION_KEY), orderBy('timestamp', 'desc'));
      
      // onSnapshot listens for changes in the database in real-time
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => {
          // We combine the firestore data with the types
          return { ...doc.data() } as Evaluation;
        });
        callback(data);
      }, (error) => {
        console.error("Error subscribing to evaluations:", error);
        callback([]);
      });

      return unsubscribe;
    } catch (e) {
      console.error("Error setting up subscription", e);
      return () => {};
    }
  },

  // Add a single evaluation to Firestore
  addEvaluation: async (evaluation: Evaluation): Promise<void> => {
    try {
      await addDoc(collection(firestore, COLLECTION_KEY), evaluation);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  },

  // Deletes all documents in the collection (Simulates "creating a new DB")
  clearDatabase: async (): Promise<void> => {
    try {
      const q = query(collection(firestore, COLLECTION_KEY));
      const snapshot = await getDocs(q);
      
      // Firestore requires batching for multiple deletes
      const batch = writeBatch(firestore);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (e) {
      console.error("Error clearing database: ", e);
      throw e;
    }
  },
  
  // Export data to JSON file
  exportData: async (): Promise<void> => {
    try {
      const q = query(collection(firestore, COLLECTION_KEY));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as Evaluation);
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "expotecmi_results_firebase.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (e) {
      console.error("Error exporting data", e);
      alert("Error al exportar los datos. Revisa la consola.");
    }
  }
};