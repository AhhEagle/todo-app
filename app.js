//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector(".filter-todo");
const searchOption = document.querySelector(".search-todo");


//Event listeners 
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);
searchOption.addEventListener('change',searchTodo);

let todoArray = [];


function getTodoArray(mytodo){
     todoArray.push(mytodo);
}

function editText(element){
    var textToEdit = element.path[1].children[0].innerText;
    console.log(todoInput.innerText);
    todoInput.value=textToEdit;
    
}

// Main functionality
function copyText(element) {
  
    var textToCopy = element.path[1].children[0].innerText;
    var myTemporaryInputElement = document.createElement("input");
    myTemporaryInputElement.type = "text";
    myTemporaryInputElement.value = textToCopy;
    document.body.appendChild(myTemporaryInputElement);
    myTemporaryInputElement.select();
    document.execCommand("Copy");
    document.body.removeChild(myTemporaryInputElement);
    alert('Text Copied');
}

//Functions
function addTodo(event){
    event.preventDefault();
    //create DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");

    //Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText= todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    //Add tp local storage for persistence
    var todoObject = saveLocalTodos(todoInput.value);

    //Create LI for time
    const newTodoTime = document.createElement('li');
    newTodoTime.innerText= todoObject.time;
    newTodoTime.classList.add('subtitle');
    todoDiv.appendChild(newTodoTime);


    //Check mark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML= '<i class="fas fa-check"></i>'
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton)

    //Check trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML= '<i class="fas fa-trash"></i>'
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton)

    //Copy button
    const copyButton = document.createElement('button');
    copyButton.innerHTML= '<i class="fas fa-copy"></i>'
    copyButton.classList.add('copy-btn');
    copyButton.addEventListener('click',copyText);
    todoDiv.appendChild(copyButton)

    //Edit button
    const editButton = document.createElement('button');
    editButton.innerHTML= '<i class="fas fa-edit"></i>'
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click',editText);
    todoDiv.appendChild(editButton)


    //Append to List
    todoList.appendChild(todoDiv)

    todoInput.value ="";
}

function deleteCheck(e){
    const item = e.target;

    //Delete todo
    if(item.classList[0] === "trash-btn"){
        const todo = item.parentElement;
        //animation
        todo.classList.add('fall');
        removeLocalTodos(todo)
        todo.addEventListener("transitioned", function(){
            todo.remove();
        });
    }

    //check mark
    if(item.classList[0] === "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle('completed')
    }
}

function filterTodo(e){
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                todo.style.display ="flex";
                break;
            case "completed":
                if(todo.classList.contains('completed')){
                   todo.style.display ="flex";
                } else{
                    todo.style.display = "none";
                }
                break;
           case "uncompleted":
           
           if(todo.classList.contains('uncompleted')){
               todo.style.display ="flex";
           } else{
               todo.style.display = "none";
           }
           break;
        }
    });
}

function searchTodo(e){
    // const todos = todoList.childNodes;

    // if(todoArray.includes(e.data)){
    //     todo.style.display ="flex";
    // }else{
    //     todo.style.display = "none";
    // }

    console.log(e)
    
}


console.log( JSON.parse(localStorage.getItem('todos')));

//Persistence
function saveLocalTodos(todo){
   //Check if todo already perists
   let todos;
   if (localStorage.getItem('todos') === null){
       todos = [];
   }else{
       todos = JSON.parse(localStorage.getItem('todos'));
   }

   const getTime =  new Date(new Date().getTime() - 2*24*60*60*1000).toLocaleDateString() 
   +
   " || "+ new Date(new Date().getTime() + 4*60*60*1000).toLocaleTimeString(); 
   
   const todoObject ={
       'myTodo': todo,
       'time':  getTime
   } 

   todos.push(todoObject);
   localStorage.setItem('todos',  JSON.stringify(todos));

   return todoObject;
}


function getTodos(){
    
    //Check if todo already perists
    if (localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function(todo){
          //create DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    
    //Create LI for todo
    const newTodo = document.createElement('li');
    newTodo.innerText= todo.myTodo;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    //Create LI for time
    const newTodoTime = document.createElement('li');
    newTodoTime.innerText= todo.time;
    newTodoTime.classList.add('subtitle');
    todoDiv.appendChild(newTodoTime);


    //Check mark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML= '<i class="fas fa-check"></i>'
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton)

    //Check trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML= '<i class="fas fa-trash"></i>'
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton)

     //Copy button
     const copyButton = document.createElement('button');
     copyButton.innerHTML= '<i class="fas fa-copy"></i>'
     copyButton.classList.add('copy-btn');
     copyButton.addEventListener('click',copyText);
     todoDiv.appendChild(copyButton)
 
     //Edit button
     const editButton = document.createElement('button');
     editButton.innerHTML= '<i class="fas fa-edit"></i>'
     editButton.classList.add('edit-btn');
     editButton.addEventListener('click',editText);
     todoDiv.appendChild(editButton)


    //Append to List
    todoList.appendChild(todoDiv)
    });

     return todos;

 }



function removeLocalTodos(todo){
    //Check if todo already perists
    let todos;
    if (localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    

    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos))

 }
