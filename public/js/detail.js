$(function() {
  $('.comment').click(function() {
    const commentId = $(this).data('cid');
    const toId = $(this).data('tid');

    if ($('#commentId').length) {
      $('#commentId').val(commentId);
    } else {
      $('<input>').attr({
        id: 'commentId',
        type: 'hidden',
        name: 'comment[cid]',
        value: commentId,
      }).appendTo('#commentForm');
    }

    if ($('#toId').length) {
      $('#toId').val(toId);
    } else {
      $('<input>').attr({
        id: 'toId',
        type: 'hidden',
        name: 'comment[tid]',
        value: toId,
      }).appendTo('#commentForm');
    }
  })
});
