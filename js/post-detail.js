const accordion = document.querySelector('.accordion');
const postContent = document.querySelector('.post-content');
let posts = [];
let subCategories = [];
let post = {};

window.addEventListener('DOMContentLoaded', () => {
  loadData();
})

function loadData() {
  getPostsData()
    .then(res => {
      posts = res;
      // console.log(posts);
    })
  getCategoryList()
    .then(res => {
      subCategories = res;
      joinPosts();
      renderAccordion();
    })
  getPostData()
    .then(res => {
      post = res;
      // console.log("post", post);
      renderPostContent();
    })
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

function joinPosts() {
  subCategories.forEach(category => {
    category.listPost = [];
    posts.forEach(post => {
      if (post.idDanhMuc === category._id) {
        category.listPost.push(post)
      }
    })
  })
}

function renderAccordion() {
  let data = subCategories.map(ele => {
    return `
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            ${ele.ten}
            <span class="fa fa-chevron-down"></span>
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <div class="list-group">
              ${ele.listPost.map(post => {
                return `
                  <a href="" class="list-group-item list-group-item-action" onclick="changePage('${post._id}')">${post.tieuDe}</a>
                `
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `
  }).join('');
  accordion.innerHTML = data;
}

function changePage(id) {
  localStorage.setItem('currentPostId', id);
}

// get post by id
async function getPostData() {
  let currentPostId = localStorage.currentPostId;
  // console.log(currentPostId);
  let userAPI = `http://localhost:3000/posts/${currentPostId}`;
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

function renderPostContent() {
  console.log(post);
  let category = subCategories.find(obj => obj._id === post.idDanhMuc).ten;
  // console.log(category);
  let data = `
    <h3 class="mb-4">${category}</h3>
    <img src="${post.anhBia}" class="img-fluid" alt="${post.anhBia}">
    <p></p>
    <h3>${post.tieuDe}</h3>
    ${post.noiDungHTML}
  `
  postContent.innerHTML = data;
}