import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { openModal } from './js/modal/openModal';

const exercisesWrapper = document.querySelector('.wrapper-exercises');
const paginationWrapper = document.querySelector('.pagination-wrapper');
const muscleBtn = document.getElementById('muscle-btn');
const bodyBtn = document.getElementById('body-btn');
const equipmentBtn = document.getElementById('equipment-btn');
const partHeader = document.querySelector('.exercises-title');
const searchPlace = document.querySelector('.search-container');

const searchForm = document.getElementById('searchForm');

let currentFilter = 'Muscles';

let selectedBtn = 'muscle-btn';

let totalPages;
let page = 1;
let dataList;
let exerciseName;
let exercisePage = 1;
let isOpenSublist = false;

[muscleBtn, bodyBtn, equipmentBtn].forEach(btn => {
  btn.addEventListener('click', function () {
    if (selectedBtn !== btn.id || isOpenSublist) {
      changeActiveBtn(btn.id);
      selectedBtn = btn.id;
      page = 1;
      if (btn.id === 'muscle-btn') {
        currentFilter = 'Muscles';
      }
      if (btn.id === 'body-btn') {
        currentFilter = 'Body parts';
      }
      if (btn.id === 'equipment-btn') {
        currentFilter = 'Equipment';
      }
      getExercises();
    }
  });
});

function changeActiveBtn(id) {
  [muscleBtn, bodyBtn, equipmentBtn].forEach(btn => {
    btn.className = `exercises-category ${id === btn.id ? 'active' : ''}`;
  });
}

getExercises();

async function getExercises() {
  const apiUrl = 'https://energyflow.b.goit.study/api/filters';
  const requestData = {
    filter: currentFilter,
    limit: setLimit(),
    page,
  };

  try {
    const response = await axios.get(
      `${apiUrl}?${new URLSearchParams(requestData)}`
    );
    exercisesWrapper.innerHTML = `<div class="muscles-list"></div>`;
    dataList = response.data.results;
    totalPages = response.data.totalPages;
    isOpenSublist = false;
    renderExercises();
    setPagination();
  } catch (error) {
    console.log(error);
    iziToast.error({
      title: 'Error',
      message: `Something went wrong. Please try again later.`,
      position: 'topRight',
    });
  }
}

function renderExercises() {
  const newData = dataList
    .map(
      item => `<div class="muscle-item" 
       style="background-image: linear-gradient(rgba(16, 16, 16, 0.7), rgba(16, 16, 16, 0.7)), url(${
         item.imgUrl
       })" ><div class="muscle-item-wrapper">
          <span class="muscle-category">${capitalizeText(item.name)}</span>
           <span class="muscle-item-category">${item.filter}</span></div>
           </div>`
    )
    .join('');
  const muscleList = document.querySelector('.muscles-list');
  muscleList.innerHTML = newData;
  muscleList.classList.remove('desk-flex');
  muscleList.classList.remove('tab-flex');
  searchPlace.classList.add('is-hidden');
  partHeader.innerHTML = 'Exercises';
  getByFilter(muscleList);
  exercisePage = 1;
}

function setPagination() {
  paginationWrapper.classList.remove('scroll-x');
  if (totalPages > 1) {
    const paginationList = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationList.push(
        `<span class="pagination-number ${
          i === page ? 'active' : ''
        }">${i}</span>`
      );
    }
    paginationWrapper.innerHTML = paginationList.join('');
    const paginationNumbers =
      document.getElementsByClassName('pagination-number');
    for (let i = 0; i < paginationNumbers.length; i++) {
      paginationNumbers[i].addEventListener('click', function () {
        changePagination(i + 1);
      });
    }
  } else {
    paginationWrapper.innerHTML = '';
  }
}

function changePagination(newPageNumber) {
  if (newPageNumber === page) {
    return;
  }
  page = newPageNumber;
  getExercises();
}

function capitalizeText(text) {
  if (!text.length) {
    return '';
  }
  const firstLetter = text.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = text.slice(1);
  return firstLetterCap + remainingLetters;
}
function setLimit() {
  if (window.screen.width >= 768) {
    return 12;
  }
  return 8;
}

function getByFilter(muscleList) {
  const exerciseTargets = muscleList.querySelectorAll('.muscle-item');
  exerciseTargets.forEach(exerciseTarget =>
    exerciseTarget.addEventListener('click', function () {
      const targetName = exerciseTarget.querySelector('.muscle-category');
      exerciseName = targetName.textContent.toLowerCase();
      getFilteredExerrcises();
    })
  );
}

