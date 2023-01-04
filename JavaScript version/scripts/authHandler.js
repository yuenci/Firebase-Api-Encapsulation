import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getAuth, sendSignInLinkToEmail, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword,
    sendPasswordResetEmail, updateProfile, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider
}
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import firebaseConfig from "./config.js";


// for npm
// import { initializeApp } from 'firebase/app'
// import { getAuth, sendSignInLinkToEmail, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export class FBAuth {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.debug = false;
    }

    register(email, password) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(this.auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    if (this.debug) console.log("user", user);
                    resolve(user);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                if (this.debug) console.log("Sign in with user: ", userCredential.user);
                resolve(user);
            }).catch((error) => {
                if (this.debug) console.log(error.code, error.message);
                reject(error);
            });
        })
    }


    sendEmailVerification() {
        return new Promise((resolve, reject) => {
            if (this.auth.currentUser === null) reject("Must be logged in to send email verification");
            if (this.auth.currentUser.emailVerified) reject("Email already verified");

            sendEmailVerification(this.auth.currentUser)
                .then(() => {
                    if (this.debug) console.log("send email verification");
                    resolve(true);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }

    forgotPassword(email) {
        return new Promise((resolve, reject) => {
            sendPasswordResetEmail(this.auth, email)
                .then(() => {
                    if (this.debug) console.log("send password reset email");
                    resolve(true);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }

    updatePassword(newPassword) {
        return new Promise((resolve, reject) => {
            if (this.auth.currentUser === null) {
                if (this.debug) console.log("Must be logged in to update password");
                reject("Must be logged in to update password")
            };
            const user = this.auth.currentUser;
            updatePassword(user, newPassword)
                .then(() => {
                    if (this.debug) console.log("update password");
                    resolve(true);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }

    logout() {
        return new Promise((resolve, reject) => {
            this.auth.signOut().then(() => {
                if (this.debug) console.log("Sign out");
                resolve(true);
            }).catch((error) => {
                if (this.debug) console.log(error.code, error.message);
                reject(error);
            });
        })
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            if (this.auth.currentUser === null) {
                if (this.debug) console.log("Must be logged in to get user info");
                reject("Must be logged in to get user info")
            };
            const user = this.auth.currentUser;
            const data = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                emailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
            };
            if (this.debug) console.log(data);
            resolve(data);
        });
    }

    updateUserInfo(newData) {
        return new Promise((resolve, reject) => {
            if (this.auth.currentUser === null) {
                if (this.debug) console.log("Must be logged in to update user info");
                reject("Must be logged in to update user info")
            };
            const user = this.auth.currentUser;
            updateProfile(user, newData)
                .then(() => {
                    if (this.debug) console.log("update user info");
                    resolve(true);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }

    updateUserEmail(newEmail) {
        return new Promise((resolve, reject) => {
            if (this.auth.currentUser === null) {
                if (this.debug) console.log("Must be logged in to update user email");
                reject("Must be logged in to update user email")
            };
            const user = this.auth.currentUser;
            user.updateEmail(newEmail)
                .then(() => {
                    if (this.debug) console.log("update user email");
                    resolve(true);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }

    deleteAccount() {
        return new Promise((resolve, reject) => {
            if (!this.ifCurrentUserLoggedIn()) reject("Must be logged in to re-authenticate")
            if (this.auth.currentUser === null) {
                if (this.debug) console.log("Must be logged in to delete user");
                reject("Must be logged in to delete user")
            };
            const user = this.auth.currentUser;
            deleteUser(user)
                .then(() => {
                    if (this.debug) console.log("delete user");
                    resolve(true);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }


    reauthenticate(password) {
        return new Promise((resolve, reject) => {
            if (!this.ifCurrentUserLoggedIn(reject, "Must be logged in to re-authenticate"));
            const user = this.auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, password);
            reauthenticateWithCredential(user, credential)
                .then(() => {
                    if (this.debug) console.log("re-authenticate");
                    resolve(true);
                })
                .catch((error) => {
                    if (this.debug) console.log(error.code, error.message);
                    reject(error);
                });
        })
    }

    ifCurrentUserLoggedIn(reject, prompt) {
        if (this.auth.currentUser === null) {
            if (this.debug) console.log(prompt);
            reject(prompt);
        }
    }


    // use functio to validate current user
    // give log more info
}




