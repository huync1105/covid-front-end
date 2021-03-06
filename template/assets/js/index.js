
let currentUser = {};
let users = [];
let posts = [];

window.addEventListener('DOMContentLoaded', () => {
  loadData();
})

function loadData() {
  getUserData(localStorage.CurrentUser)
  .then(res => {
    currentUser = res;
    // console.log("currentUser", currentUser);
    localStorage.setItem('currentUserObj', JSON.stringify(currentUser));
    document.querySelector('.profile-pic').innerHTML = `
      <div class="count-indicator">
        <img class="img-xs rounded-circle " src="assets/images/faces/face25.jpg" alt="">
      </div>
      <div class="profile-name">
        <h5 class="mb-0 font-weight-normal">${currentUser.taiKhoan}</h5>
        <span>${getUserPermissionName(currentUser.phanQuyen)}</span>
      </div>
    `
    document.querySelector('.navbar-profile').innerHTML = `
      <img class="img-xs rounded-circle" src="assets/images/faces/face25.jpg" alt="">
      <p class="mb-0 d-none d-sm-block navbar-profile-name">${currentUser.taiKhoan}</p>
      <i class="mdi mdi-menu-down d-none d-sm-block"></i>
    `
  })
  getUsersData()
  .then(res => {
    users = res;
    // console.log("users", users);
  })
  getPostsData()
  .then(res => {
    posts = res;
    mergeData(users, posts);
    bindDataToTable();
    // console.log("posts", posts);
  })
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

function checkPermission(permission) {
  if (permission !== "PER01") {
    document.querySelectorAll('#delete-post').array.forEach(element => {
      element.style.visibility = 'hidden';
    });
  }
}

// get posts
async function getPostsData() {
  let postAPI = 'http://localhost:3000/posts';
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

// delete post
async function deletePostData(id) {
  let userAPI = `http://localhost:3000/posts/${id}`;
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

function mergeData(users, posts) {
  posts.forEach(post => {
    post.author = {};
    users.forEach(user => {
      if (user._id === post.idNhanVien) {
        post.author = user;
      }
    })
  })
  // console.log(posts);
}

function bindDataToTable() {
  let data = posts.map(post => {
    return `
    <tr>
      <td>
        <img src="assets/images/faces/face25.jpg" alt="image" />
        <span class="pl-2">${post.author.taiKhoan}</span>
      </td>
      <td> ${getUserPermissionName(post.author.phanQuyen)} </td>
      <td> ${post.tieuDe} </td>
      <td> ${post.ngayTao} </td>
      <td>
        ${post.daDuyet?`<div class="badge badge-outline-success">???????c duy???t</div>`:`<div class="badge badge-outline-warning">??ang duy???t</div>`}
      </td>
      <td>
        <a href="#" id="profile-dropdown" data-toggle="dropdown"><i class="mdi mdi-dots-vertical"></i></a>
        <div class="dropdown-menu dropdown-menu-right sidebar-dropdown preview-list" aria-labelledby="profile-dropdown">
          <a href="./pages/forms/post-preview.html" class="dropdown-item preview-item" id="test-dropdown" onclick="previewPost('${post._id}')">
            <div class="preview-thumbnail">
              <div class="preview-icon">
                <i class="mdi mdi-eye text-info"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject ellipsis mb-1 text-small">Xem tr?????c</p>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <a href="../template/pages/forms/post.html" class="dropdown-item preview-item" id="test-dropdown" onclick="createPost('${post._id}')">
            <div class="preview-thumbnail">
              <div class="preview-icon">
                <i class="mdi mdi-border-color text-info"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject ellipsis mb-1 text-small">Ch???nh s???a</p>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item preview-item" id="delete-post" onclick="deletePost('${post._id}')">
            <div class="preview-thumbnail">
              <div class="preview-icon">
                <i class="mdi mdi-delete text-success"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <p class="preview-subject ellipsis mb-1 text-small">X??a</p>
            </div>
          </button>
        </div>
      </td>
    </tr>
    `
  }).join('');
  document.querySelector('.posts-container').innerHTML = data;
}

function getUserPermissionName(permission) {
  if (permission === 'PER01') return 'T???ng bi??n t???p'
  if (permission === 'PER02') return 'Bi??n t???p'
  if (permission === 'PER03') return 'Th??nh vi??n'
}

function createPost(id) {
  localStorage.setItem('postId', id);
}

function previewPost(id) {
  localStorage.setItem('postId', id);
} 

function deletePost(id) {
  let text = "B???n c?? mu???n x??a b??i vi???t n??y?";
  if (confirm(text) == true) {
    deletePostData(id)
    .then(res => {
      alert("X??a th??nh c??ng");
      loadData();
    })
    .catch(err => {})
  }
}