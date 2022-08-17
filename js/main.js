/*=============== INPUT ANIMATION ===============*/
const inputs = document.querySelectorAll('.form__input');

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add('focus');
}

function blurFunc() {
  let parent = this.parentNode;
  if(this.value == '') {
    parent.classList.remove('focus');
  }
}

inputs.forEach(input => {
  input.addEventListener('focus', focusFunc);
  input.addEventListener('blur', blurFunc);
})


/*=============== INPUT UPLOAD ===============*/
const inputUpload = document.getElementById('input-file');
inputUpload.addEventListener('change', function() {
  let file = this.files[0].name;
  document.getElementById('upload-text').textContent = `${file}`;
});


/*=============== GET BLOCK ===============*/
let userPage = 1;
const userCount = 6;

const getUsers = (page, count) => {
  return fetch(`https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${page}&count=${count}`)
  .then(response => { return response.json() })
  .then(data => {
    if(data.success) {
      data.users.forEach(({photo, name, email, phone, position}) => {
        const element = document.createElement('div');

        element.classList.add('card-block');

        element.innerHTML = `
          <img class="card-block__img" src=${photo} alt="photo">
          <p class="card-block__name text-overflow">${name}</p>
          <div class="card-block__info">
            <p class="card-block__info-position text-overflow">${position}</p>
            <p class="card-block__info-email text-overflow">${email}</p>
            <p class="card-block__info-phone text-overflow">${phone}</p>
          </div>
        `;

        document.querySelector('.cards').append(element);
      });
    };

    return data;
  });
}

getUsers(userPage, userCount);


/*=============== BUTTON GET BLOCKS ===============*/
const showMore = document.querySelector('.show-more');
showMore.addEventListener('click', () => {
  if(showMore.getAttribute('disabled')) { return }

  showMore.setAttribute('disabled', 'disabled');
  userPage++;

  getUsers(userPage, userCount)
    .then(data => {
      if(!data.success || data.users.length < userCount) {
        showMore.setAttribute('hidden', 'hidden');
      }
    })
    .finally(() => showMore.removeAttribute('disabled'));
});


/*=============== TOKEN BLOCK ===============*/
let token = null;

fetch('https://frontend-test-assignment-api.abz.agency/api/v1/token')
  .then(response => { return response.json(); })
  .then(data => { token = data.token });


/*=============== POSITION BLOCK ===============*/
  fetch('https://frontend-test-assignment-api.abz.agency/api/v1/positions')
    .then(response => { return response.json(); })
    .then(data => {
      if(data.success) {
        data.positions.forEach(({name, id}) => {
          const element = document.createElement('div');
          element.classList.add('form__radio-block');

          element.innerHTML = `
              <input id="radio-front" type="radio" name="position_id" value="${id}">
              <label for="radio-front">${name}</label>
          `;
  
          document.querySelector('.form__radio').append(element);
        });
      }
    });


/*=============== POST BLOCK ===============*/
const form = document.querySelector('.form');

const postData = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Token': token,
    },
    body: data
  });

  return await response.json();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  postData('https://frontend-test-assignment-api.abz.agency/api/v1/users', formData)
  .then(data => {
    if(data.success) {
      document.querySelector('.cards').innerHTML = '';
      userPage = 1;
      getUsers(userPage, userCount);
      showMore.removeAttribute('disabled');
    }
    // showThanksModal(message.success);
    // statusMessage.remove();
  }).catch(() => {
    // showThanksModal(message.failture);
  }).finally(() => {
    form.reset();
  });
});
