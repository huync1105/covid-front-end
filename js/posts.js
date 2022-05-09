const navbarDropdown = document.querySelector('#navbarDropdown');
const deleteBtn = document.querySelector('.delete-btn');
const tableBody = document.querySelector('.table-body');
const postId = document.querySelector('#post-id');
const postTitle = document.querySelector('#post-title');
const postDescription = document.querySelector('#post-description');
const postImage = document.querySelector('#post-image');
const postCategory = document.querySelector('#post-category');
const postContent = document.querySelector('#post-content');
const postDate = document.querySelector('#post-date');
const postAccept = document.querySelector('#post-accepted');
const inputSearch = document.querySelector('#input-search');
const formSelect = document.querySelector('.form-select');
let records = document.querySelector('.records')
let checked = document.querySelectorAll('.checked');
let posts = [];
let posts_copy = [];
let modalHeader = document.querySelector('.modal-title');
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
let selectedPosts = '';
let categoryList = [];
let user;

window.addEventListener('DOMContentLoaded', () => {
  navbarDropdown.innerHTML = JSON.parse(localStorage.currentUserObj).taiKhoan;
  checkPermission();
  getPostsData()
    .then(res => {
      posts = res;
      posts_copy = posts;
      bindPostsToTable(posts_copy)
      // console.log("posts", posts);
    })
  deleteBtn.disabled = !(selectedPosts);
  getCategoryList()
    .then(res => {
      categoryList = res;
    })
})

function checkPermission() {
  user = JSON.parse(localStorage.currentUserObj);
  if (user.phanQuyen !== 'PER01') {
    postAccept.style.visibility = 'hidden';
    document.querySelector('.post-accepted-label').style.visibility = 'hidden';
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

// bind data to table
function bindPostsToTable(posts) {
  let data = posts.map((post, index) => {
    return `
    <tr>
      <td style="text-align: center;">
        <input class="form-check-input checked" type="checkbox" onchange="checkItem('${post._id}', ${index})" value="">
      </td>
      <th style="text-align: center;" scope="row">${index + 1}</th>
      <td>${post.tieuDe}</td>
      <td>${post.moTa}</td>
      <td style="text-align: center;">${post.ngayTao}</td>
      <td style="text-align: center;">
        ${(post.daDuyet?`<input class="form-check-input post-accepted-table" type="checkbox" checked disabled>`:`<input class="form-check-input post-accepted-table" type="checkbox" disabled>`)}
      </td>
      <td style="text-align: center;">
        <button class="edit-btn" onclick="openModal('${post._id}')">
          <i class="fas fa-pen"></i>
        </button>
      </td>
    </tr>
    `
  }).join('')
  tableBody.innerHTML = data;
  records.innerHTML = posts_copy.length;
  checked = document.querySelectorAll('.checked');
}

function bindDataDropDown() {
  let data = categoryList.map(ele => {
    return `
      <option value="${ele._id}">${ele.ten}</option>
    `
  })
  formSelect.innerHTML = data;
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

// delete post
async function deletePost(id) {
  let postAPI = `http://localhost:3000/posts/${id}`;
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
  const response = await fetch(postAPI, request);
  return response.json();
}

function openModal(id) {
  bindDataDropDown();
  if(id) {
    let selectedPost = posts.find(ele => ele._id === id);
    modalHeader.innerHTML = 'Cập nhật bài viết';
    postId.value = selectedPost._id;
    postTitle.value = selectedPost.tieuDe;
    postDescription.value = selectedPost.moTa;
    postImage.value = selectedPost.anhBia;
    formSelect.value = selectedPost.idDanhMuc;
    quill.setContents(JSON.parse(selectedPost.noiDung));
    postDate.value = selectedPost.ngayTao;
    postAccept.checked = selectedPost.daDuyet;
  } else {
    modalHeader.innerHTML = 'Thêm mới bài viết';
    postId.value = '';
    postTitle.value = '';
    postDescription.value = '';
    postImage.value = '';
    // postContent.value = '';
    postDate.value = new Date().toLocaleDateString();
    postAccept.checked = false;
    quill.root.innerHTML = '';
  }
  myModal.show()
}

function setData() {
  let data = {
    tieuDe: postTitle.value,
    moTa: postDescription.value,
    noiDung: JSON.stringify(quill.getContents()),
    noiDungHTML: quill.root.innerHTML,
    anhBia: postImage.value,
    idDanhMuc: formSelect.value,
    idNhanVien: '',
    daDuyet: postAccept.checked,
    ngayTao: new Date().toLocaleDateString()
  }
  console.log("data", data);
  return data;
}

function saveData() {
  if (modalHeader.textContent === 'Thêm mới bài viết') {
    addPost(setData());
    myModal.hide();
  } else {
    updatePost(setData(), postId.value);
    myModal.hide();
  }
  getPostsData()
  .then(res => {
    posts = res;
    posts_copy = posts;
    bindPostsToTable(posts_copy)
  })
}

function checkItem(id, i) {
  checked.forEach(ele => {
    ele.disabled = checked[i].checked
  })
  checked[i].disabled = false;
  if (checked[i].checked) {
    selectedPosts = id;
  } else {
    selectedPosts = '';
  }
  deleteBtn.disabled = !(selectedPosts);
}

function removePost() {
  deletePost(selectedPosts);
  selectedPosts = '';
  getPostsData()
    .then(res => {
      posts = res;
      posts_copy = posts;
      bindPostsToTable(posts_copy)
      // console.log("users", users);
    })
}

function searchPost() {
  let result = inputSearch.value.trim().toString();
  if (result) {
    posts_copy = posts.filter(ele => ele.tieuDe.toLowerCase().includes(result));
    bindPostsToTable(posts_copy)
  } else {
    posts_copy = posts;
    bindPostsToTable(posts_copy)
  }
}

