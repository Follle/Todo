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
const pag = document.querySelector('.pagination');


let tasksArray = [];
let checkAllCount=[];
let notCheckAllCount=0;
let filtrationStatus = 'all';
let currentPage = 0;
// let currentPage = 0;
let rows = 5;

function addTask () {
    tasksArray.push({
        id: Date.now(),
        text: inp.value,
        isChecked: false,
    }); 
    
    currentPage = Math.ceil(tasksArray.length / rows);
    console.log(currentPage);

    //if (elem.text==""){console.log()}
    render();
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
    // const start = currentPage * rows;
    const start = (currentPage - 1) * rows;
    const end = start + rows;
    const slicedArr = tempArray.slice(start, end);
    
    return ({ slicedArr, countOfTasks: tempArray.length });
    

    }
    
    function createPageButtons(tempArray) {
    pag.innerHTML = '';
    totalPage = Math.ceil(tempArray / rows);
    if (tempArray < 1) {
    return;
    }
    for (let i = 0; i <= totalPage - 1; i += 1) {
    pag.innerHTML += `<button class="page" id="${i}">${i + 1}</button>`;
    }
    }

    function render() {
        const info = getSlicedArray();
        info.slicedArr.forEach((elem) => {
            if (elem.text === "") {
            } else {
                tasksList.innerHTML += `<div id="${elem.id}">
                    <input type="checkbox" ${elem.isChecked ? 'checked' : ''}>
                    <label>${elem.text} (required)</label>
                    <button>X</button>
                </div>`;
            }
        });
        createPageButtons(info.countOfTasks);
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

function checkCurrentPage(event) {
    currentPage = Number(event.target.id);
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


pag.addEventListener('click', checkCurrentPage);
showStatus.addEventListener('click',chooseTaskStatus);
input.addEventListener('keydown', saveInput);
inp.addEventListener('keydown', handleEnter);
selectAll.addEventListener('click', checkAll);
cancel.addEventListener('click', checkAndDelete);
tasksList.addEventListener('dblclick', editTask);
tasksList.addEventListener('click', changes);
btn.addEventListener('click', addTask);