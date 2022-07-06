const toDoForm = document.getElementById('toDo-form');
const toDoList = document.getElementById('toDo-list');
const toDoInput = toDoForm.querySelector('input');
const TODO_KEY = 'toDos';
let toDos = [];

function saveToDo() {
    localStorage.setItem(TODO_KEY, JSON.stringify(toDos));
}

function removeToDo(event) {
    const li = event.target.parentNode;
    toDos = toDos.filter((todo) => todo.id !== parseInt(li.id));
    li.remove();
    saveToDo();
}

function toDoMake(toDoObj) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = "toDo";
    const span = document.createElement('span');
    const button = document.createElement('button');
    span.innerText = toDoObj.text;
    button.innerText = "지우기";
    li.id = toDoObj.id;
    button.addEventListener('click', removeToDo)
    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
}

function test(item) {
    console.log('this is ', item);
}

function toDoSubmit(event) {
    event.preventDefault();
    const newToDo = toDoInput.value;
    toDoInput.value = "";
    const newToDoObj = {
        text: newToDo,
        id: Date.now(),
    };
    toDos.push(newToDoObj);
    toDoMake(newToDoObj);
    saveToDo();
}

toDoForm.addEventListener('submit', toDoSubmit);

const saveToDos = localStorage.getItem(TODO_KEY);

if(saveToDos !== null) {
    const parseToDo = JSON.parse(saveToDos);
    toDos = parseToDo;
    parseToDo.forEach(toDoMake);
}
