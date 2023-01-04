import { FBStore } from "./scripts/storeHandler.js";
import { FBStorage } from "./scripts/storageHandler.js";
import { firebaseConfig } from "./scripts/config.js";


async function clickEvent() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const user = {
        id: id,
        name: name,
        password: password
    };

    const fbStore = new FBStore(firebaseConfig);
    fbStore.debug = true;
    // let docid = await fbStore.write("users", user);
    // console.log(docid);

    //fbStore.write("users", user, 333333);

    // fbStore.update("users", user, 333333);

    // fbStore.delete("users", 1111);

    // fbStore.readDocument("users", 333333).then((data) => {
    //     console.log(data);
    // });

    // fbStore.readCollection("users").then((data) => {
    //     console.log(data);
    // });

    // let query = {
    //     age: [">=", 20]
    // }
    let query = ["age", ">=", 20];
    fbStore.query("users", query)


    // let queries = [["age", ">=", 20], ["age", "<=", 30]];
    // let order = ["age", "asc"];
    // fbStore.query("users", queries, order)

}

document.getElementById("btn").addEventListener("click", clickEvent);