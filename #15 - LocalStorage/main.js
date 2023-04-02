const todosList = document.querySelector(".list");
const addList = document.querySelector(".add-list");
const btnGroup = document.querySelector(".btn-group");
const todos = JSON.parse(localStorage.getItem("items")) || [];

function addTodo(e) {
  e.preventDefault();
  const text = this.querySelector("[name=item]").value;
  const todo = {
    text: text,
    done: false,
  };
  todos.push(todo);
  localStorage.setItem("items", JSON.stringify(todos));
  populateList(todos, todosList);
  this.reset();
}

function populateList(todo = [], todosList) {
  if (todo.length < 1) {
    todosList.innerHTML = "<li>List is empty...</li>";
    return;
  }
  todosList.innerHTML = todo
    .map((item, i) => {
      return `
        <li>
        <input type="checkbox" data-index="${i}" id="item${i}" ${
        item.done ? "checked" : ""
      }>
        <label for="item${i}">${item.text}</label>
        </li>
        `;
    })
    .join("");
}

function toggleDone(e) {
  if (e.target.nodeName != "INPUT") return;
  const el = e.target;
  const index = el.dataset.index;
  todos[index].done = !todos[index].done;
  localStorage.setItem("items", JSON.stringify(todos));
  populateList(todos, todosList);
}

function handleBtn(e) {
  switch (e.target.id) {
    case "clear":
      localStorage.removeItem("items", "");
      todosList.innerHTML = "<li>List is empty...</li>";
      break;
    case "check":
      todos.map((item) => {
        return (item.done = true);
      });
      localStorage.setItem("items", JSON.stringify(todos));
      populateList(todos, todosList);
      break;
    case "uncheck":
      todos.map((item) => {
        return (item.done = false);
      });
      localStorage.setItem("items", JSON.stringify(todos));
      populateList(todos, todosList);
      break;
    default:
      break;
  }
}

populateList(todos, todosList);
btnGroup.addEventListener("click", handleBtn);
todosList.addEventListener("click", toggleDone);
addList.addEventListener("submit", addTodo);
