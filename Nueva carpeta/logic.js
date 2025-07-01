// Lógica para crear, modificar y eliminar elementos en data.json
// Las funciones se implementarán aquí

// Utilidades para manejar el almacenamiento en localStorage como simulación de archivo JSON
const STORAGE_KEY = 'crud_data_json';

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Crear un nuevo elemento
function createItem(item) {
  const data = loadData();
  item.id = Date.now();
  data.push(item);
  saveData(data);
}

// Leer todos los elementos
function readItems() {
  return loadData();
}

// Modificar un elemento por id
function updateItem(id, newItem) {
  const data = loadData();
  const idx = data.findIndex(i => i.id === id);
  if (idx !== -1) {
    data[idx] = { ...data[idx], ...newItem };
    saveData(data);
    return true;
  }
  return false;
}

// Eliminar un elemento por id
function deleteItem(id) {
  let data = loadData();
  data = data.filter(i => i.id !== id);
  saveData(data);
}

// Exponer funciones para uso en index.html
window.crud = {
  createItem,
  readItems,
  updateItem,
  deleteItem
};
