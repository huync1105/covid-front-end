const postId = document.querySelector('#post-id');
const postTitle = document.querySelector('#post-title');
const postDescription = document.querySelector('#post-description');
const postImage = document.querySelector('#post-image');
const postCategory = document.querySelector('#post-category');
const postDate = document.querySelector('#post-date');
const postAccept = document.querySelector('#post-accepted');
let user = {};
let post = {};
let currentPostId = "";
let categoryList = [];
let statusList = [
  {label: 'Đã duyệt', value: true},
  {label: 'Đang duyệt', value: false},
]

window.addEventListener('DOMContentLoaded', () => {
  getUserData()
  getCategoryList()
  .then(res => {
    categoryList = res;
    // console.log("categoryList", res);
    bindCategoryDropDown();
  })
  if (localStorage.postId) {
    getPostData(localStorage.postId)
    .then(res => {
      post = res;
      console.log("post", post);
      postTitle.value = post.tieuDe;
      postDescription.value = post.moTa;
      postImage.value = post.anhBia;
      postCategory.value = post.idDanhMuc;
      postDate.value = post.ngayTao;
      postAccept.value = post.daDuyet;
      quill.setContents(JSON.parse(post.noiDung));
    })
  } else {
    quill.root.innerHTML = '';
  }
})

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

// get category list
async function getCategoryList() {
  let API = 'http://localhost:3000/subcategories';
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

function bindCategoryDropDown() {
  let data = categoryList.map(ele => {
    return `
      <option value="${ele._id}">${ele.ten}</option>
    `
  })
  let data2 = statusList.map(ele => {
    return `
      <option value=${ele.value}>${ele.label}</option>
    `
  })
  document.querySelector('#post-category').innerHTML = data;
  document.querySelector('#post-accepted').innerHTML = data2;
}

// get post by id
async function getPostData(id) {
  let postAPI = `http://localhost:3000/posts/${id}`;
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


// add posts
async function addPost(data) {
  let postAPI = `http://localhost:3000/posts`;
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
  const response = await fetch(postAPI, request);
  return response.json();
}

// update post
async function updatePost(data, id) {
  let postAPI = `http://localhost:3000/posts/${id}`;
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
  const response = await fetch(postAPI, request);
  return response.json();
}

function setData() {
  let data = {
    tieuDe: postTitle.value,
    moTa: postDescription.value,
    noiDung: JSON.stringify(quill.getContents()),
    noiDungHTML: quill.root.innerHTML,
    anhBia: postImage.value,
    idDanhMuc: postCategory.value,
    idNhanVien: user._id,
    daDuyet: postAccept.value,
    ngayTao: new Date().toLocaleDateString()
  }
  return data;
}

function saveData() {
  // console.log("setData", setData());
  if (localStorage.postId) {
    updatePost(setData(), postId.value);
  } else {
    addPost(setData())
    .then(res => {
      alert(`Thêm bài viết thành công!`)
      location.pathname = 'template/index.html';
    })
    .catch(err => {})
    .finally(() => {
    })
  }
}