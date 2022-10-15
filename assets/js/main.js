import { formValidate } from '../utils/validate.js';

/*=============== INPUT ANIMATION ===============*/
const inputs = document.querySelectorAll('.form__input');

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add('focus');
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == '') {
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

const getUsers = async (page, count) => {
  return await fetch(`https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${page}&count=${count}`)
    .then(response => { return response.json() })
    .then(data => {
      if (data.success) {
        data.users.forEach(({ photo, name, email, phone, position }) => {
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
              if (isEllipsisActive(text)) {
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
  if (showMore.getAttribute('disabled')) { return }

  showMore.setAttribute('disabled', 'disabled');
  userPage++;

  getUsers(userPage, userCount)
    .then(data => {
      if (!data.success || data.users.length < userCount) {
        showMore.setAttribute('hidden', 'hidden');
      }
    })
    .finally(() => showMore.removeAttribute('disabled'));
});


/*=============== TOKEN BLOCK ===============*/
let token = null;

fetch('https://frontend-test-assignment-api.abz.agency/api/v1/token')
  .then(response => { return response.json() })
  .then(data => { token = data.token });


/*=============== POSITION BLOCK ===============*/
const createElementPosition = (data) => {
  data.positions.forEach(({ name, id }) => {
    const element = document.createElement('div');
    element.classList.add('form__radio-block');

    element.innerHTML = `
              <input class="radio _req _radio" type="radio" name="position_id" value="${id}">
              <label for="radio-front">${name}</label>
          `;

    document.querySelector('.form__radio').append(element);
  });
  const checkbox = document.querySelectorAll('.radio');
  const elementError = document.createElement('div');
  elementError.classList.add('error-color', 'error-radio');
  document.querySelector('.form__radio').append(elementError);

  // ADD Attribute 'Checked' for radio button
  function removeCheked() {
    checkbox.forEach(item => {
      item.removeAttribute("checked", "checked");
    });
  }
  const addChecked = () => {
    checkbox.forEach(items => {
      items.addEventListener('click', (e) => {
        const target = e.target;
        if (target === items) {
          removeCheked();
          target.setAttribute("checked", "checked");
        }
      });
    });
  };
  addChecked();
}

async function getPosition() {
  return await fetch('https://frontend-test-assignment-api.abz.agency/api/v1/positions')
    .then(response => { return response.json() })
    .then(data => {
      if (data.success) {
        createElementPosition(data);
      }
    });
}

await getPosition();


/*=============== DISABLED/ENABLE BUTTON FORM ===============*/
inputs.forEach(input => {
  input.oninput = () => {
    const nameValue = document.getElementById('name').value;
    const emailValue = document.getElementById('email').value;
    const phoneValue = document.getElementById('phone').value;
    const btnForm = document.querySelector('.btn-form');
    if (nameValue.length < 1 || emailValue.length < 5 || phoneValue.length < 5) {
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


/*=============== Show success block ===============*/
const successBlock = document.querySelector('.success');
function showSuccess() {
  form.style.display = 'none';
  successBlock.style.display = 'block';
};


/*=============== User registered ===============*/
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  postData('https://frontend-test-assignment-api.abz.agency/api/v1/users', formData)
    .then(data => {
      const { fails } = data;
      const error = formValidate({ form, fails, document });
      if (!error && data.success) {
        document.querySelector('.cards').innerHTML = '';
        userPage = 1;
        getUsers(userPage, userCount);
        showMore.removeAttribute('disabled');
        showSuccess();
        form.reset();
      }
    })
    .finally(() => {
      textUpload.textContent = ``;
      setTimeout(() => {
        successBlock.style.display = 'none';
        form.style.display = 'block';
      }, 7000);
    });
});


/*=============== INPUT UPLOAD ===============*/
const inputUpload = document.getElementById('input-file');
const textUpload = document.getElementById('upload-text');
inputUpload.addEventListener('change', function () {
  let file = this.files[0].name;
  textUpload.placeholder = `${file}`;
});