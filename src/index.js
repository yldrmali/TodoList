const CHECK="fa-check-circle"
const UNCHECK="fa-circle-thin"
const LINE_THROUGH="lineThrough"

const projectList=document.querySelector('#projectList');
const projectInput=document.querySelector('.projectAdd > input');
const todoList=document.querySelector('#todoList');
const todoInput=document.querySelector('.todoAdd > input');

let PROJECT_LIST=[];
let TODO_LIST=[];
let idProject=0;
let idInput=0;


function addProject(name,idProject,trash){
    if(trash){ return}

    const item= `<li class="itemProject">
                    <p class="text" job="selector">${name}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${idProject}"></i>
                </li>`

    const positon='beforeend';
    projectList.insertAdjacentHTML(positon,item);
}

function addProjectInput(){
    const projectName=projectInput.value;
    if(projectName){
        addProject(projectName,idProject,false);
        PROJECT_LIST.push({
            name:projectName,
            idProject:idProject,
            trash:false
        });
        localStorage.setItem('PROJECT',JSON.stringify(PROJECT_LIST));
        idProject++;
        projectInput.value='';
    }  
}



function addTodo(toDo,idInput,done,trash,project){
    if(trash){ return}
    
    const DONE = done? CHECK: UNCHECK;
    const LINE= done? LINE_THROUGH: '';

    const item= `<li class="itemTodo">
                    <i class="fa ${DONE} co" job="complete" id="${idInput}"></i>
                    <p class="text ${LINE}" job="selector">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${idInput}"></i>
                    </li>`

                    const positon='beforeend';
                    todoList.insertAdjacentHTML(positon,item);
                    
}
                
function addTodoInput(){
    const toDo=todoInput.value;
    const activelist=document.querySelectorAll('ul#projectList li');
    console.log(activelist)
    var a=[...activelist].filter(each=>each.classList.contains('active'))
    if(!a.length){
        alert('choose a project')
    }
    const projectName=document.querySelector('li.active p').innerHTML;
    
    if(!projectName){
        console.log('hello')
    }
    if(toDo){
        addTodo(toDo,idInput,false,false,projectName);
        TODO_LIST.push({
            name:toDo,
            idInput:idInput,
            done:false,
            trash:false,
            project:projectName
        });
        localStorage.setItem('TODO',JSON.stringify(TODO_LIST));
        idInput++;
        todoInput.value='';
    }  
}                
                
              
let todoAll=localStorage.getItem('TODO');
let projectAll=localStorage.getItem('PROJECT')

if(todoAll||projectAll){
    if(todoAll){
        console.log('todo')
        TODO_LIST=JSON.parse(todoAll);
        idInput=TODO_LIST.length;
        loadTodo(TODO_LIST);
    }if(projectAll){
        PROJECT_LIST=JSON.parse(projectAll);
        idProject=PROJECT_LIST.length;
        loadProject(PROJECT_LIST)
    }
}else{
    console.log(TODO_LIST)
    TODO_LIST=[];
    PROJECT_LIST=[];
    idInput=0;
    idProject=0;
}


function loadTodo(array){
   todoList.innerHTML='';
   array.forEach(element => {
        addTodo(element.name,element.idInput,element.done,element.trash,element.project)
    });
}

function loadProject(array){
   array.forEach(element => {
        addProject(element.name,element.idProject,element.trash)
    });
}

function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);
    console.log(TODO_LIST[element.id])
    TODO_LIST[element.id].done=TODO_LIST[element.id].done?false:true;  
    console.log(element)
}

function removeTodo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    TODO_LIST[element.id].trash=true;
}

function removeProject(project){
    var selectedProject=project.previousSibling.previousSibling.innerHTML;
    project.parentNode.parentNode.removeChild(project.parentNode);
    PROJECT_LIST[project.id].trash=true;
    console.log(PROJECT_LIST[project.id].trash);
    let localStorageString=localStorage.getItem('TODO');
    let localStorageParsed=JSON.parse(localStorageString);
    let arr=localStorageParsed.filter(each=>each.project==selectedProject);
    for(let item of arr){
        item.trash=true;
    }
    localStorage.setItem('TODO',JSON.stringify(localStorageParsed));
    loadTodo(localStorageParsed)
}


document.addEventListener('keyup',(event)=>{
    if(event.keyCode ==13&&document.activeElement===todoInput){
        addTodoInput();    
    }else if(event.keyCode ==13&&document.activeElement===projectInput){
        addProjectInput();  
    }else{
        return
    }
})
document.addEventListener('click',(event)=>{
    if(event.target.id=='plus-input'){
        addTodoInput();    
    }else if(event.target.id==('plus-project')){
        addProjectInput();  
    }else{
        return
    }
})


const clear=document.querySelector('.todoClearAll i'); 
clear.addEventListener('click',()=>{
    if(confirm("are you sure to shred all")){
        localStorage.clear();
        location.reload();
    }
})


todoList.addEventListener('click',(event)=>{
    const element= event.target;
    const elementJob=element.attributes.job.value;

    if(elementJob=='complete'){
        completeToDo(element)
    }else if(elementJob=='delete'){
        removeTodo(element)
    }
    localStorage.setItem('TODO',JSON.stringify(TODO_LIST));
})


projectList.addEventListener('click',(event)=>{
    const element= event.target;
    const elementJob=element.attributes.job.value;
    const projectListItem=document.querySelectorAll('.itemProject')
    let arr=[...projectListItem];
    arr.forEach(item=>{
        if(item.classList.contains('active')){
            item.classList.remove('active')
        }else{
            return
        }
    })
    if(elementJob=='delete'){
        removeProject(element)
    }else if(elementJob=='selector'){
        event.target.parentNode.classList.add('active')
        projectSelector(event.target);
    }else{
        return
    }
    localStorage.setItem('PROJECT',JSON.stringify(PROJECT_LIST));
})


function projectSelector(data){
    let selected=localStorage.getItem('TODO');
    let array=JSON.parse(selected)
    if(array){
        console.log(array)
        let filteredTodo=array.filter(each=> (each.project== data.innerHTML))
        loadTodo(filteredTodo)
    }
}
