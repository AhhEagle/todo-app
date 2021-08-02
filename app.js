
    //Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector(".filter-todo");
const searchOption = document.querySelector("#search-box");

//Event listeners 
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('change', filterTodo);
searchOption.addEventListener('keyup',searchTodo)

let itemToEdit = null;


let todoArray = [];


function getTodoArray(mytodo){
     todoArray.push(mytodo);
}

function editText(element){

    const id = element.target.parentElement.id
    if(element.target.parentElement.classList.contains('completed')){
        return ;
    }
    var textToEdit = element.path[1].children[0].innerText;
    console.log(todoInput.innerText);
    todoInput.value=textToEdit;
    itemToEdit = JSON.parse(localStorage.getItem('todos')).find(item => item.id === parseInt(id))
    console.log(itemToEdit)
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

function updateTodo(){
    const todos  = JSON.parse(localStorage.getItem('todos')) || []
    const index = todos.findIndex(item => item.id === itemToEdit.id)
    if(index !== -1){
        
        
        itemToEdit.myTodo = todoInput.value
        todos.splice(index, 1, itemToEdit)

        localStorage.setItem('todos', JSON.stringify(todos))

        renderTodos(todos)
        todoInput.value = ''
        itemToEdit = null;
        return ;
    }
}

//Functions
function addTodo(event){
    
    event.preventDefault();
    if(itemToEdit){
        return updateTodo()
    }
    //create DIV

    const todoItem = saveTodo(todoInput.value)

    renderTodoItem(todoItem)

    
    todoInput.value ="";
}
function saveTodo(value){
    var todoObject = saveLocalTodos(value);
    return todoObject
}
function renderTodoItem(todoObject){
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");

    //Create LI
    const newTodo = document.createElement('li');

    newTodo.innerText= todoObject.myTodo;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    //Add tp local storage for persistence
    

    todoDiv.setAttribute('id', todoObject.id)

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

}

function deleteCheck(e){
    const item = e.target;

    //Delete todo
    if(item.classList[0] === "trash-btn"){
        console.log('called here delete')
        
        const todo = item.parentElement;
        //animation
        todo.classList.remove('completed')
        
        todo.classList.add('fall');
        removeLocalTodos(todo)
        todo.addEventListener("transitioned", function(){
            todo.remove();
        });
    }

    //check mark
    if(item.classList[0] === "complete-btn"){
        console.log('not called')
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
           
           if(todo.classList.contains('completed')){
               todo.style.display ="none";
           } else{
               todo.style.display = "flex";
           }
           break;
        }
    });
}

function searchTodo(e){
    e.preventDefault()
    const text = e.target.value;
    // get the todos

    const todos = JSON.parse(localStorage.getItem('todos'))
    
    const matchedTodos = todos.filter(item => item.myTodo.includes(text))
    console.log(matchedTodos)
    renderTodos(matchedTodos)
    
}


 function getSavedTodos(){
     return  JSON.parse(localStorage.getItem('todos')) || []
 }

//Persistence
function saveLocalTodos(todo){
   //Check if todo already perists
   console.log('called here ')
   let todos = getSavedTodos()

   const getTime =  new Date(new Date().getTime() - 2*24*60*60*1000).toLocaleDateString() 
   +
   " || "+ new Date(new Date().getTime() + 4*60*60*1000).toLocaleTimeString(); 
   
   const todoObject ={
       'myTodo': todo,
       'time':  getTime,
       id: new Date().getTime()
   } 

   todos.push(todoObject);
   localStorage.setItem('todos',  JSON.stringify(todos));

   return todoObject;
}


function getTodos(){
    
    renderTodos(getSavedTodos())

     return getSavedTodos();

 }

 function emptyTodoContainer(){
     document.querySelector('.todo-list').innerHTML = ''
     
 }

 function renderTodos(todos){
    emptyTodoContainer()
    todos.forEach(function(todo){
        //create DIV

        renderTodoItem(todo)

  });
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

