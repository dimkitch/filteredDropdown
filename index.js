'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const URL = 'https://jsonplaceholder.typicode.com/posts';
  //Select карточек
  const cardsNode = document.querySelector('.cards');
  //Select inputa ID
  const inputIdNode = document.querySelector('[data-register="filterbyid"]');
  //Select inputa USER ID
  const inputUserIdNode = document.querySelector(
    '[data-register="filterbyuserid"]'
  );
  //Select список  ID
  const filterListIdNode = document.querySelector('[data-class="list-id"]');
  //Select список USERID
  const filterListUserIdNode = document.querySelector(
    '[data-class="list-user-id"]'
  );
  let userList = [];
  let idList = [];

  let state = [];
  let query = {};

  const transformQuery = () => {
    return Object.entries(query)
      .map((item, i) => {
        const separator = i === 0 ? '?' : '&';
        return `${separator}${item[0]}=${item[1]}`;
      })
      .join('');
  };

  async function getResponse() {
    let response = await fetch(URL + transformQuery());
    state = await response.json();
    createCardNodes();
  }

  function createNode(dataList, node, createTemplate) {
    node.innerHTML = '';
    dataList.forEach(createTemplate)
  }

  const init = async () => {
    await getResponse();

    userList = Array.from(new Set(state.map((item) => item.userId)));
    idList = state.map((item) => item.id);

    //Выводит все id в дропдаун
    createOptionNodes(idList, filterListIdNode);
    //Выводит все userId в дропдаун
    createOptionNodes(userList, filterListUserIdNode);
  };

  const createCardNodes = () => {
    createNode(state, cardsNode, (card) => {
      cardsNode.innerHTML += `
      <div class="card">
      <div class="card__title">
      ${card.title}
      </div>
      <div class="card__body">
      ${card.body}
      </div>
      <div class="card__wrapper">
      <div class="card__id">
      ${card.id}
      </div>
      <div class="card__user-id">
      ${card.userId}
      </div></div>
    </div>
    `;
    } )
  };

  const createOptionNodes = (options, listNode) => {
    console.log(listNode);
    createNode(options, listNode, (id) => {
      listNode.innerHTML += `
      <li class="dropdown-block__item" data-value="${id}">
      ${id}
      </li>
      `;
    })

    const filterListOptionsNode = listNode.querySelectorAll(
      '.dropdown-block__item'
    );
    filterListOptionsNode.forEach((optionNode) => {
      optionNode.addEventListener('click', onSelectOption);
    });
  };

  //Вызов функии fetch
  init();

  function toggleDropdown(e) {
    const dropdownNode = e.target.closest('.dropdown-block');
    const list = dropdownNode.querySelector('.dropdown-block__list')

    if (list.classList.contains('dropdown-block__list--is-hidden')) {
      list.classList.remove('dropdown-block__list--is-hidden');
    } else {
      list.classList.add('dropdown-block__list--is-hidden');
    }
  }

  //ФУНКЦИЯ, которая открывает DROPDOWN userID
  inputUserIdNode.addEventListener('click', toggleDropdown);
  inputIdNode.addEventListener('click',toggleDropdown)

  //фУНКЦИЯ, которая обрабатывает клик по лишке
  function onSelectOption(e) {
    // Получаем доступ к дропдауну через текущий таргет -> таргет это li по которой кликнули
    const dropdownNode = e.target.closest('.dropdown-block');
    // Получаем значение из выбранной лишки по аттрибуту -> data-value="ID" -> ID - текущий айди лишки
    const value = Number(e.target.getAttribute('data-value'));
    // Получаем ключ для записи в объект query у родителя лишки -> ul с аттр data-query-key="KEY" -> KEY - задан в штмл
    const key = e.target.parentElement.getAttribute('data-query-key')
    // Получаем инпут в текущем дропдауне
    const inputNode = dropdownNode.querySelector('input')

    inputNode.value = value;
    query[key] = value;

    // закрываем дропдаун
    // мы закрываем все дропдауны, но можно было сделать метод, который принимает node дропдауна, который нужно закрыть
    closeAllDropDown();
    // обновляем данные после дёргание фильтра
    getResponse();

  }

  //фУНКЦИЯ, поиска
  inputIdNode.addEventListener('input', onSearchFilter);
  function onSearchFilter(e) {
    const value = e.target.value;
    const filtered = idList.filter((item) => {
      if (String(item).includes(value)) {
        return item;
      }
    });
    createOptionNodes(filtered, filterListIdNode);
  }

  function closeAllDropDown() {
    const dropdownListNodes =  document.querySelectorAll('.dropdown-block__list');
    dropdownListNodes.forEach(list=>{
      list.classList.add('dropdown-block__list--is-hidden')
    })
  }
});
