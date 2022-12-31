import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, serverTimestamp, deleteDoc, getDoc, getDocs, where, query, orderBy }
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

export class FBStore {
    constructor(firebaseConfig) {
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
        this.isMerge = true; // true: merge / false: overwrite
        this.debug = false;
    }

    async write(collectionName, document, documentID) {
        if (documentID === undefined) documentID = ""; else documentID = documentID.toString();
        this.validateThreeParams(collectionName, document, documentID);

        if (arguments.length === 2) {
            //  autoId
            const docRef = await addDoc(collection(this.db, collectionName), { ...document });
            if (this.debug) console.log("Document written with ID: ", docRef.id);
            return docRef.id;
        }
        else if (arguments.length === 3) {
            //  documentID  and merge / overwrite
            setDoc(doc(this.db, collectionName, documentID), { ...document }, { merge: this.isMerge }).then(() => {
                if (this.debug) console.log(`"Document ${documentID} successfully written!"`);
                return true;
            }).catch((error) => {
                console.error(`Error writing document: ${documentID}`, error);
                return false;
            });
        }
        else {
            throw new Error("Invalid number of arguments, expected 2 or 3, got " + arguments.length);
        }
    }

    async readCollection(collectionName) {
        if (arguments.length !== 1) throw new Error("Invalid number of arguments, expected 1, got " + arguments.length);
        if (this.validate(collectionName) !== "string") throw new Error("Invalid collection name, expected string, got " + typeof collection);

        try {
            const querySnapshot = await getDocs(collection(this.db, collectionName));
            const data = this.snapshotToObj(querySnapshot);
            if (this.debug) console.log(`collect ${collectionName} data: `, data);
            return data;
        } catch (error) {
            console.error(`Error reading collection: ${collectionName}`, error);
            return null;
        }
    }

    async readDocument(collectionName, documentID) {
        if (arguments.length !== 2) throw new Error("Invalid number of arguments, expected 2, got " + arguments.length);
        if (this.validate(collectionName) !== "string") throw new Error("Invalid collection name, expected string, got " + typeof collection);

        documentID = documentID.toString();
        if (this.validate(documentID) !== "string") throw new Error("Invalid documentID, expected string, got " + typeof documentID);

        const docRef = doc(this.db, collectionName, documentID);

        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            if (this.debug) console.log(`Document ${documentID} data:`, docSnap.data());
            return docSnap.data();
        } else {
            if (this.debug) console.log(`No such document ${documentID}!`);
            return null;
        }

    }

    async query(collectionName, queries, order) {
        if (arguments.length !== 2 && arguments.length !== 3) throw new Error("Invalid number of arguments, expected 2 or 3, got " + arguments.length);
        if (this.validate(collectionName) !== "string") throw new Error("Invalid collection name, expected string, got " + typeof collection);
        if (this.validate(queries) !== "object") throw new Error("Invalid queries, expected object, got " + typeof queries);

        if (arguments.length === 3) {
            if (this.validate(order) !== "object") throw new Error("Invalid order, expected object, got " + typeof order);
        }

        let q;

        if (this.validate(queries[0]) !== "object") queries = [queries];

        if (arguments.length === 2) {
            let queriesList = []
            for (let qurey of queries) {
                queriesList.push(where(qurey[0], qurey[1], qurey[2]));
                q = query(collection(this.db, collectionName), ...queriesList);
            }
        } else if (arguments.length === 3) {
            let queriesList = []
            for (let qurey of queries) {
                queriesList.push(where(qurey[0], qurey[1], qurey[2]));
                q = query(collection(this.db, collectionName), ...queriesList, orderBy(order[0], order[1]));
            }
        }

        const querySnapshot = await getDocs(q);
        const data = this.snapshotToArray(querySnapshot);
        if (this.debug) console.log(`collect ${collectionName} data: `, data);
        return data;

    }

    async delete(collectionName, documentID) {
        if (arguments.length !== 2) throw new Error("Invalid number of arguments, expected 2, got " + arguments.length);
        if (this.validate(collectionName) !== "string") throw new Error("Invalid collection name, expected string, got " + typeof collection);

        documentID = documentID.toString();
        if (this.validate(documentID) !== "string") throw new Error("Invalid documentID, expected string, got " + typeof documentID);

        deleteDoc(doc(this.db, collectionName, documentID)).then(() => {
            if (this.debug) console.log(`Document ${documentID} successfully deleted!`);
            return true;
        }).catch((error) => {
            console.error(`Error removing document: ${documentID}`, error);
            return false;
        });
    }

    async update(collectionName, document, documentID) {
        if (documentID === undefined) documentID = ""; else documentID = documentID.toString();
        this.validateThreeParams(collectionName, document, documentID);

        const docRef = doc(this.db, collectionName, documentID);

        // Set the "capital" field of the city 'DC'
        updateDoc(docRef, { ...document }).then(() => {
            if (this.debug) console.log("Document successfully updated!");
            return true;
        }).catch((error) => {
            console.error(`Error updating document: ${documentID}`, error);
            return false;
        });
    }

    getServerTimestamp() {
        return serverTimestamp();
    }

    validate(param) {
        // is param is an object
        if (typeof param === "object") return "object";

        // is param is a string
        if (typeof param === "string") return "string";
    }

    validateThreeParams(collectionName, document, documentID) {
        if (arguments.length !== 3) throw new Error("Invalid number of arguments, expected 3, got " + arguments.length);

        if (this.validate(collectionName) !== "string") throw new Error("Invalid collection name, expected string, got " + typeof collection);

        if (this.validate(document) !== "object") throw new Error("Invalid document, expected object, got " + typeof document);

        if (this.validate(documentID) !== "string") throw new Error("Invalid documentID, expected string, got " + typeof documentID);
    }

    snapshotToObj(snapshot) {
        const obj = {};
        snapshot.forEach(doc => {
            obj[doc.id] = doc.data();
        });
        return obj;
    }

    snapshotToArray(snapshot) {
        const arr = [];
        snapshot.forEach(doc => {
            arr.push(doc.data());
        });
        return arr;
    }
}


