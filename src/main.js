import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";

import { processFormData } from "./lib/utils.js";

import { initSearching } from "./components/searching.js";

import { initSorting } from "./components/sorting.js";

import { initPagination } from "./components/pagination.js";

import { initTable } from "./components/table.js";

import { initFiltering } from "./components/filtering.js";
// import { act } from 'react';
// @todo: подключение

// Исходные данные используемые в render()
const api = initData(sourceData);
const { data, indexes } = initData(sourceData);
/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);
  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */

async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // параметры для api
  query = applyPagination(query, state, action); // обновляем query
  query = applyFiltering(query, state, action); // обновляем query
  query = applySearching(query, state, action); // обновляем query
  query = applySorting(query, state, action); // обновляем query

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query); // обновляем пагинацию

  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация
const applySearching = initSearching("search");

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements); // передаём элементы фильтра

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// const applyPagination = initPagination(
//     sampleTable.pagination.elements,
//     (el, page, isCurrent) => {
//         const input = el.querySelector('input');
//         const label = el.querySelector('span');
//         input.value = page;
//         input.checked = isCurrent;
//         label.textContent = page;
//         return el;
//     }
// )
// вариант в шаге 2 пр7. не работал
// const { applyPagination, updatePagination } = initPagination(...);

// исправление через доп объявление функции
const getPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);
const { applyPagination, updatePagination } = getPagination();

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(render);
