const deleteBtn = document.querySelector('.delete-btn');
const tableBody = document.querySelector('.table-body');
const postId = document.querySelector('#post-id');
const postTitle = document.querySelector('#post-title');
const postDescription = document.querySelector('#post-description');
const postImage = document.querySelector('#post-image');
const postCategory = document.querySelector('#post-category');
const postContent = document.querySelector('#post-content');
const postDate = document.querySelector('#post-date');
const inputSearch = document.querySelector('#input-search');
let records = document.querySelector('.records')
let checked = document.querySelectorAll('.checked');
let posts = [];
let posts_copy = [];
let modalHeader = document.querySelector('.modal-title');
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
let selectedPosts = '';

window.addEventListener('DOMContentLoaded', () => {
  getPostsData()
    .then(res => {
      posts = res;
      posts_copy = posts;
      bindPostsToTable(posts_copy)
      // console.log("posts", posts);
    })

  deleteBtn.disabled = !(selectedPosts);
})

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
async function updatepost(data, id) {
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
  if(id) {
    let selectedPost = posts.find(ele => ele._id === id);
    modalHeader.innerHTML = 'Cập nhật bài viết';
    postId.value = selectedPost._id;
    postTitle.value = selectedPost.tieuDe;
    postDescription.value = selectedPost.moTa;
    postImage.value = selectedPost.anhBia;
    postContent.value = selectedPost.noiDung;
    postDate.value = selectedPost.ngayTao;
  } else {
    modalHeader.innerHTML = 'Thêm mới bài viết';
    postId.value = '';
    postTitle.value = '';
    postDescription.value = '';
    postImage.value = '';
    postContent.value = '';
    postDate.value = new Date().toLocaleDateString();
  }
  myModal.show()
}

function setData() {
  let data = {
    tieuDe: postTitle.value,
    moTa: postDescription.value,
    noiDung: postContent.value,
    anhBia: postImage.value,
    idDanhMuc: '',
    idNhanVien: '',
    idTrangThai: '',
    ngayTao: new Date().toLocaleDateString()
  }
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