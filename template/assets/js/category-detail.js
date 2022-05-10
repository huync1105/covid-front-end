const categoryName = document.querySelector('#category-title');
const categoryDate = document.querySelector('#category-date');
let categoryId = localStorage.categoryId;
let category = {};

window.addEventListener("DOMContentLoaded", () => {
  loadData();
})

function loadData() {
  if (categoryId) {
    getCategoryById(categoryId)
    .then(res => {
      category = res;
      console.log("category", category);
      categoryName.value = category.ten;
      categoryDate.value = category.ngayTao;
    })
  }
}

// get category by id
async function getCategoryById(id) {
  let API = `http://localhost:3000/subcategories/${id}`;
  let request = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify()
  }
  const response = await fetch(API, request);
  return response.json();
}

// add category
async function addCategory(data) {
  let API = `http://localhost:3000/subcategories`;
  let request = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  }
  const response = await fetch(API, request);
  return response.json();
}

// update category
async function updateCategory(data, id) {
  let API = `http://localhost:3000/subcategories/${id}`;
  let request = {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  }
  const response = await fetch(API, request);
  return response.json();
}

function setData() {
  let data = {
    ten: categoryName.value,
    ngayTao: categoryDate.value,
  }
  return data;
}

function saveData() {
  if (categoryId) {
    updateCategory(setData(), categoryId)
    .then(res => {
      alert("Cập nhật thành công");
    })
  } else {
    addCategory(setData())
    .then(res => {
      alert("Thêm danh mục mới thành công");
      location.pathname = 'template/pages/category/category.html';
    })
  }
}