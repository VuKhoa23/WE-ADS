$(document).ready(function () {
  $("#plannedCbx").change(function () {
    if (this.checked === true) {
      $(".planned-marker").css("display", "flex");
    } else {
      $(".planned-marker").css("display", "none");
    }
  });

  $("#un-plannedCbx").change(function () {
    if (this.checked === true) {
      $(".un-planned-marker").css("display", "flex");
    } else {
      $(".un-planned-marker").css("display", "none");
    }
  });
});
