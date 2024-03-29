const btn = document.querySelector('.add-btn');
const inp = document.querySelector('.i-1');
const tasksList= document.querySelector('.tasks-list');
const selectAll = document.querySelector('.i-2');
const cancel = document.querySelector('.i-3');
const input = document.createElement('input');

let tasksArray = [];
let checkAllCount=0;

function addTask () {
    tasksArray.push({
        id: Date.now(),
        text: inp.value,
        isChecked: false,
    }); 
    render();

   


    //console.log("isChecked");
    //console.log('Check:'+ checkAllCount);

}

function render() {// выводит инфу
    tasksList.innerHTML= "";
    tasksArray.forEach((elem) => tasksList.innerHTML += `<div id="${elem.id}">
    <input type="checkbox" ${elem.isChecked ? 'checked' : ''}><label>${elem.text}</label>
    <button>X</button>
    </div>`);

    if (isChecked=checked){
        checkAllCount+=1;
        console.log(checkAllCount);
    }
    
    
}

function changes(event){//изменения инпута
    const taskId = Number(event.target.parentElement.id);
    if (event.target.tagName === 'BUTTON'){
        // tasksArray = tasksArray.filter((item)=> item.id !== taskId);
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray.splice(elem, 1);
        render();
    }

    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox'){//удаляет завершенные
        const elem = tasksArray.findIndex((elem) => elem.id === taskId)
        tasksArray[elem].isChecked = !tasksArray[elem].isChecked;
        if (event.target.tagName === 'Enter') {
        addTask();
    }
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
input.addEventListener('keydown', saveInput);
inp.addEventListener('keydown', handleEnter);
selectAll.addEventListener('click', checkAll);
cancel.addEventListener('click', checkAndDelete);
tasksList.addEventListener('dblclick', editTask);
tasksList.addEventListener('click', changes);
btn.addEventListener('click', addTask);