async function getFilteredExerrcises() {
  const apiUrl = 'https://energyflow.b.goit.study/api/exercises';
  let filterCheck = document.querySelector('.active');
  let requestData;
  if (currentFilter == 'Body parts') {
    requestData = {
      bodypart: exerciseName,
      limit: setExercisesLimit(),
      page: exercisePage,
    };
  }
  if (currentFilter == 'Muscles') {
    requestData = {
      muscles: exerciseName,
      limit: setExercisesLimit(),
      page: exercisePage,
    };
  }
  if (currentFilter == 'Equipment') {
    requestData = {
      equipment: exerciseName,
      limit: setExercisesLimit(),
      page: exercisePage,
    };
  }

  try {
    const response = await axios.get(
      `${apiUrl}?${new URLSearchParams(requestData)}`
    );
    exercisesWrapper.innerHTML = `<div class="muscles-list"></div>`;
    dataList = response.data.results;
    totalPages = response.data.totalPages;
    isOpenSublist = true;
    renderFilteredExercises();
    setFilteredPagination();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong. Please try again later.`,
      position: 'topRight',
    });
  }
}

function setExercisesLimit() {
  if (window.screen.width >= 1440) {
    return 9;
  }
  return 8;
}

function renderFilteredExercises() {
  const newData = dataList
    .map(
      item => `<div class="filtered-ex-item">
      <div class="filtered-ex-item-header">
          <div class="filtered-workout-box">
              <p class="filtered-workout-text">workout</p>
          </div>
          <div class="filtered-rating-container">
              <p class="filtered-rating-text">${Number(item.rating).toFixed(
                1
              )}</p>
              <div class="filtered-rating-icon-container">
              <svg class="filtered-rating-icon" width="14" height="14">
                  <use href="./assets/sprite-fb630926.svg#star"></use>
              </svg>
              </div>
          </div>
          <button class="filtered-start-ex-btn" type="button" data-id="${
            item._id
          }">Start
              <svg class="filtered-start-arrow-icon" width="14" height="14">
                  <use href="./assets/sprite-fb630926.svg#arrow"></use>
              </svg>
          </button>
      </div>
      <div class="filtered-ex-name-box">
          <div class="filtered-run-icon-box">
              <svg class="filtered-run-icon" width="16" height="16">
                  <use href="./assets/sprite-fb630926.svg#runner"></use>
              </svg>
          </div>
          <p class="filtered-ex-name">${capitalizeText(item.name)}</p>
      </div>
      <ul class="filtered-ex-desc-list">
          <li class="filtered-ex-desc-item">Burned calories:
              <span class="filtered-ex-desc-value">${item.burnedCalories} / ${
        item.time
      } min</span>
          </li>
          <li class="filtered-ex-desc-item">Body part:
              <span class="filtered-ex-desc-value">${capitalizeText(
                item.bodyPart
              )}</span>
          </li>
          <li class="filtered-ex-desc-item">Target:
              <span class="filtered-ex-desc-value">${capitalizeText(
                item.target
              )}</span>
          </li>
      </ul>
  </div>`
    )
    .join('');
  const muscleList = document.querySelector('.muscles-list');
  muscleList.innerHTML = newData;
  openModal();
  if (exercisePage === 1 && partHeader.textContent === 'Exercises') {
    partHeader.insertAdjacentHTML(
      'beforeend',
      ` / <span class="exercises-title-grey">${capitalizeText(
        dataList[0].bodyPart
      )}</span>`
    );
  }
  searchPlace.classList.remove('is-hidden');
  if (window.screen.width >= 1440) {
    muscleList.classList.add('desk-flex');
  }
  if (window.screen.width >= 768 && window.screen.width < 1440) {
    muscleList.classList.add('tab-flex');
  }
}

function setFilteredPagination() {
  const paginationList = [];
  paginationWrapper.classList.remove('scroll-x');
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      paginationList.push(
        `<span class="pagination-number ${
          i === exercisePage ? 'active' : ''
        }">${i}</span>`
      );
    }
    paginationWrapper.innerHTML = paginationList.join('');
    const paginationNumbers =
      document.getElementsByClassName('pagination-number');
    for (let i = 0; i < paginationNumbers.length; i++) {
      paginationNumbers[i].addEventListener('click', function () {
        changeFilteredPagination(i + 1);
      });
    }
    if (totalPages > 12 && window.screen.width < 768) {
      paginationWrapper.classList.add('scroll-x');
    } else if (totalPages > 23 && window.screen.width < 1440) {
      paginationWrapper.classList.add('scroll-x');
    }
  } else {
    paginationWrapper.innerHTML = '';
  }
}

