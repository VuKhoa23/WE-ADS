function infoAlert(name, address) {
  return `
  <div class="alert alert-warning alert-dismissible fade show w-75 m-auto mb-3" role="alert">
    ${name}
    <hr>
    ${address}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;
}

function popUp(address) {
  return `
  <div style="width: 15vw">
    <h6 class="m-0 p-0">
      Co dong chinh tri
    </h6>
    <p>Dat cong, hanh lang an toan</p>
    <p>${address}</p>
    <h6 style="font-style: italic;">Da Quy Hoach</h6>
  </div>
  `;
}
