let btnCreateAuction;
btnCreateAuction = getId('btnCreateAuction');



btnCreateAuction.addEventListener('click', (e) => {
  e.preventDefault();

  const form = $('#createAuctionForm');

    $.ajax({
      url: '/api/post/create-auction',
      type: 'post',
      data: form.serialize(),
  }).done((res) => {
      console.log('btnCreateAuction res : ', res)
      Swal.fire({
        title: res.title,
        text: res.message,
        icon: res.icon,
        confirmButtonText: 'OK'
      })
  });
});