function infoAlert(name, address, index, placeId, role) {
  if(role === "Department"){
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
      </div>
    </div>
  `;
  }
  else{
    return `
    <div class="alert alert-success alert-dismissible fade show m-auto mb-2 mt-1 row" role="alert" style="font-size: 13px; width: 90%">
      <i class="fa-solid fa-check col-3"></i>
      <div class="col-9">
        Thông tin địa điểm
        <hr>
        <strong>${name}</strong> <br>
        Địa chỉ: ${address}.
      </div>
      <button type="button" class="btn-close m-2" data-bs-dismiss="alert" aria-label="Close"></button>
      <br>
      <div class="d-flex justify-content-between mt-3">
        <button class="btn" onclick="showModal(${index})">
          <i class="fa-solid fa-circle-info"></i>
        </button>

        <a href="/weads/place/editAdPlacementForm/${placeId}" class="link-secondary w-50" target="_blank"><button class="btn btn-primary" style="font-size: 12px">Yêu cầu chỉnh sửa</button></a>
      </div>
    </div>
  `;
  }
  
}

function warnAlert(name, address, role, coordinates, ward, district) {
  if(role === "Department"){
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
      <div class="d-flex justify-content-end mt-3">

        <a href="/weads/place/addAdPlacementForm?lat=${coordinates.lat}&lng=${coordinates.lng}&ward=${ward}&district=${district}" class="link-secondary w-50" ><button class="btn btn-primary" style="font-size: 12px">Tạo điểm đặt mới</button></a>
      </div>
    </div>
  `;
  }else{
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
      <div class="d-flex justify-content-end mt-3">
          <a class="link-secondary w-50" target="_blank" href="/weads/license?ward=${ward}&district=${district}&lng=${coordinates.lng}&lat=${coordinates.lat}"><button class="btn btn-primary" style="font-size: 12px">Yêu cầu cấp phép</button></a>
      </div>
      </div>
    </div>
  `;
  }
  
}

function popUp(address, type, planned) {
  return `
  <div style="width: 15vw">
    <h6 class="m-0 p-0">
      Co dong chinh tri
    </h6>
    <p>${type}</p>
    <p>${address}</p>
    ${
      planned === 1
        ? '<h6 style="font-style: italic;">Đã quy hoạch</h6'
        : '<h6 style="font-style: italic;">Chưa quy hoạch</h6'
    }
    >
  </div>
  `;
}
