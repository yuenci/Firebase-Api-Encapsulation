import { FBStore } from "./scripts/storeHandler.js";
import { FBStorage } from "./scripts/storageHandler.js";
import { FBAuth } from "./scripts/authHandler.js";


async function clickEvent() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const user = {
        id: id,
        name: name,
        password: password
    };

    const fbStore = new FBStore();
    fbStore.debug = true;

    // write to firestore without documentID
    // let docid = await fbStore.write("users", user);
    // console.log(docid);

    // write to firestore with documentID
    //fbStore.write("users", user, 333333);

    // update document
    // fbStore.update("users", user, 333333);

    // delete document
    // fbStore.delete("users", 1111);

    // read document
    // fbStore.readDocument("users", 333333).then((data) => {
    //     console.log(data);
    // });

    // read collection
    // fbStore.readCollection("users").then((data) => {
    //     console.log(data);
    // });

    // simple query
    // let query = ["age", ">=", 20];
    // fbStore.query("users", query)


    // compound query
    // let queries = [["age", ">=", 20], ["age", "<=", 30]];
    // let order = ["age", "asc"];
    // fbStore.query("users", queries, order)

    // use cache
    // fbStore.readCollection("users").then((data) => {
    //     console.log("data", data);
    //     console.log("cache", fbStore.cache.users);
    // });

}

document.getElementById("btn").addEventListener("click", clickEvent);


////////////////////////// storeHandler.js //////////////////////////

// region storeHandler.js

let email = document.getElementById("email-au").value;
let password = document.getElementById("password-au").value;

function getEmailAndPassword() {
    email = document.getElementById("email-au").value;
    password = document.getElementById("password-au").value;
}


const fbAuth = new FBAuth();
fbAuth.debug = true;
function register() {
    // register
    getEmailAndPassword();
    fbAuth.register(email, password).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-re").addEventListener("click", register);

function login() {
    getEmailAndPassword();
    // login
    fbAuth.login(email, password).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-lo").addEventListener("click", login);

function sendVaildEmail() {
    //send email verification
    fbAuth.sendEmailVerification().then((res) => {
        if (res) console.log("send email verification");
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-se").addEventListener("click", sendVaildEmail);


function sendEmailResetMail() {
    //send email reset password
    getEmailAndPassword();
    fbAuth.forgotPassword(email).then((res) => {
        if (res) console.log("send email reset password");
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-ree").addEventListener("click", sendEmailResetMail);

function logout() {
    //logout
    fbAuth.logout().then((res) => {
        if (res) console.log("logout");
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-out").addEventListener("click", logout);


function getUserInfo() {
    //get user info
    fbAuth.getUserInfo().then((userInfo) => {
        console.log(userInfo);
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-get").addEventListener("click", getUserInfo);

function updateUserInfo() {
    //update user info
    let data = {
        displayName: "innis",
        phoneNumber: "0912345678",
        photoURL: "https://utoolsfigurebed.oss-cn-hangzhou.aliyuncs.com/1.jpg",
    }

    fbAuth.updateUserInfo(data).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-up").addEventListener("click", updateUserInfo);


function updatePassword() {
    getEmailAndPassword();

    //update password
    fbAuth.updatePassword(password).then((res) => {
        console.log(res);
    }
    ).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-pwd").addEventListener("click", updatePassword);

function deleteAccount() {
    //delete account
    fbAuth.deleteAccount().then((res) => {
        if (res) console.log("delete account");
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-del").addEventListener("click", deleteAccount);


function reauthenticate() {
    getEmailAndPassword();

    //reauthenticate
    fbAuth.reauthenticate(password).then((res) => {
        if (res) console.log("reauthenticate");
    }).catch((error) => {
        console.log(error);
    });
}
document.getElementById("btn-au-reAu").addEventListener("click", reauthenticate);

// endregion storeHandler.js


////////////////////////// storageHandler.js //////////////////////////
// region storageHandler.js


let files
document.getElementById("file-input").addEventListener("change", (e) => {
    // just image
    files = e.target.files;
});

document.getElementById("btn-st").addEventListener("click", () => {
    let storage = new FBStorage();
    storage.debug = true;

    for (let file of files) {
        storage.uploadFile(file, file.name).then((url) => {
            console.log(url);
        }).catch((error) => {
            console.log(error);
        });
    }
});

document.getElementById("btn-st-del").addEventListener("click", () => {
    let storage = new FBStorage();
    storage.debug = true;
    storage.deleteFile("123456.jpg").then((res) => {
        if (res) console.log("delete file success");
    }).catch((error) => {
        console.log(error);
    });
});

document.getElementById("btn-st-getAll").addEventListener("click", () => {
    let storage = new FBStorage();
    storage.debug = true;
    storage.getAllImages().then((images) => {
        console.log(images);
    }).catch((error) => {
        console.log(error);
    });
});