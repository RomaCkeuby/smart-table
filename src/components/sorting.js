import { sortMap } from "../lib/sort.js"; // sortCollection больше не нужен

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // #3.1 — запомнить выбранный режим сортировки
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.order; // оставляю как в исходнике

      // #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
    }

    // Определяем активную колонку
    columns.forEach((column) => {
      if (column.dataset.value !== "none") {
        field = column.dataset.field;
        order = column.dataset.value;
      }
    });

    const sort = field && order !== "none" ? `${field}:${order}` : null;
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
