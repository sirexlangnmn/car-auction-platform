let btnRegistration;
btnRegistration = getId('btnRegistration');



btnRegistration.addEventListener('click', (e) => {
  //stop submit the form, we will post it manually.
  e.preventDefault();

  const form = $('#registrtationForm');

    $.ajax({
      //url: '/api/post/looking-for-small-scale-company-registration',
      url: '/api/post/registration',
      type: 'post',
      data: form.serialize(),
  }).done((res) => {
      console.log('registration res : ', res)
  });
});