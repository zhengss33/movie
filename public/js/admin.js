$(function() {
  $('.delmovie').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);

    $.ajax({
      type: 'DELETE',
      url: '/admin/movie/list?id=' + id,
    }).done(function(results) {
      if (results.success) {
        tr && tr.remove();
      }
    });
  });

  $('.douban').blur(function() {
    const id = $(this).val();
    console.log(id);
  });
})
