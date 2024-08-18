#!/usr/bin/env node
//intializing cli
var fs = require("fs");
const path = "storage.json";
const orgs = process.argv;

const initialCliValue = `Hello welcome to your cmd todo list.

Here are the commands to use taskcli:
-->RUN taskcli add TODO : To add a todo
-->RUN taskcli list: To see all todos
-->RUN taskcli done ID:To mark-done todo
-->RUN taskcli in-progres TODOID:To mark-in-progress todo
-->RUN taskcli delete TODOID:To delete a todo
-->RUN taskcli list done:To see all done todos
-->RUN taskcli list in-progress:To see all inprogress todo
`;

//start the app
const startApp = () => {
  console.log(initialCliValue);
};

//adding a todo
const addTodo = () => {
  try {
    fs.readFile(path, "utf-8", (err, data) => {
      let updatedJson;
      let jsonData;
      jsonData = JSON.parse(data);

      const lastIndex = jsonData.todos.length - 1;
      updatedJson = {
        "id": jsonData.todos[lastIndex].id + 1,
        "todo": orgs[3],
        "status": "IN PROGRESS",
      };
      jsonData.todos.push(updatedJson);
      const updatedData = JSON.stringify(jsonData, null, 2);

      fs.writeFile(path, updatedData, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("todo added!");
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

//listing all todos
const getAllTodos = () => {
  try {
    const filter = orgs[3];
    fs.readFile(path, (err, data) => {
      const todos = JSON.parse(data);

      if (!Array.isArray(todos.todos)) {
        console.error(
          'Error: Invalid JSON data structure. "todos" should be an array.'
        );
        return;
      }
      if (filter === "done") {
        const filteredTodos = todos.todos.filter(
          (todo) => todo.status === "DONE"
        );
        const formattedTodos = filteredTodos
          .map((todo) => {
            return `- ID: ${todo.id}\n  Todo: ${todo.todo}\n  Status:${todo.status}\n`; // Clear formatting with indentation
          })
          .join("");

        console.log(formattedTodos);
      } else if (filter === "in-progress") {
        const filteredTodos = todos.todos.filter(
          (todo) => todo.status === "IN PROGRESS"
        );
        const formattedTodos = filteredTodos
          .map((todo) => {
            return `- ID: ${todo.id}\n  Todo: ${todo.todo}\n  Status:${todo.status}\n`; // Clear formatting with indentation
          })
          .join("");

        console.log(formattedTodos);
      } else {
        const formattedTodos = todos.todos
          .map((todo) => {
            return `- ID: ${todo.id}\n  Todo: ${todo.todo}\n  Status:${todo.status}\n`; // Clear formatting with indentation
          })
          .join("");

        console.log(formattedTodos);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

//updating a todo
const updateTodo = () => {
  try {
    const id = orgs[3];
    console.log("id is " + id);
    fs.readFile(path, "utf-8", (err, data) => {
      const jsonData = JSON.parse(data);
      const targetTodo = jsonData.todos[id - 1];
      targetTodo.todo = orgs[4];
      const updatedData = JSON.stringify(jsonData, null, 2);
      fs.writeFile(path, updatedData, (err) => {
        if (err) {
          console.error(err);
        }
        console.log("Todo updated!");
      });
    });
  } catch (error) {
    console.error(error);
  }
};

//update Status
const updateStatus = (status) => {
  try {
    const id = orgs[3];
    fs.readFile(path, "utf-8", (err, data) => {
      const jsonData = JSON.parse(data);
      const targetTodo = jsonData.todos[id - 1];

      targetTodo.status = status ? "DONE" : "IN PROGRESS";
      const updatedData = JSON.stringify(jsonData, null, 2);
      fs.writeFile(path, updatedData, (err) => {
        if (err) {
          console.error(err);
        }
        console.log("Todo updated!");
      });
    });
  } catch (error) {
    console.log(error);
  }
};
//delete a todo
const deleteTodo = () => {
  try {
    const id = orgs[3];
    fs.readFile(path, "utf-8", (data) => {
      const jsonData = JSON.parse(data);

      jsonData.todos.splice(id - 1, 1);
      const updatedData = JSON.stringify(jsonData, null, 2);
      fs.writeFile(path, updatedData, (err) => {
        if (err) {
          console.error(err);
        }
        console.log("Todo deleted!");
      });
    });
  } catch (error) {
    console.error(error);
  }
};
//application

if (!orgs[2]) {
  startApp();
}

switch (orgs[2]) {
  case "add":
    addTodo();
    break;
  case "update":
    updateTodo();
    break;
  case "done":
    updateStatus(true);
    break;
  case "in-progress":
    updateStatus(false);
    break;
  case "delete":
    deleteTodo();
    break;
  case "list":
    getAllTodos();
    break;
  default:
    break;
}
