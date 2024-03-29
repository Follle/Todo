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
//const btnNext = document.getElementById('')
//const content = document.querySelector('.content');


let tasksArray = [];
let checkAllCount=[];
let notCheckAllCount=0;
let filtrationStatus = 'all';
let itemsPerPage = 5; //элементов на странице
let buttons = [];


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
            // showStatus.textContent = "All("+(checkAllCount+notCheckAllCount)+")";
            
            break;
        }
        case "completed": {
          
            tempArray = tasksArray.filter((item) => item.isChecked);
            // showStatus.textContent = "Completed("+checkAllCount+")";
            break;
        }    
        case "active": {
            
            tempArray = tasksArray.filter((item) => !item.isChecked);
            // showStatus.textContent = "Active("+notCheckAllCount+")";
            break;
        }
        default: break;
    }
    tasksList.innerHTML= "";
    tempArray.forEach((elem) => tasksList.innerHTML += `<div id="${elem.id}">
    <input type="checkbox" ${elem.isChecked ? 'checked' : ''}><label>${elem.text}</label>
    <button>X</button>`);
    countCheck();
    getPage(1);
    drawButton();
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

function chooseTaskStatus(event){
    
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


function getPage(pageNumber){
    let startIndex = (pageNumber - 1) *itemsPerPage; //начальный индекс
    let endIndex = pageNumber *itemsPerPage; // последний инекс
    let page = tasksArray.slice(startIndex, endIndex);
    console.log(page);
    return page;
}

function drawButton(condition) {
    condition = 1;
    if (condition) {
      let button = document.createElement('button');
      button.innerHTML = `${tasksArray.length}`;
      document.body.appendChild(button);
      buttons.push(button);
    }
  }


//content.addEventListener('DOMContentLoaded', pagination);
showStatus.addEventListener('click',chooseTaskStatus);
input.addEventListener('keydown', saveInput);
inp.addEventListener('keydown', handleEnter);
selectAll.addEventListener('click', checkAll);
cancel.addEventListener('click', checkAndDelete);
tasksList.addEventListener('dblclick', editTask);
tasksList.addEventListener('click', changes);
btn.addEventListener('click', addTask);