function changeFilteredPagination(newPageNumber) {
  if (newPageNumber === exercisePage) {
    return;
  }
  exercisePage = newPageNumber;
  getFilteredExerrcises();
}

// Глобальні змінні для зберігання значень параметрів пошуку
let lastSearchQuery = '';
let filter = '';
let subcategory = '';

function setSearchPagination() {
  const paginationList = [];
  paginationWrapper.classList.remove('scroll-x');
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      paginationList.push(
        `<span class="pagination-number ${
          i === exercisePage ? 'active' : ''
        }">${i}</span>`
      );
    }
    paginationWrapper.innerHTML = paginationList.join('');
    const paginationNumbers =
      document.getElementsByClassName('pagination-number');
    for (let i = 0; i < paginationNumbers.length; i++) {
      paginationNumbers[i].addEventListener('click', function () {
        changeSerchedPagination(i + 1);
      });
    }
    if (totalPages > 12 && window.screen.width < 768) {
      paginationWrapper.classList.add('scroll-x');
    } else if (totalPages > 23 && window.screen.width < 1440) {
      paginationWrapper.classList.add('scroll-x');
    }
  } else {
    paginationWrapper.innerHTML = '';
  }
}

function changeSerchedPagination(newPageNumber) {
  if (newPageNumber === exercisePage) {
    return;
  }
  exercisePage = newPageNumber;
  performSearch();
}

// Додавання обробника подій для відправки форми пошуку
searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(searchForm);
  lastSearchQuery = formData.get('search').trim(); // Зберігаємо значення останнього пошукового запиту
  filter = formData.get('filter');
  subcategory = formData.get('subcategory');

  if (lastSearchQuery !== '') {
    await performSearch();
    searchForm.reset();
  }
});

// Обробка натискання на пагінацію
paginationWrapper.addEventListener('click', function (event) {
  if (event.target.classList.contains('page-link')) {
    event.preventDefault();
    // Отримуємо номер сторінки, на яку клікнули
    const page = parseInt(event.target.dataset.page);
    // Викликаємо функцію для виконання пошуку з попереднім пошуковим запитом
    performSearch();
  }
});

// Функція для виконання пошуку
async function performSearch() {
  const apiUrl = 'https://energyflow.b.goit.study/api/exercises';
  const searchData = {
    keyword: lastSearchQuery, // Використовуємо ключове слово для параметра keyword
    limit: setExercisesLimit(), // Встановлюємо ліміт вправ на сторінці
    page: exercisePage, // Встановлюємо порядковий номер сторінки
    filter: filter, // Додаємо значення фільтру
  };

  let requestData;
  const filterCheck = document.querySelector('.active');

  if (currentFilter == 'Body parts') {
    requestData = {
      bodypart: exerciseName,
      limit: setExercisesLimit(),
      page: exercisePage,
      subcategory: subcategory, // Додаємо значення підвиду
    };
  }
  if (currentFilter == 'Muscles') {
    requestData = {
      muscles: exerciseName,
      limit: setExercisesLimit(),
      page: exercisePage,
      subcategory: subcategory,
    };
  }
  if (currentFilter == 'Equipment') {
    requestData = {
      equipment: exerciseName,
      limit: setExercisesLimit(),
      page: exercisePage,
      subcategory: subcategory,
    };
  }

  const requestDataMerged = { ...searchData, ...requestData }; // Об'єднуємо дані пошуку з додатковими параметрами

  try {
    const response = await axios.get(
      `${apiUrl}?${new URLSearchParams(requestDataMerged)}`
    );

    if (response.data.results.length === 0) {
      showNoResultsMessage();
      return;
    }

    // Якщо є дані, оновлюємо відображення результатів і пагінацію
    dataList = response.data.results;
    totalPages = response.data.totalPages;

    if (totalPages >= 1) {
      setSearchPagination();
    }
    renderFilteredExercises();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong. Please try again later.`,
      position: 'topRight',
    });
  }
}

// Функція для показу повідомлення про відсутність результатів
function showNoResultsMessage() {
  paginationWrapper.innerHTML = '';
  exercisesWrapper.innerHTML = `
    <div class="wrapper-exercises">
      <p class="no-search-server">Unfortunately, <span class="gray-world-server">no results</span> were found. You may want to consider other search options to find the exercise you are looking for. Our range is wide and you have the opportunity to find more options that suit your needs.</p>
    </div>
  `;
}
