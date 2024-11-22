$(document).ready(function() {
          $(".btn-enter").click(function() {
              var roomId = $(this).closest('.chat-card').data("room-id");
              window.location.href = "/enterRoom?roomId=" + roomId;
          });
      });