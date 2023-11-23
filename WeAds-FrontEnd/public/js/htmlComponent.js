function infoAlert(name, address, index) {
  return `
    <div class="alert alert-success alert-dismissible fade show m-auto mb-2 mt-1 row" role="alert" style="font-size: 13px; width: 90%">
      <i class="fa-solid fa-check col-3"></i>
      <div class="col-9">
        Thông tin địa điểm
        <hr>
        <strong>${name}</strong> <br>
        ${address}
      </div>
      <button type="button" class="btn-close m-2" data-bs-dismiss="alert" aria-label="Close"></button>
      <br>
      <div class="d-flex justify-content-between mt-3">
        <button class="btn" onclick="showModal(${index})">
          <i class="fa-solid fa-circle-info"></i>
        </button>
        <button class="w-50 btn btn-danger" style="font-size: 12px">Báo cáo sai phạm</button>
      </div>
    </div>
  `;
}

function warnAlert(name) {
  return `
  <div class="alert alert-danger alert-dismissible fade show m-auto mb-2 mt-1 row" style="width: 90%" role="alert">
    <i class="fa-solid fa-circle-info col-3"></i>
    <div class="col-9">
      <strong>Thông tin địa điểm</strong> <br>
      <hr>
      ${name} chưa được đăng kí QC
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
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
