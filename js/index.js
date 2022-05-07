const postContainer = document.querySelector('.post-container');
const heroSlider = document.querySelector('.carousel-inner');
let posts = [];
let subCategories = [];
let newPosts = [];

window.addEventListener('DOMContentLoaded', () => {
  LoadData();
})

function LoadData() {
  getPostsData()
    .then(res => {
      posts = res;
      // console.log(posts);
      renderSlides(posts);
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
  renderPosts();
}

function renderPosts() {
  let data = subCategories.map(ele => {
    return `
      <section>
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="intro">
                <h1>${ele.ten}</h1>
              </div>
            </div>
          </div>
          <div class="row">
            ${ele.listPost.map(post => {
      if (post.daDuyet)
        return `
              <div class="col-md-4 mb-4">
                <article class="blog-post">
                  <div class="post-img">
                    <img src="${post.anhBia}" height="100%" alt="${post.anhBia}">
                  </div>
                  <a href="./Chi-tiet-bai-viet/post-detail.html" class="tag">Tìm hiểu</a>
                  <div class="content" style="min-height: 280px">
                      <small>${post.ngayTao}</small>
                      <h5>${post.tieuDe}</h5>
                      <p>${post.moTa}</p>
                  </div>
                </article>
              </div>
              `
    }).join('')}
          </div>
        </div>
      </section>
    `
  }).join('');
  postContainer.innerHTML = data;
}

function renderSlides(posts) {
  let data = posts.map((post, index) => {
    if (index === 0) {
      return `
      <div class="carousel-item active" style="background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url('${post.anhBia}');background-size:cover; background-repeat: no-repeat;width: 100%; height:90vh; overflow: hidden;">
        <div class="caroulse-content d-flex justify-content-center align-items-center flex-column" style="width: 100%; height: 100%;">
          <h1 style="color: white; width: 30%; text-align: center" class="mb-4">${post.tieuDe}</h1>
          <a class="btn btn-primary" href="">Tìm hiểu</a>
        </div>
      </div>
      `
    } else {
      return `
      <div class="carousel-item" style="background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url('${post.anhBia}');
      background-repeat: no-repeat; background-size:cover; width: 100%; height:90vh; overflow: hidden;">
        <div class="caroulse-content d-flex justify-content-center align-items-center flex-column" style="width: 100%; height: 100%;">
          <h1 style="color: white; width: 30%; text-align: center" class="mb-4">${post.tieuDe}</h1>
          <a class="btn btn-primary" href="">Tìm hiểu</a>
        </div>
      </div>
      `
    }
  }).join('');
  heroSlider.innerHTML = data;
}