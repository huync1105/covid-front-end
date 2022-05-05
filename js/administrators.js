const navBarDropDown = document.querySelector('#navbarDropdown');
const currentId = localStorage.CurrentUser;
const tableBody = document.querySelector('.table-body');
const userId = document.querySelector('#user-id');
const userName = document.querySelector('#user-name');
const userPassword = document.querySelector('#user-password');
const userEmail = document.querySelector('#user-email');
const userPhone = document.querySelector('#user-phone');
const userAddress = document.querySelector('#user-address');
const userDate = document.querySelector('#user-date');
const userPermission = document.querySelector('.form-select');
const modal = document.querySelector('.modal');
const deleteBtn = document.querySelector('.delete-btn');
const inputSearch = document.querySelector('#input-search');
let records = document.querySelector('.records')
let checked = document.querySelectorAll('.checked');
let users = [];
let users_copy = [];
let user = {};
let modalHeader = document.querySelector('.modal-title');
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
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

  getUserData()
    .then(res => {
      user = res;
      console.log(res);
      localStorage.setItem('currentUserObj', JSON.stringify(user));
      // console.log("user", user);
      navBarDropDown.innerHTML = user.taiKhoan;
    })

  deleteBtn.disabled = !(selectedAcc);
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
async function getUserData() {
  let userAPI = `http://localhost:3000/users/${currentId}`;
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

// bind data to table
function bindUsersToTable(users) {
  let data = users.map((user, index) => {
    return `
    <tr>
      <td style="text-align: center;">
        <input class="form-check-input checked" type="checkbox" onchange="checkItem('${user._id}', ${index})" value="">
      </td>
      <th style="text-align: center;" scope="row">${index + 1}</th>
      <td>${user.taiKhoan}</td>
      <td>${user.email}</td>
      <td style="text-align: center;">${user.ngaySinh}</td>
      <td>${user.diaChi}</td>
      <td style="text-align: center;">+84 ${user.soDienThoai}</td>
      <td style="text-align: center;">
        <button class="edit-btn" onclick="openModal('${user._id}')">
          <i class="fas fa-pen"></i>
        </button>
      </td>
    </tr>
    `
  }).join('')
  tableBody.innerHTML = data;
  records.innerHTML = users_copy.length;
  checked = document.querySelectorAll('.checked');
}

function bindDropDown() {
  let data = permissionList.map(ele => {
    return `
    <option value="${ele.id}">${ele.ten}</option>
    `
  })
  userPermission.innerHTML = data;
}

function openModal(id) {
  bindDropDown();
  if(id) {
    let selectedUser = users.find(ele => ele._id === id);
    modalHeader.innerHTML = 'Cập nhật tài khoản';
    userId.value = selectedUser._id;
    userName.value = selectedUser.taiKhoan;
    userPassword.value = selectedUser.matKhau;
    userEmail.value = selectedUser.email;
    userPhone.value = selectedUser.soDienThoai;
    userAddress.value = selectedUser.diaChi;
    userDate.value = selectedUser.ngaySinh;
    userPermission.value = selectedUser.phanQuyen;
  } else {
    modalHeader.innerHTML = 'Thêm mới tài khoản';
    userId.value = '';
    userName.value = '';
    userPassword.value = '';
    userEmail.value = '';
    userPhone.value = '';
    userAddress.value = '';
    userDate.value = '';
    // userPermission.value = '';
  }
  myModal.show()
}

function setData() {
  let data = {
    taiKhoan: userName.value,
    matKhau: userPassword.value,
    email: userEmail.value,
    soDienThoai: userPhone.value,
    diaChi: userAddress.value,
    ngaySinh: userDate.value,
    phanQuyen: userPermission.value
  }
  return data;
}

function saveData() {
  if (modalHeader.textContent === 'Thêm mới tài khoản') {
    if (checkExistedUSerName()) {
      addUser(setData());
      myModal.hide();
    }
  } else {
    updateUser(setData(), userId.value);
    myModal.hide();
  }
  getUsersData()
    .then(res => {
      users = res;
      users_copy = users;
      bindUsersToTable(users_copy)
    })
}

function checkExistedUSerName() {
  let existedUserNames = users.map(obj => obj.taiKhoan);
  if (existedUserNames.includes(setData().taiKhoan)) {
    alert('Tài khoản đã tồn tại');
    return false;
  } else {
    return true;
  }
}

function checkItem(id, i) {
  checked.forEach(ele => {
    ele.disabled = checked[i].checked
  })
  checked[i].disabled = false;
  if (checked[i].checked) {
    selectedAcc = id;
  } else {
    selectedAcc = '';
  }
  deleteBtn.disabled = !(selectedAcc);
}

function removeUser() {
  deleteUser(selectedAcc);
  selectedAcc = '';
  getUsersData()
    .then(res => {
      users = res;
      users_copy = users;
      bindUsersToTable(users_copy)
      // console.log("users", users);
    })
}

function searchUser() {
  let result = inputSearch.value.trim().toString();
  if (result) {
    users_copy = users.filter(ele => ele.taiKhoan.includes(result));
    bindUsersToTable(users_copy)
  } else {
    users_copy = users;
    bindUsersToTable(users_copy)
  }
}