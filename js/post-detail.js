const accordion = document.querySelector('.accordion');
let posts = [];
let subCategories = [];

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
      
    `
  })
}