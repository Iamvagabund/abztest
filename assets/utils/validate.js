function isError(nameOfInput, fieldTest, action, inputField, failField, error) {
  if (inputField.classList.contains(nameOfInput)) {
    console.log(inputField);
    if (fieldTest(inputField)) {
      action(inputField, failField);
      return true;
    }
  }
  return error;
}

export function formValidate({ form, fails, document }) {
  let error = 0;
  let formReq = document.querySelectorAll('._req');
  formRemoveErrorUpload();
  formRemoveError();
  for (let index = 0; index < formReq.length; index++) {
    const input = formReq[index];
    isError('_phone', phoneTest, formAddError, input, fails.phone);
    isError('_name', nameTest, formAddError, input, fails.name);
    isError('_email', emailTest, formAddError, input, fails.email);
    isError('_radio', radioTest, formAddError, input, fails.position_id);
    isError('input-file', photoTest, formAddErrorUpload, input, fails.photo);
  }
  return error;
}

//add error class
function formAddError(input, error) {
  if (input.classList.contains('radio')) {
    const errorRadio = document.querySelector('.error-radio');
    errorRadio.style.display = "block";
    errorRadio.innerHTML = `${error}`;
  } else {
    input.parentNode.lastElementChild.style.display = "block";
    input.parentNode.lastElementChild.innerHTML = `${error}`;
    input.classList.add('error-border');
    input.nextElementSibling.style.color = "var(--error-color)";
  }
}
//add error class for photoUpload
function formAddErrorUpload(input, error) {
  input.parentNode.firstElementChild.classList.add('error-borderUpload');
  document.querySelector('.form__upload-text').classList.add('error-border');
  input.parentNode.lastElementChild.style.display = "block";
  input.parentNode.lastElementChild.innerHTML = `${error}`;
}
//remove error class
function formRemoveError() {
  const errorField = document.querySelectorAll('.error-color');
  errorField.forEach(error => {
    const firstParentChild = error.parentNode.firstElementChild;
    error.style.display = "none";
    error.style.innerHTML = ``;
    firstParentChild.classList.remove('error-border');
    firstParentChild.nextElementSibling.style.color = '';
  });
}
//remove error class photoUpload
function formRemoveErrorUpload() {
  const inputUpload = document.querySelector('.input-file');
  inputUpload.parentNode.firstElementChild.classList.remove('error-borderUpload');
  document.querySelector('.form__upload-text').classList.remove('error-border');
  inputUpload.parentNode.lastElementChild.style.display = "none";
  inputUpload.parentNode.lastElementChild.innerHTML = '';
}
//check email valid
function emailTest(input) {
  return !/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(input.value);
}
// check phone valid
function phoneTest(input) {
  return !/^[\+]{0,1}380([0-9]{9})$/.test(input.value);
}
// check name valid
function nameTest(input) {
  return input.value.length < 2 || input.value.length > 60;
}
// check radio valid
function radioTest() {
  const checkbox = document.querySelectorAll('.radio');
  for (let i = 0; i < checkbox.length; i++) {
    return (checkbox[i].hasAttribute('checked') === false);
  }
}
// check photoUpload valid
function photoTest() {
  const inputUpload = document.querySelector('.input-file');
  return (inputUpload.value == '' || parseFloat(inputUpload.files[0].size / (1024 * 1024)) >= 5 && (inputUpload.files[0].type !== 'image/jpeg' || inputUpload.files[0].type !== 'image/jpg'))
}