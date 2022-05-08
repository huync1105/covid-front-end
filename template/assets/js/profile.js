const userId = document.querySelector('#user-id');
const userName = document.querySelector('#user-name');
const userPassword = document.querySelector('#user-password');
const userEmail = document.querySelector('#user-email');
const userPhone = document.querySelector('#user-phone');
const userAddress = document.querySelector('#user-address');
const userDate = document.querySelector('#user-date');
const userPermission = document.querySelector('#form-select');
let currentUserId = "";
let currentUser = {};
let user = {};
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

window.addEventListener("DOMContentLoaded", () => {
  loadData();
})

function loadData() {
  // Lấy userId từ input
  currentUserId = localStorage.currentUserId;
  // console.log("currentUserId", currentUserId);
  getUserData(currentUserId)
  .then(res => {
    user = res;
    // console.log(user);
    bindDataToInput(user)
  })
  getUserData(localStorage.CurrentUser)
  .then(res => {
    currentUser = res;
    // console.log("currentUser",currentUser);
  })
  bindDropDown();
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

// truyen data vao input
function bindDataToInput(user) {
  checkPermission(user.phanQuyen)
  if (user._id) {
    userPermission.value = user.phanQuyen;
    userDate.value = user.ngaySinh;
    userAddress.value = user.diaChi;
    userPhone.value = user.soDienThoai;
    userEmail.value = user.email;
    userPassword.value = user.matKhau;
    userName.value = user.taiKhoan;
  } else {
    // userPermission.value = user.phanQuyen;
    userDate.value = "";
    userAddress.value = "";
    userPhone.value = "";
    userEmail.value = "";
    userPassword.value = "";
    userName.value = "";
  }
}

// truyen data vao dropdown
function bindDropDown() {
  let data = permissionList.map(ele => {
    return `
      <option value="${ele.id}">${ele.ten}</option>
    `
  }).join('')
  userPermission.innerHTML = data;
}

function checkPermission(permission) {
  if (permission !== "PER01") {
    userPassword.type = "password"
  } 
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

function setData() {
  let data = {
    taiKhoan: userName.value,
    matKhau: userPassword.value,
    email: userEmail.value,
    soDienThoai: userPhone.value,
    diaChi: userAddress.value,
    ngaySinh: userDate.value,
    phanQuyen: userPermission.value,
  }
  return data;
}

function saveUser() {
  // console.log(user);
  // console.log(setData());
  if (user._id) {
    updateUser(setData(), user._id)
    .then(res => {
      alert('Lưu thành công')
    })
    .catch(err => console.log(err))
    .finally()
  } else {
    addUser(setData())
    .then(res => {
      alert('Thêm thành công');
      location.pathname = 'template/pages/user/User.html'
    });
    
  }
}