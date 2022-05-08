const userName = document.querySelector('#username');
const passWord = document.querySelector('#passWord');
const loginBtn = document.querySelector('.login-btn');
let users = [];

// get users
window.addEventListener('DOMContentLoaded', () => {
  async function getUserData() {
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
  getUserData()
    .then(res => {
      users = res;
      console.log("users", users);
    })
})

loginBtn.addEventListener('click', () => {
  let userObj = {
    taiKhoan: userName.value,
    matKhau: passWord.value
  }
  checkUser(userObj);
})

function checkUser(user) {
  let arrTaiKhoan = users.map(ele => ele.taiKhoan);
  if (!arrTaiKhoan.includes(user.taiKhoan)) {
    userName.classList.add('validate');
  } else {
    removeInvalidText(userName, 'validate');
    let existedUser = users.find(ele => ele.taiKhoan === user.taiKhoan);
    if (user.matKhau !== existedUser.matKhau) {
      passWord.classList.add('validate');
    } else {
      removeInvalidText(passWord, 'validate');
      let toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      let currentUserId = existedUser._id;
      localStorage.setItem('CurrentUser', currentUserId);
      window.location.pathname = '/Administrator/administrators.html'
    }
  }
}

function removeInvalidText(btnObj, className) {
  if (btnObj.classList.contains(className)) {
    btnObj.classList.remove(className);
  }
}