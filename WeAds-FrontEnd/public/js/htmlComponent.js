function infoAlert(name, address, index, id, isReported, reportId) {
  if(!isReported){
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
        <a class="link-secondary w-50" target="_blank" href="/weads/report/${id}"><button class="btn btn-danger" style="font-size: 12px">Báo cáo sai phạm</button></a>
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
      <div class="d-flex justify-content-between mt-3">
        <button class="btn" onclick="showModal(${index})">
          <i class="fa-solid fa-circle-info"></i>
        </button>
        <a class="link-secondary w-50" target="_blank" href="/weads/view-report/${reportId}"><button class="btn btn-primary" style="font-size: 12px">Xem lại báo cáo</button></a>
      </div>
    </div>
  `;
  }
  
}

function warnAlert(name, address, ward, district, coordinates) {
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
          <a class="link-secondary w-50" target="_blank" href="/weads/report?ward=${ward}&district=${district}&lng=${coordinates.lng}&lat=${coordinates.lat}"><button class="btn btn-danger" style="font-size: 12px">Báo cáo sai phạm</button></a>
        </div>
      </div>
    </div>
  `;
}

function unpersistedAlert(name, address, id){
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
        <a class="link-secondary w-50" target="_blank" href="/weads/view-report/${id}"><button class="btn btn-primary" style="font-size: 12px">Xem lại báo cáo</button></a>
      </div>
    </div>
  `;
}

function popUp(adFormat ,address, type, planned) {
  return `
  <div style="width: 200px">
    <h6 style="font-weight:bold" class="m-0 p-0">
      ${adFormat}
    </h6>
    <div style="margin-bottom:2px;">${type}</div>
    <div style="margin:0;">${address}</div>
    ${
      planned === 1
        ? '<h6 style="font-style: italic;font-weight:bold;margin-bottom:0;">Đã quy hoạch</h6'
        : '<h6 style="font-style: italic;font-weight:bold;margin-bottom:0;">Chưa quy hoạch</h6'
    }
    >
  </div>
  `;
}
