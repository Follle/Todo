const btn = document.querySelector('.add-btn');
const inp = document.querySelector('.i-1');
const tasksList= document.querySelector('.tasks-list');
const selectAll = document.querySelector('.i-2');
const cancel = document.querySelector('.i-3');
const input = document.createElement('input');

let tasksArray = [];

function addTask () {
    tasksArray.push({
        id: Date.now(),
        text: inp.value,
        isChecked: false,
    }); 
    render();
}

function render() {
    tasksList.innerHTML= "";
    tasksArray.forEach((elem) => tasksList.innerHTML += `<div id="${elem.id}">
    <input type="checkbox" ${elem.isChecked ? 'checked' : '' }><label>${elem.text}</label>
    <button>X</button>
    </div>`);
    
}

function changes(event){
    const taskId = Number(event.target.parentElement.id);
    if (event.target.tagName === 'BUTTON'){
        // tasksArray = tasksArray.filter((item)=> item.id !== taskId);
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray.splice(elem, 1);
        render();
    }

    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox'){
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray[elem].isChecked = !tasksArray[elem].isChecked;
        if (event.target.tagName === 'Enter') {
        addTask();
    }
        render();
    }
}
function checkAll(){
    tasksArray.forEach((elem)=>elem.isChecked =true);
    render();
}

function checkAndDelete(){
   tasksArray = tasksArray.filter((item) => !item.isChecked)
   render();
}

function handleEnter (event) {
    if (event.code === 'Enter') {
        addTask();
    }
}

function editTask(event){
    const taskId = Number(event.target.parentElement.id);
    const temp = event.target;
    if (event.target.tagName === 'LABEL')
    {
        input.value = tasksArray[tasksArray.findIndex((item) => item.id === taskId)].text;
        temp.replaceWith(input);
        input.focus();
        if (event.code === 'Enter') {
            tasksArray[tasksArray.findIndex((item) => item.id === taskId)].text = input.value;
        }
        
    }
}

function saveinput(){
    
}



input.addEventListener('keydown', saveinput);
inp.addEventListener('keydown', handleEnter);
selectAll.addEventListener('click', checkAll);
cancel.addEventListener('click', checkAndDelete);
tasksList.addEventListener('dblclick', editTask);
tasksList.addEventListener('click', changes);
btn.addEventListener('click', addTask);