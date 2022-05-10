const accordion = document.querySelector('.accordion');
const postContent = document.querySelector('.post-content');
const searchResult = document.querySelector('.search-result');
const searchInput = document.querySelector('#search-post');
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
  let currentPostId = localStorage.postId;
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
  // console.log(post);
  let category = subCategories.find(obj => obj._id === post.idDanhMuc).ten;
  // console.log(category);
  let data = `
  <h3 class="mb-4">${category}</h3>
  <img src="${post.anhBia}" class="img-fluid" alt="${post.anhBia}">
  <div class="mt-3">
    <button type="button" class="btn btn-primary play" onclick="playSpeech()">
    <i class="fas fa-play"></i> Phát
    </button>
    <button type="button" class="btn btn-danger pause" onclick="pauseSpeech()">
    <i class="fas fa-pause"></i> Dừng
    </button>
  </div>
  <p></p>
    <h3>${post.tieuDe}</h3>
    ${post.noiDungHTML}
  `
  postContent.innerHTML = data;
}


let synth = window.speechSynthesis;
let toSpeak = new SpeechSynthesisUtterance(post.noiDungText);
toSpeak.lang = 'vi-VI';

function playSpeech() {
  toSpeak.rate = 2
  synth.speak(toSpeak);
  console.log(synth);
}

function pauseSpeech() {
  synth.pause();
  console.log(synth);
}

searchInput.addEventListener('keyup', () => {
  let closeBtn = `
    <div class="search-close" style="position: absolute; top: 20px; right: 20px">
      <button class="btn" onclick="closeSearch()">
          <i class="fas fa-times-circle"></i>
      </button>
    </div>
  `
  if (searchInput.value.trim().toString()) {
    let postFilter = posts.filter(post => post.tieuDe.toLowerCase().includes(searchInput.value.toLowerCase()));
    if (postFilter.length) {
      let data = postFilter.map(post => {
        return `
        <div class="container p-2 d-flex search-container" onclick="seeDetail('${post._id}')">
          <img class="img-thumbnail me-3" src="${post.anhBia}">
          <div class="search-content">
              <h4 class="m-0 t-overflow">${post.tieuDe}</h3>
              <p class="m-0 t-overflow"><i>${post.moTa}</i></p>
              <p class="m-0">${post.ngayTao}</p>
          </div>
        </div>
        `
      }).join('')
      searchResult.innerHTML = data + closeBtn;
    } else {
      searchResult.innerHTML = `
      <div class="container p-2 d-flex search-container justify-content-center">
        <img class="img-fluid" style="max-width:50%" src="https://cdn.dribbble.com/users/1094048/screenshots/3393640/media/25b931a815bc90e9f5717f892c53834a.png">
      </div>
    ` + closeBtn
    }
  } else {
    searchResult.innerHTML = `
      <div class="container p-2 d-flex search-container justify-content-center">
        <img class="img-fluid" style="max-width:50%" src="https://cdn.dribbble.com/users/1094048/screenshots/3393640/media/25b931a815bc90e9f5717f892c53834a.png">
      </div>
    ` + closeBtnd
  }
  searchResult.style.display = 'block';
})

function seeDetail(id) {
  console.log(id);
  localStorage.setItem('postId', id);
  location.pathname = 'Chi-tiet-bai-viet/post-detail.html'
}

function closeSearch() {
  searchResult.style.display = 'none';
}