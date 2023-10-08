window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
window.IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;
window.IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// check if browser support indexedDB
if (!window.indexedDB) {
  alert("your browser not support indexedDB");
}

let records = [];
let db;
let id = 0;
let request = window.indexedDB.open("testDB", 1);
request.onerror = function (e) {
  alert(e);
};

request.onsuccess = function () {
  db = request.result;
  console.log("The database is opened successfully");
  boot();
};

request.onupgradeneeded = function (e) {
  db = e.target.result;
  let objectStore = db.createObjectStore("Todo", { keyPath: "id" });
};

const addButton = document.querySelector(".addButton");
let input = document.querySelector(".input");
const container = document.querySelector(".container");

/**
 * Represents an item in a to-do list.
 * @class
 */
class item {
  constructor(itemName) {
    //delegalte to another function to create div
    this.createDiv(itemName);
  }
  /**
   * Creates a new item div with an input field, edit and remove buttons.
   * @param {string} itemName - The name of the item to be added to the input field.
   */
  createDiv(itemName) {
    let input = document.createElement("input");
    input.value = itemName;
    input.disabled = true;
    input.classList.add("item_input");
    input.type = "text";

    let itemBox = document.createElement("div");
    itemBox.classList.add("item");

    let editButton = document.createElement("button");
    editButton.innerHTML = "EDIT";
    editButton.classList.add("editButton");

    let removeButton = document.createElement("button");
    removeButton.innerHTML = "REMOVE";
    removeButton.classList.add("removeButton");

    container.appendChild(itemBox);

    itemBox.appendChild(input);
    itemBox.appendChild(editButton);
    itemBox.appendChild(removeButton);

    editButton.addEventListener("click", () => this.edit(input));

    removeButton.addEventListener("click", () =>
      this.remove(itemBox, input.value)
    );
  }

  /**
   * Edits the value of an input element by prompting the user for a new value.
   * @param {HTMLInputElement} input - The input element to be edited.
   */
  edit(input) {
    const newInput = prompt("Enter new msg:", "change the task");
    // old value in todos
    const oldVal = input.value;
    if (newInput !== "") {
      input.value = newInput;
    }
    Edit(newInput);
  }

  /**
   * Removes the specified item from the container.
   * @param {HTMLElement} item - The item to remove.
   * @param {string} value - The value to remove.
   */
  remove(item, value) {
    container.removeChild(item);
    let todo =  records.find((record) => record.todoTitle === value);
    DeleteUser(todo.id);
  }
}


/**
 * Adds a new todo item to the list.
 * @function
 * @name addTodo
 * @returns {void}
 */
function addTodo() {
  if (input.value != "") {
    new item(input.value);
    add(input.value);
    input.value = "";
  }
}


/**
 * This function boots up the application by calling the ReadAll function.
 */
function boot() {
  ReadAll();
}

addButton.addEventListener("click", addTodo);

/**
 * Adds a new todo item to the database.
 * @param {string} todoTitle - The title of the todo item to be added.
 */
function add(todoTitle) {
  let request = db.transaction(["Todo"], "readwrite").objectStore("Todo").add({
    id: ++id,
    todoTitle: todoTitle,
  });
  console.log(id);

  request.onerror = function (err) {
    alert(`unabled to add data`);
  };

  request.onsuccess = function () {
    alert(`successfully added`);
  };
}

/**
 * Reads all records from the "Todo" object store and populates the `records` array.
 */
function ReadAll() {
  let request = db.transaction(["Todo"]).objectStore("Todo").openCursor();
  request.onsuccess = function (e) {
    let cursor = e.target.result;
    if (cursor) {
      new item(cursor.value.todoTitle);
      records.push(cursor.value);
      cursor.continue();
    }
    id = records.length;
  };
}
/**
 * Updates the title of a todo item in the database.
 * @param {string} newTitle - The new title for the todo item.
 */
function Edit(newTitle) {
  let request = db.transaction(["Todo"], "readwrite").objectStore("Todo").put({
    id: id,
    todoTitle: newTitle,
  });
  request.onerror = function (e) {
    alert(e);
  };

  request.onsuccess = function () {
    alert(`updated successfully`);
  };
}

/**
 * Deletes a user with the given ID from the "Todo" object store.
 * @param {number} id - The ID of the user to delete.
 */
function DeleteUser(id) {
  let request = db
    .transaction(["Todo"], "readwrite")
    .objectStore("Todo")
    .delete(id);

  request.onerror = function (e) {
    alert(e);
  };
  request.onsuccess = function () {
    alert("Todo successfully deleted");
  };
  
}
