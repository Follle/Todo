const buttonAddTask = document.querySelector('.btn-light');
const handlerEnterAddTask = document.querySelector('.enter-add-task-input');
const tasksList= document.querySelector('.tasks-list');
const selectAllTasks = document.querySelector('.btn-outline-success');
const deleteAllTasks = document.querySelector('.btn-outline-danger');
const inputSaveTasks = document.createElement('input');
const showStatusTasks = document.querySelector('.button-status');
const buttonAllTasks = document.getElementById('all');
const buttonCompletedTasks = document.getElementById('completed');
const buttonActiveTasks = document.getElementById('active');
const pagination = document.querySelector('.pagination');

let tasksArray = [];
let checkAllCount= 0;
let notCheckAllCount= 0;
let filtrationStatus = 'all';
let currentPage = 0;
let countElements = 5;
let page = 1;
let lastPage = 1;

function addTask () {
    if (handlerEnterAddTask.value.trim() !== '') {
        tasksArray.push({
            id: Date.now(),
            text: handlerEnterAddTask.value.replace(/\s+/g, ' ').trim(),
            isChecked: false,
        });
        page = Math.ceil(filterArray().length / countElements);
        handlerEnterAddTask.value = '';
        render();
        thisPage(page);
    }
}

function filterArray() {
    switch (filtrationStatus) {
        case 'completed': {
            return tasksArray.filter((item) => item.isChecked);
    }
        case 'active': {
            return tasksArray.filter((item) => !item.isChecked);
    }
        case 'all': {
            return tasksArray;
    }
        default: return tasksArray;
    }
}
function getSlicedArray() {
    const tempArray = filterArray();
    const startPosition = currentPage * countElements;
    const endPosition = startPosition + countElements;
    const slicedArray = tempArray.slice(startPosition, endPosition);
    return ({ slicedArray, countOfTasks: tempArray.length });
}

function createPageButtons() {
    let pages = '';
    const count = filterArray().length;
    totalPage = Math.ceil(count / countElements);
    lastPage = totalPage;
    for (let i = 0; i < totalPage; i += 1) {
        pages += `<button class="page" id="${i+1}">${i + 1}</button>`;
    }
    pagination.innerHTML = pages;
}

function thisPage(newPage){
    if(newPage !== lastPage){
        page = newPage;
    }else {
        page = Math.ceil(filterArray().length / countElements)
    }
}

function render() {// the main function that displays all the functionality
    thisPage(page);
    const configuredTodos = filterArray()
    .slice((page -1) * countElements, page * countElements)
    tasksList.innerHTML= "";
    configuredTodos.forEach((elem) => {
        tasksList.innerHTML += `<div class="task" id="  ${elem.id}  ">
        <input type="checkbox" class="checkbox-left" style = "transform:scale(1.5)"${elem.isChecked ? 'checked' : ''}>
        <label>${_.escape(elem.text)}</label>
        <button class="btn btn-danger"">X</button> `
    });
    createPageButtons();
    countCheckTasks();
    inputSaveTasks.onblur = saveTaskOnBlur;
}

function deleteTask(event){ // delete selected checkbox
    const taskId = Number(event.target.parentElement.id);
    if (event.target.tagName === 'BUTTON'){
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray.splice(elem, 1);
        countCheckTasks();
        render();
    }
    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox'){
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray[elem].isChecked = !tasksArray[elem].isChecked;
    if (event.target.tagName === 'Enter') {
        addTask();
    }
    countCheckTasks();
    render();
    }
}

function checkAllTasks(){// make all checkboxes done
    tasksArray.forEach((elem)=>elem.isChecked = !elem.isChecked);
    render();
}

function checkAndDeleteAllTasks(){// delete all Tasks
    tasksArray = tasksArray.filter((item) => !item.isChecked)
    render();
}

function handleEnterSave (event) { // save  when pressing a button enter  
    if (event.code === 'Enter') {
    addTask();
    }
}

function addChangeTask(event){ //editing existing
    const taskId = Number(event.target.parentElement.id);
    const temp = event.target;
    if (event.target.tagName === 'LABEL')
       {
        inputSaveTasks.value = tasksArray[tasksArray.findIndex((item) => item.id === taskId)].text;
        inputSaveTasks.id = taskId;
        temp.replaceWith(inputSaveTasks);
        inputSaveTasks.focus();
        
    }
}

function saveInputTask(event){
    const taskId = Number(event.target.parentElement.id);
    const temp = event.target;
    if (inputSaveTasks.value.trim() !== '') {
        if
        (event.code === 'Enter') { // save changes when pressing a button enter  
            tasksArray[tasksArray.findIndex((item) => Number(item.id) === Number(inputSaveTasks.id))].text = inputSaveTasks.value;
            render();
        }
    }
    else{
        inputSaveTasks.value = tasksArray[tasksArray.findIndex((item) => item.id === taskId)].text;
        inputSaveTasks.id = taskId;
        temp.replaceWith(inputSaveTasks);
        inputSaveTasks.focus();
    }

    if (event.code === 'Escape'){//cancels changes when pressing a button escape
        render();
    }
}

function saveTaskOnBlur(event) {
    const taskId = Number(event.target.parentElement.id);
    const temp = event.target;
    if (inputSaveTasks.value.trim() !== '') {
        if (event.sourceCapabilities !== null) {
            tasksArray[tasksArray.findIndex((item) => Number(item.id) === Number(inputSaveTasks.id))].text = inputSaveTasks.value;
            render();
        }   
    }
    else{
        inputSaveTasks.value = tasksArray[tasksArray.findIndex((item) => item.id === taskId)].text;
        inputSaveTasks.id = taskId;
        temp.replaceWith(inputSaveTasks);
        inputSaveTasks.focus();
    }
}

function countCheckTasks(){// counts selected 
    checkAllCount = tasksArray.filter((item) => item.isChecked).length;
    notCheckAllCount = tasksArray.length - checkAllCount;
    buttonAllTasks.textContent = `All(${tasksArray.length})`;
    buttonCompletedTasks.textContent = `Completed(${tasksArray.length-notCheckAllCount})`;
    buttonActiveTasks.textContent = `Active(${tasksArray.length-checkAllCount})`;
}

function checkCurrentPage(event) {
    if(event.target.classList.contains('page')){
        page = Number(event.target.id);
        thisPage(page);
    }
    render();
}

function chooseTaskStatus(event){
    currentPage = 0;
    switch(event.target.id) {

        case 'all':
            filtrationStatus = 'all';
            render();
            break;
        case 'completed':
            filtrationStatus = 'completed';
            render();
            break;
        case 'active':
            filtrationStatus = 'active';
            render();
        default:
            break;
    }
}

pagination.addEventListener('click', checkCurrentPage);
showStatusTasks.addEventListener('click',chooseTaskStatus);
inputSaveTasks.addEventListener('keydown', saveInputTask);
handlerEnterAddTask.addEventListener('keydown', handleEnterSave);
selectAllTasks.addEventListener('click', checkAllTasks);
deleteAllTasks.addEventListener('click', checkAndDeleteAllTasks);
tasksList.addEventListener('dblclick', addChangeTask);
tasksList.addEventListener('click', deleteTask);
buttonAddTask.addEventListener('click', addTask);