const loginForm = $('#loginForm');
loginForm.on('submit', loginSubmitHandler);

function loginSubmitHandler(e) {
    e.preventDefault();

    $.ajax({
        url: '/api/post/login-process',
        type: 'POST',
        data: loginForm.serialize(),
        success: function (res) {
            console.log('logion-process res : ', res)
            if (res.message === 'Login Success') {
                // window.location.replace('/profile');
                window.location.replace('/listing');
            } else if (res.message !== 'Login Success') {
                // Swal.fire('Error', res.message, 'error');
                Swal.fire({
                    title: 'Warning',
                    text: res.message,
                    icon: 'warning',
                    confirmButtonText: 'OK'
                  })
            } else {
                // Swal.fire('Error', 'Please check your email address and password', 'error');
                Swal.fire({
                    title: 'Warning',
                    text: 'Please check your email address and password',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                })
            }
        },
    });
}