const tableContent = document.querySelector('.table-content');
const currentId = localStorage.CurrentUser;
let records = document.querySelector('.records')
let checked = document.querySelectorAll('.checked');
let users = [];
let users_copy = [];
let user = {};
let modalHeader = document.querySelector('.modal-title');
// let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
let selectedAcc = '';
let permissionList = [
  {
    id: 'PER01',
    ten: 'Tổng biên tập'
  },
  {
    id: 'PER02',
    ten: 'Biên tập viên'
  },
  {
    id: 'PER03',
    ten: 'Thành viên'
  },
];

window.addEventListener('DOMContentLoaded', () => {
  getUsersData()
    .then(res => {
      users = res;
      users_copy = users;
      bindUsersToTable(users_copy)
      // console.log("users", users);
    })

  getUserData(currentId)
    .then(res => {
      user = res;
      // console.log("user", user);
      localStorage.setItem('currentUserObj', JSON.stringify(user));
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
      getBtnPermission(user.phanQuyen);
    })
})

// get users
async function getUsersData() {
  let userAPI = 'http://localhost:3000/users';
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
  const response = await fetch(userAPI, request);
  return response.json();
}

// get user by id
async function getUserData(id) {
  let userAPI = `http://localhost:3000/users/${id}`;
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
  const response = await fetch(userAPI, request);
  return response.json();
}

// add users
async function addUser(data) {
  let userAPI = `http://localhost:3000/users`;
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

// update user
async function updateUser(data, id) {
  let userAPI = `http://localhost:3000/users/${id}`;
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
  const response = await fetch(userAPI, request);
  return response.json();
}

// delete user
async function deleteUser(id) {
  let userAPI = `http://localhost:3000/users/${id}`;
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
  const response = await fetch(userAPI, request);
  return response.json();
}

function bindUsersToTable(users) {
  let data = users.map(user => {
    return `
    <tr>
      <td>
      <span class="pl-2">${user.taiKhoan}</span>
      </td>
      <td>${user.email}</td>
      <td>${getPermission(user.phanQuyen)}</td>
      <td>${user.ngaySinh}</td>

      <td class="edit-user">
        <a href="#" id="profile-dropdown" data-toggle="dropdown"><i class="mdi mdi-dots-vertical"></i></a>
        <div class="dropdown-menu dropdown-menu-right sidebar-dropdown preview-list" aria-labelledby="profile-dropdown">
          <a href="#" onclick="getUserDetail('${user._id}')" class="dropdown-item preview-item" id="test-dropdown">
            <div class="preview-thumbnail">
              <div class="preview-icon">
                <i class="mdi mdi-account-card-details text-info"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject ellipsis mb-1 text-small">Chi tiết</p>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item preview-item" id="test-dropdown" onclick="removeUser('${user._id}')">
            <div class="preview-thumbnail">
              <div class="preview-icon">
                <i class="mdi mdi-delete text-success"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject ellipsis mb-1 text-small">Xóa</p>
            </div>
          </a>
        </div>
      </td>
    </tr>
    `
  }).join('');
  tableContent.innerHTML = data;
}

function getPermission(permission) {
  if (permission === 'PER01') return 'Tổng biên tập'
  if (permission === 'PER02') return 'Biên tập'
  if (permission === 'PER03') return 'Thành viên'
}

function getBtnPermission(permission) {
  if (permission !== 'PER01') {
    document.querySelector('.add-new-user').style.visibility = 'hidden';
    document.querySelectorAll('.edit-user').forEach(ele => {
      ele.style.visibility = 'hidden';
    })
  }
}

function getUserDetail(id) {
  localStorage.setItem('currentUserId', id);
  location.pathname = '/template/pages/forms/profile.html'
}

function removeUser(id) {
  let text = 'Bạn có muốn xóa tài khoản này?'
  if (confirm(text) == true) {
    deleteUser(id);
    getUsersData()
      .then(res => {
        users = res;
        users_copy = users;
        bindUsersToTable(users_copy)
        // console.log("users", users);
      })
  }
}