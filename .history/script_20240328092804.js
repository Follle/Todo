const btn = document.querySelector('.add-btn');
const inp = document.querySelector('.i-1');
const tasksList= document.querySelector('.tasks-list');
const selectAll = document.querySelector('.i-2');
const cancel = document.querySelector('.i-3');
const showAllCompleted = document.querySelector('.i-4');
const input = document.createElement('input');
const showStatus = document.querySelector('.tab-btn');
const btnAll = document.getElementById('all');
const btnCompleted = document.getElementById('completed');
const btnActive = document.getElementById('active');


let tasksArray = [];
let checkAllCount=[];
let notCheckAllCount=0;
let filtrationStatus = 'all';
let currentPage = 1;
let rows = 5;

function addTask () {
    tasksArray.push({
        id: Date.now(),
        text: inp.value,
        isChecked: false,
    }); 
    render();
}

function render() {// выводит инфу
    let tempArray = [];
    switch(filtrationStatus){
        case "all": {
            
            tempArray = tasksArray;
            break;
        }
        case "completed": {
          
            tempArray = tasksArray.filter((item) => item.isChecked);
            break;
        }    
        case "active": {
            
            tempArray = tasksArray.filter((item) => !item.isChecked);
            break;
        }
        default: break;
    }


    currentPage--;
    const start = rows * currentPage;
    const end = start + rows;
    const paginatedData = tempArray.slice(start, end);
    const pagesCount = Math.ceil(tempArray.length / rows);
    
    if (pagesCount === 2){
        tasksList.innerHTML= "";
        tempArray.forEach((elem) => tasksList.innerHTML += `<div id="${elem.id}">
        <input type="checkbox" ${elem.isChecked ? 'checked' : ''}><label>${elem.text}</label>
        <button>X</button>`);
    }
    
    // tasksList.innerHTML= "";
    // tempArray.forEach((elem) => tasksList.innerHTML += `<div id="${elem.id}">
    // <input type="checkbox" ${elem.isChecked ? 'checked' : ''}><label>${elem.text}</label>
    // <button>X</button>`);

    countCheck();
}

function changes(event){//изменения инпута
    const taskId = Number(event.target.parentElement.id);
    if (event.target.tagName === 'BUTTON'){
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray.splice(elem, 1);
        countCheck();
        render();

    }

    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox'){//удаляет завершенные
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray[elem].isChecked = !tasksArray[elem].isChecked;
        if (event.target.tagName === 'Enter') {
        addTask();
    }
        countCheck();
        render();
        
    }
}

function checkAll(){//делает все чекбоксы сделанными
    tasksArray.forEach((elem)=>elem.isChecked =true);
    render();

}

function checkAndDelete(){// удаляет по одному
   tasksArray = tasksArray.filter((item) => !item.isChecked)
   render();
}

function handleEnter (event) { // сохраняет при нажатии enter
    if (event.code === 'Enter') {
        addTask();
    }
}

function editTask(event){//редактирование существующего
    const taskId = Number(event.target.parentElement.id);
    const temp = event.target;
    if (event.target.tagName === 'LABEL')
    {
        input.value = tasksArray[tasksArray.findIndex((item) => item.id === taskId)].text;
        input.id = taskId;
        temp.replaceWith(input);
        input.focus();
    }
    
}

function saveInput(event){
    if (event.code === 'Enter') { //сохраняет при нажатии enter 
        tasksArray[tasksArray.findIndex((item) => Number(item.id) === Number(input.id))].text = input.value;
        render();
    }
    
    if (event.code === 'Escape'){//отменяет изменения при нажатии escape
        render();
    }
}

input.onblur = function(event) {// сохранение при блюре
    if (event.sourceCapabilities !== null) {
        tasksArray[tasksArray.findIndex((item) => Number(item.id) === Number(input.id))].text = input.value;
    render();
    }
}

function countCheck(){// считает выбранные и не очень 
    checkAllCount = tasksArray.filter((item) => item.isChecked).length;
    notCheckAllCount = tasksArray.length - checkAllCount;
    btnAll.textContent = `All(${tasksArray.length})`;
    btnCompleted.textContent = `Completed(${tasksArray.length-notCheckAllCount})`;
    btnActive.textContent = `Active(${tasksArray.length-checkAllCount})`;   
}

function filterArray() {
switch (selectState) {
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
const start = currentPage * quantityOfTasks;
const end = start + quantityOfTasks;
const slicedArr = tempArray.slice(start, end);
return ({ slicedArr, countOfTasks: tempArray.length });
}

function tasksCounter() {
const completedCount = tasksArray.filter((item) => item.isChecked).length;
const uncompletedCount = tasksArray.length - completedCount;
counter.innerHTML = <label>Completed tasks: ${completedCount}</label><br>
      <label>Uncompleted tasks: ${uncompletedCount}</label><br>
      <label>All tasks: ${tasksArray.length}</label><br>;
}

function createPageButtons(tempArray) {
pages.innerHTML = '';
totalPage = Math.ceil(tempArray / quantityOfTasks);
if (tempArray < 1) {
return;
}
for (let i = 0; i <= totalPage - 1; i += 1) {
pages.innerHTML += <button class="page" id="${i}">${i + 1}</button>;
}
}

function render() {
const info = getSlicedArray();
tasks.innerHTML = '';
info.slicedArr.forEach((item) => {
tasks.innerHTML += <div id="${item.id}" class="partic-task">
      <input class="task-status" type="checkbox"  ${item.isChecked ? 'checked' : ''}>
      <label class="task-text">${_.escape(item.text)}</label>
      <button class="bt-delete">X</button>
      </div>;
});
tasksCounter();
createPageButtons(info.countOfTasks);
select.checked = tasksArray.every((task) => task.isChecked === true);
if (document.querySelector !== null) {
document.querySelectorAll('page').forEach((page) => page.classList.remove('page-focus'));
document.getElementById(currentPage).classList.add('page-focus');
}
}



// function chooseTaskStatus(event){
    
//     switch(event.target.id) {
//         case 'all': 
//             filtrationStatus = 'all';
//             render();
//             break;
//         case 'completed':
//             filtrationStatus = 'completed';
//             render();
//             break;
//         case 'active':
//             filtrationStatus = 'active';
//             render();
//         default:
//             break;
    //}
//}

// function pagination(rowPerPage, page) {
//     page--;
//     const start = rowPerPage * page;
//     const end = start + rowPerPage;
//     const paginatedData = tasksArray.slice(start, end);
//     const pagesCount = Math.ceil(tasksArray.length / rowPerPage);//страницы
// }



showStatus.addEventListener('click',chooseTaskStatus);
input.addEventListener('keydown', saveInput);
inp.addEventListener('keydown', handleEnter);
selectAll.addEventListener('click', checkAll);
cancel.addEventListener('click', checkAndDelete);
tasksList.addEventListener('dblclick', editTask);
tasksList.addEventListener('click', changes);
btn.addEventListener('click', addTask);