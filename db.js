/* 
    1. Open DB
    2. Create ObjectStore
    3. Make Transactions
*/

let db;
const openRequest = indexedDB.open("myDataBase");

openRequest.addEventListener("success", (e) => {
  console.log("DB Success");
  db = openRequest.result;
});

openRequest.addEventListener("error", (e) => {
  console.log("DB Error");
});

openRequest.addEventListener("upgradeneeded", (e) => {
  console.log("DB Upgraded");
  db = openRequest.result;

  db.createObjectStore("video", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});
