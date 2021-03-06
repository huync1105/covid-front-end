let user = {};
let categories = [];

window.addEventListener('DOMContentLoaded', () => {
  loadData();
})

function loadData() {
  getUserData();
  getCategories()
  .then(res => {
    categories = res;
    // console.log("categories", categories);
    bindDataToTable(categories);
  })
}

function getUserData() {
  user = JSON.parse(localStorage.currentUserObj);
  // console.log("user", user);
  document.querySelector('.profile-pic').innerHTML = `
    <div class="count-indicator">
      <img class="img-xs rounded-circle " src="../../assets/images/faces/face25.jpg" alt="">
    </div>
    <div class="profile-name">
      <h5 class="mb-0 font-weight-normal">${user.taiKhoan}</h5>
      <span>${getPermission(user.phanQuyen)}</span>
    </div>
  `
  document.querySelector('.navbar-profile').innerHTML = `
    <img class="img-xs rounded-circle" src="../../assets/images/faces/face25.jpg" alt="">
    <p class="mb-0 d-none d-sm-block navbar-profile-name">${user.taiKhoan}</p>
    <i class="mdi mdi-menu-down d-none d-sm-block"></i>
  `
}

function getPermission(permission) {
  if (permission === 'PER01') return 'Tổng biên tập'
  if (permission === 'PER02') return 'Biên tập'
  if (permission === 'PER03') return 'Thành viên'
}

// get post by id
async function getCategories() {
  let postAPI = `http://localhost:3000/subcategories`;
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
  const response = await fetch(postAPI, request);
  return response.json();
}

function bindDataToTable(categories) {
  let data = categories.map(obj => {
    return `
      <tr>
      <td><span class="">${obj.ten}</span></td>
      <td>${obj.ngayTao}</td>
      <td>
        <a href="#" id="profile-dropdown" data-toggle="dropdown"><i class="mdi mdi-dots-vertical"></i></a>
        <div class="dropdown-menu dropdown-menu-right sidebar-dropdown preview-list" aria-labelledby="profile-dropdown">
          <a href="./category-detail.html" class="dropdown-item preview-item" id="test-dropdown" onclick="addNewCategory('${obj._id}')">
            <div class="preview-thumbnail">
              <div class="preview-icon">
                <i class="mdi mdi-border-color text-info"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject ellipsis mb-1 text-small">Chỉnh sửa</p>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item preview-item" id="delete-post" onclick="deleteCategory('${obj._id}')">
            <div class="preview-thumbnail">
              <div class="preview-icon">
                <i class="mdi mdi-delete text-success"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject ellipsis mb-1 text-small">Xóa</p>
            </div>
          </button>
        </div>
        </td>
      </tr>
    `
  }).join('');
  document.querySelector('.category-content').innerHTML = data;
}

// create categories
async function createCategories(data) {
  let userAPI = `http://localhost:3000/subcategories`;
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
  const response = await fetch(userAPI, request);
  return response.json();
}

// delete categories
async function deleteCategoryAPI(id) {
  let API = `http://localhost:3000/subcategories/${id}`;
  let request = {
    method: 'DELETE',
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

function addNewCategory(id) {
  localStorage.setItem('categoryId', id);
  location.pathname = 'template/pages/category/category-detail.html';
}

function deleteCategory(id) {
  if (confirm('Bạn có muốn xóa danh mục này không?') == true) {
    deleteCategoryAPI(id)
    .then(res => {
    })
    loadData();
  }
}
