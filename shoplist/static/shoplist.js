const url = (document.domain === '127.0.0.1') ?
    "http://127.0.0.1:8000/shoplist/api/v1/items" : //dev
    "https://" + document.domain + '/shoplist/api/v1/items';

function createTag (tag, attrs={}) {
  let elem = document.createElement(tag);
  for (let key in attrs) {
      elem.setAttribute(key, attrs[key])
  }
  return elem
}

/**
 * Создание одного элемента списка в dom как в примере ниже
 * <label class="item" for="29" title="Создано 2024-01-23T13:27:10.942335+05:00">
 *   <input class="checkbox" type="checkbox" id="29"><span>Хлеб</span>
 *   <button title="Удалить" class="btn-del"><i class="fa-light fa-xmark"></i></button>
 *   <button title="Редактированть" class="btn-edt"><i class="fa-light fa-pen"></i></button>
 * </label>
 * @param {*} item - объект с данными элемента списка
 * @param {*} content - родительский элемент, контейнер
 */
function addItem (item, content) {
  // create elements
  const label = createTag('label', {class: 'item', for: item.id, title: "Создано " + item.created}); // TODO: формат даты
  const input = createTag('input', {class: 'checkbox', type: 'checkbox', id: item.id});
  input.checked = item.isdone;  // state from database
  const span = createTag('span');
  span.innerText = item.name;   // visible text
  const button_del = createTag('button', {title: 'Удалить', class: 'btn-del'});
  button_del.innerHTML = '<i class="fa-light fa-xmark"></i>';
  const button_edt = createTag('button', {title: 'Редактированть', class: 'btn-edt'});
  button_edt.innerHTML = '<i class="fa-light fa-pen"></i>';
  // build structure
  label.appendChild(input);
  label.appendChild(span);
  label.appendChild(button_edt);
  label.appendChild(button_del);
  // Set handlers
  doneHandler(input);
  deleteHandler(button_del);
  editHandler(button_edt);
  // insert to container childs start position (prepend)
  content.prepend(label);
}

let content = undefined;
let done_content = undefined;

// Установка обработчика клик на элементе списка (выполнена)
function doneHandler(item) {
  item.addEventListener('click', async (e)=>{
      const data = {isdone: e.currentTarget.checked};
      const doneresp = await fetch(url + '/' + e.currentTarget.id, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json",},
        body: JSON.stringify(data),
      });
    });
}
// Обработчик удаления
function deleteHandler(button) {
  button.addEventListener('click', async (e)=>{
      const _label = e.currentTarget.parentNode;
      const delresp = await fetch(url + '/' + _label.getAttribute('for'), {method: 'delete'});
      if (delresp.ok) _label.remove();
    });
}
// Обработчик редактирования
function editHandler (button) {
  button.addEventListener('click', async (e)=>{
      const _input = document.getElementById('i-1');
      _input.dataset.id = e.currentTarget.parentNode.getAttribute('for');
      _input.value = e.currentTarget.parentNode.querySelector('span').innerText;
      const icon = _input.parentNode.querySelector('i');
      icon.classList.remove('fa-plus');
      icon.classList.add('fa-pen');
      _input.focus();
    });
}

// function setHandlers() {
//   // обработчик щелчка на задаче
//   document.querySelectorAll('label.item input').forEach(item => {
//     doneHandler(item);
//   });

//   // хендлер удаления
//   document.querySelectorAll('button.btn-del').forEach(button => {
//     deleteHandler(button);
//   });

//   // редактирование
//   document.querySelectorAll('button.btn-edt').forEach(button => {
//     editHandler(button);
//   });
// }

let params = new URLSearchParams(); // Для фильтра и сортировки
// Заполнение списка покупок
async function list () {
  const _url = (params.toString()) ? url + '?' + params.toString() : url;
  const resp = await fetch(_url).then((x) => x.json());
  for(let item of resp) {
    if (item.isdone) addItem(item, done_content);
    else addItem(item, content);
  }
  // setHandlers();
}

document.addEventListener("DOMContentLoaded", async () => {
  content = document.getElementById('content');   // тут будет список
  done_content = document.getElementById('done-content'); // контейнер выполненных покупок
  document.forms['createitem'].name.value = ''; // очистка
  document.forms['createitem'].name.focus();  // сразу фокус

  // Заполнение списка покупок
  await list();

  // Обработчик создания задачи (или редактирования, если есть dataset.id)
  document.forms['createitem'].addEventListener('submit', async (e)=>{
    const _form = e.currentTarget;
    let method = 'POST';
    let _url = url;
    let id = _form.name.dataset.id;
    if (id) {
      method = 'PATCH';
      _url = url + '/' + id;
    }
    e.preventDefault();
    const data = {name: _form.name.value};
    const addresp = await fetch(_url, {
      method: method,
      headers: { "Content-Type": "application/json",},
      body: JSON.stringify(data),
    });
    if (addresp.ok) {
      if (id) {
        let _name = await addresp.json();
        document.querySelector(`label[for="${id}"] span`).innerText = _name['name'];
      } else addItem(await addresp.json(), content);
      _form.name.value = "";
      _form.name.dataset.id = '';
      const icon = _form.querySelector('button.button[type=submit] i');
      icon.classList.remove('fa-pen');
      icon.classList.add('fa-plus');
    }
  });

  // сортировка (o=id|-id, o=name|-name) и фильтрация (name=<query>)
  document.querySelectorAll('div.buttons button').forEach(button => {
    button.addEventListener('click', async (e)=>{
      e.preventDefault();
      const button = e.currentTarget;
      if (button.dataset.sort) {
        params.set('o', button.dataset.sort);
      } else {
        params.set(button.dataset.filter, document.forms['createitem'].name.value);
      }
      content.replaceChildren();
      done_content.replaceChildren();
      list();
    })
  })
});