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
  const filterListIdNode = document.querySelector('.dropdown-block__list-id');
  //Select список USERID
  const filterListUserIdNode = document.querySelector(
    '.dropdown-block__list-userid'
  );
  let userList1 = [];
  let idList = [];

  let state = [];
  let query = {};

  const transformQuery = () => {
    return Object.entries(query)
      .map((item, i) => {
        const separator = i === 0 ? '?' : '&';
        return `${separator}${item[0]}=${item[1]}`;
      })
      .join('|');
  };

  async function getResponse() {
    let response = await fetch(URL + transformQuery());
    // + query
    state = await response.json();
    createCardNodes();
  }

  const init = async () => {
    await getResponse();

    userList = Array.from(new Set(state.map((item) => item.userId)));
    idList = state.map((item) => item.id);

    createOptionsId(idList);
    createOptionsUserId(userList);
  };

  const createCardNodes = () => {
    cardsNode.innerHTML = '';

    state.forEach((card) => {
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
    });
  };

  //Выводит все id в дропдаун
  const createOptionsId = (options) => {
    filterListIdNode.innerHTML = '';
    options.forEach((id) => {
      filterListIdNode.innerHTML += `
      <li class="dropdown-block__item" data-value="${id}">
      ${id}
      </li>
      `;
    });

    const filterListIdOptionsNode = filterListIdNode.querySelectorAll(
      '.dropdown-block__item'
    );
    filterListIdOptionsNode.forEach((optionNode) => {
      optionNode.addEventListener('click', addFilterItemId);
    });
  };

  //Выводит все userId в дропдаун
  const createOptionsUserId = (options) => {
    options.forEach((id) => {
      filterListUserIdNode.innerHTML += `
        <li class="dropdown-block__item" data-value="${id}">
          ID:${id}
        </li>
      `;
    });

    const filterListUserIdOptionsNode = filterListUserIdNode.querySelectorAll(
      '.dropdown-block__item'
    );
    filterListUserIdOptionsNode.forEach((optionNode) => {
      optionNode.addEventListener('click', addFilterItemUserId);
    });
  };

  //Вызов функии fetch
  init();

  //ФУНКЦИЯ, которая открывает DROPDOWN ID
  inputIdNode.addEventListener('click', toggleDropdownId);

  function toggleDropdownId() {
    let list = document.querySelector('.dropdown-block__list-id');
    if (list.classList.contains('dropdown-block__list-id--is-hidden')) {
      list.classList.remove('dropdown-block__list-id--is-hidden');
    } else {
      list.classList.add('dropdown-block__list-id--is-hidden');
    }
  }

  //ФУНКЦИЯ, которая открывает DROPDOWN userID
  inputUserIdNode.addEventListener('click', toggleDropdownUserId);

  function toggleDropdownUserId() {
    let list = document.querySelector('.dropdown-block__list-userid');
    if (list.classList.contains('dropdown-block__list-userid--is-hidden')) {
      list.classList.remove('dropdown-block__list-userid--is-hidden');
    } else {
      list.classList.add('dropdown-block__list-userid--is-hidden');
    }
  }

  //фУНКЦИЯ, которая выбирает выбраный item id
  function addFilterItemId(e) {
    const id = Number(e.target.getAttribute('data-value'));
    inputIdNode.value = id;
    query.id = id;
    toggleDropdownId();
    getResponse();
  }
  //фУНКЦИЯ, которая выбирает выбраный item userId
  function addFilterItemUserId(e) {
    const userId = Number(e.target.getAttribute('data-value'));
    inputUserIdNode.value = userId;
    query.userId = userId;
    toggleDropdownUserId();
    getResponse();
  }

  //фУНКЦИЯ, поиска
  inputIdNode.addEventListener('input', filterOptionsId);
  function filterOptionsId(e) {
    const value = e.target.value;
    const filtered = idList.filter((item) => {
      if (String(item).includes(value)) {
        return item;
      }
    });
    createOptionsId(filtered);
    console.log(filtered);
  }
});
