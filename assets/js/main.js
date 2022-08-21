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
          <p class="card-block__name text-overflow" data-text="${name}">${name}</p>
          <div class="card-block__info">
            <p class="card-block__info-position text-overflow">${position}</p>
            <p class="card-block__info-email text-overflow" data-text="${email}">${email}</p>
            <p class="card-block__info-phone text-overflow">${phone}</p>
          </div>
        `;

        document.querySelector('.cards').append(element);

        const checkEllips = () => {
          const textOverflows = document.querySelectorAll('.text-overflow');
          textOverflows.forEach(text => {
              if (isEllipsisActive(text) ) {
                  text.classList.add('cut');
              }
          })
        }

        function isEllipsisActive(e) {
          return (e.offsetWidth < e.scrollWidth);
        }

        checkEllips();
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
            <input class="_req" id="radio-front" type="radio" name="position_id" value="${id}">
            <label for="radio-front">${name}</label>
        `;

        document.querySelector('.form__radio').append(element);
      });
    }
  });


/*=============== ERROR BLOCK FORM ===============*/
// const validateEmail = (email) => {

//   return String(email)
//     .toLowerCase()
//     .match(
//       /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
//     );
// };


/*=============== DISABLED/ENABLE BUTTON FORM ===============*/
inputs.forEach(input => {
  input.oninput = () => {
    const nameValue = document.getElementById('name').value;
    const emailValue = document.getElementById('email').value;
    const phoneValue = document.getElementById('phone').value;
    const btnForm = document.querySelector('.btn-form');
    if (nameValue.length < 2 || emailValue.length < 5 || phoneValue.length < 5) {
      btnForm.setAttribute('disabled', true);
      btnForm.classList.add('disabled');
    } else {
      btnForm.removeAttribute('disabled');
      btnForm.classList.remove('disabled');
    }
  };
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
    } else {
      validateName();
      validateEmail(data);
      validatePhone(data);
      validatePhoto(data);
    }
  }).catch(() => {

  }).finally(() => {
  });
});


/*=============== Validate name ===============*/
function validateName() {
  const name = document.getElementById('name');
  if(name.value.length < 2 && name.value.length > 60) {
    const errorName = document.createElement('div');

    name.classList.add('error-border');
    errorName.classList.add('error-color');
    name.nextElementSibling.style.color = "var(--error-color)";
    errorName.innerHTML = 'Username should contain 2-60 characters.';
    name.parentNode.append(errorName);
  }
}


/*=============== Validate email ===============*/
const EMAIL_REGEXP = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
function validateEmail(data) {
  const email = document.getElementById('email');
  if (!isEmailValid(email.value)) {
    const errorName = document.createElement('div');

    email.classList.add('error-border');
    errorName.classList.add('error-color');
    email.nextElementSibling.style.color = "var(--error-color)";
    errorName.innerHTML = `${data.fails.email}`;
    email.parentNode.append(errorName);
  }
}

function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}


/*=============== Validate phone ===============*/
const PHONE_REGEXP = /^[\+]{0,1}380([0-9]{9})$/;

function validatePhone(data) {
  const phone = document.getElementById('phone');
  if (!isPhoneValid(phone.value)) {
    const errorName = document.createElement('div');

    phone.classList.add('error-border');
    errorName.classList.add('error-color');
    phone.nextElementSibling.style.color = "var(--error-color)";
    errorName.innerHTML = `${data.fails.phone}`;
    phone.parentNode.append(errorName);
  }
}

function isPhoneValid(value) {
  return PHONE_REGEXP.test(value);
}


/*=============== INPUT UPLOAD ===============*/
const inputUpload = document.getElementById('input-file');
const btnUpload = document.querySelector('.form__upload-btn');
const textUpload = document.getElementById('upload-text');
inputUpload.addEventListener('change', function() {
  let file = this.files[0].name;
  textUpload.textContent = `${file}`;
});


/*=============== Validate Upload File ===============*/
function validatePhoto(data) {
  if(inputUpload.value == '' || parseFloat(inputUpload.files[0].size/(1024*1024)) >= 5 || (inputUpload.files[0].type !== 'image/jpeg' || inputUpload.files[0].type !== 'image/jpg') ) {
    const errorName = document.createElement('div');

    btnUpload.classList.add('error-borderUpload');
    textUpload.classList.add('error-border');
    errorName.classList.add('error-upload');
    errorName.innerHTML = `${data.fails.photo}`;
    inputUpload.parentNode.append(errorName);
  }
}