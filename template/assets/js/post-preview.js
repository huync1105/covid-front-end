let post = {};
let user = {};

window.addEventListener('DOMContentLoaded', () => {
  getUserData();
  getPostData(localStorage.postId)
    .then(res => {
      post = res;
      // console.log("post", post);
      renderPost(post);
    })
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

function renderPost(post) {
  let data = `
    <header class="mb-4">
      <h1 class="fw-bolder mb-1">
        ${post.tieuDe}
      </h1>
      <div class="text-muted fst-italic mb-2">${post.ngayTao}</div>
    </header>
    <figure class="mb-4"><img class="img-fluid rounded"
        src="${post.anhBia}" alt="..." /></figure>
    <section class="mb-5">
      ${post.noiDungHTML}
    </section>
  `
  document.querySelector('.post-content').innerHTML = data;
  document.querySelector('.status').innerHTML = post.daDuyet ? `<div class="badge badge-outline-success">Được duyệt</div>` : `<div class="badge badge-outline-warning">Đang duyệt</div>`
}

function test() {
  let toSpeak = new SpeechSynthesisUtterance(post.noiDungText);
  toSpeak.lang = 'vi-VI';
  let synth = window.speechSynthesis;
  synth.speak(toSpeak)
}