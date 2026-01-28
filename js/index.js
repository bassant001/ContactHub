//LIST OF OBJECTS (CONTACTS) ISA LL NE ADDED
let contactList = [];

//FOR STAT
let manageCounts = document.getElementById("manageCounts");
let totalCountEl = document.getElementById("totalCount");
let favoritesCountEl = document.getElementById("favoritesCount");
let emergencyCountEl = document.getElementById("emergencyCount");

//CONTACT MODAL
let nameInput = document.getElementById("name");
let phoneInput = document.getElementById("phone");
let emailInput = document.getElementById("email");
let addrInput = document.getElementById("address");
let notesInput = document.getElementById("notes");
let groupSelect = document.getElementById("group");
let favCheckbox = document.getElementById("fav");
let emergencyCheckbox = document.getElementById("emergency");
let btnAdd = document.getElementById("btnAdd"); //SAVE
let btnEdit = document.getElementById("btnedit"); //edit
let btnSAVEDIT = document.getElementById("btnSAVEDIT"); //SAVE THE EDIT

// RIGHT SIDE OF HTML
let favoritesSection = document.getElementById("favoritesSection");
let emergencySection = document.getElementById("emergencySection");

//UPDATE
let editingIndex = -1;

//LOAD DATA
if (localStorage.getItem("contactContainer") !== null) {
  contactList = JSON.parse(localStorage.getItem("contactContainer"));
}

//LW FY HGA 23RD
if (contactList.length !== 0) {
  displayData();
  displayFavorites();
  displayEmergency();
  updateStats();
}

//SAVE
if (btnAdd) {
  btnAdd.addEventListener("click", function () {
    addContact();
  });
}

//ENABLE USER TO PUT NEW CONTACT
function addContact() {
  let contact = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    addr: addrInput.value.trim(),
    notes: notesInput.value.trim(),
    group: groupSelect.value,
    isfav: favCheckbox.checked,
    isemer: emergencyCheckbox.checked,
  };
  if (contact.name === "" || contact.phone === "") {
    alert("Name and phone are required");
    return;
  }
  contactList.push(contact);
  //key: contactContainer value:contactList
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displayData();
  displayFavorites();
  displayEmergency();
  clearForm();
  updateStats();
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addContactModal")
  );
  if (modal) modal.hide();
}

//DISPLAY CONTACTS OF RIGHT SIDE AFTER EVERY CHANGE AND IN THE BEGANINF LW MOMEKEN :)
function displayData() {
  let cartona = ``;

  for (let i = 0; i < contactList.length; i++) {
    let contact = contactList[i];

    let groupText = contact.group;
    let favBadge = contact.isfav
      ? `<span class="avatar-status"><i class="bi bi-star-fill"></i></span>`
      : "";
    let emergencyBadge = contact.isemer
      ? `<span class="badge badge-pill bg-danger-subtle text-danger">
                   <i class="bi bi-heart-pulse-fill me-1"></i>Emergency
               </span>`
      : "";

    cartona += `
        <div class="d-flex mb-3">
            <div class="avatar-circle">
                <span>${getInitials(contact.name)}</span>
                ${favBadge}
            </div>

            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    
                    <div>
                        <h5 class="mb-1 fw-semibold text-capitalize">${
                          contact.name
                        }</h5>
                        
                        <div class="mb-1 small text-muted">
                            <i class="bi bi-telephone-fill me-2 text-primary"></i>
                            ${contact.phone}
                        </div>

                        <div class="mb-1 small text-muted">
                            <i class="bi bi-envelope-fill me-2 text-secondary"></i>
                            ${contact.email}
                        </div>

                        <div class="mb-2 small text-muted">
                            <i class="bi bi-geo-alt-fill me-2 text-success"></i>
                            ${contact.addr}
                        </div>

                        <div class="d-flex align-items-center gap-2">
                            <span class="badge badge-pill bg-primary-subtle text-primary">
                                ${groupText}
                            </span>

                            ${emergencyBadge}
                        </div>
                    </div>

                    <div class="contact-actions text-end">
                        <div class="mb-2">
                            <button class="btn btn-light me-1" title="Call">
                                <i class="bi bi-telephone-forward"></i>
                            </button>
                            <button class="btn btn-light me-1" title="Send email">
                                <i class="bi bi-envelope"></i>
                            </button>
                        </div>

                        <div>
                            <button class="btn btn-light me-1" title="Favorite" onclick = "updatefav(${i})">
                                <i class="bi bi-star"></i>
                            </button>
                            <button class="btn btn-light me-1 text-danger" title="Emergency" onclick = "updatemr(${i})">
                                <i class="bi bi-heart-pulse"></i>
                            </button>
                            <button class="btn btn-outline-secondary me-1" title="Edit" onclick = "updatecontact(${i})" id="btnedit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-secondary" title="Delete" onclick = "deleteItem(${i})">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>`;
  }

  document.getElementById("contactsContainer").innerHTML = cartona;
}

//LMA YAKLS FADY 2L FORM RAYH 2L 3AMIL
function clearForm() {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addrInput.value = "";
  notesInput.value = "";
  groupSelect.value = "Select a group";
  favCheckbox.checked = false;
  emergencyCheckbox.checked = false;
}

//GET FIRST 2 LETTERS OF NAME
function getInitials(name) {
  if (name == null) return "??";
  let parts = name.trim().split(" ");
  let res = "";
  //lw name 1 part
  if (parts.length === 1) {
    res += parts[0].charAt(0).toUpperCase();
    return res;
  }
  //lw 2 part kd arr[0] and arr[size-1]
  res +=
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase();
  return res;
}

//LEFT SIDE: Favorites :)
function displayFavorites() {
  let cartona = ``;

  for (let i = 0; i < contactList.length; i++) {
    let contact = contactList[i];
    if (!contact.isfav) {
      continue;
    }
    cartona += `
           <div class="d-flex align-items-center">
              <div class="mini-avatar"><span>${getInitials(
                contact.name
              )}</span></div>
              <div class="flex-grow-1">
                <div class="fw-semibold small text-capitalize"> ${
                  contact.name
                }</div>
                <div class="text-muted small">${contact.phone}</div>
               </div>
               <button class="call-btn icon-link-hover" title="Call favorite"><i class="bi bi-telephone-fill"></i></button>
           </div>
                         
            
     `;
  }
  document.getElementById("favoritesSection").innerHTML = cartona;
}

//LEFT SIDE: Emergency :)
function displayEmergency() {
  let cartona = ``;
  for (let i = 0; i < contactList.length; i++) {
    let contact = contactList[i];
    if (!contact.isemer) {
      continue;
    }
    cartona += `
                 <div class="d-flex align-items-center">
              <div class="mini-avatar"><span>${getInitials(
                contact.name
              )}</span></div>
              <div class="flex-grow-1">
                <div class="fw-semibold small text-capitalize"> ${
                  contact.name
                }</div>
                <div class="text-muted small">${contact.phone}</div>
               </div>
               <button class="call-btn icon-link-hover" title="Call favorite"> <i class="bi bi-telephone-fill "></i> </button>
           </div>
     `;
  }
  document.getElementById("emergencySection").innerHTML = cartona;
}

//DISPLAY IN LIFT SIDE TOTAL OF FAV, EMER...
function updateStats() {
  let cartona = ``;
  let f = 0,
    e = 0,
    c = contactList.length;
  for (let i = 0; i < contactList.length; i++) {
    let contact = contactList[i];
    if (contact.isfav) {
      f++;
    }
    if (contact.isemer) {
      e++;
    }
  }
  cartona = `${c}`;
  document.getElementById("totalCount").innerHTML = cartona;

  cartona = `${f}`;
  document.getElementById("favoritesCount").innerHTML = cartona;

  cartona = `${e}`;
  document.getElementById("EmergencyCount").innerHTML = cartona;

  cartona = `${c}`;
  document.getElementById("manageCounts").innerHTML = cartona;
}

//del
function deleteItem(index) {
  console.log(index + " hello deleteItem :)\n");
  contactList.splice(index, 1);
  console.log(contactList);
  displayData();
  displayFavorites();
  displayEmergency();
  updateStats();
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
}

//edit
function updatecontact(index) {
  //is it working?
  console.log(index + " hello updatecontact :)\n");
  editingIndex = index;
  nameInput.value = contactList[index].name;
  phoneInput.value = contactList[index].phone;
  emailInput.value = contactList[index].email;
  addrInput.value = contactList[index].addr;
  notesInput.value = contactList[index].notes;
  groupSelect.value = contactList[index].group;
  favCheckbox.checked = contactList[index].isfav;
  emergencyCheckbox.checked = contactList[index].isemer;

  let myModal = new bootstrap.Modal(document.getElementById("addContactModal"));
  myModal.show();

  btnAdd.classList.add("d-none");
  btnSAVEDIT.classList.remove("d-none");
}


btnSAVEDIT.addEventListener("click", function () {
  let contact = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    addr: addrInput.value.trim(),
    notes: notesInput.value.trim(),
    group: groupSelect.value,
    isfav: favCheckbox.checked,
    isemer: emergencyCheckbox.checked,
  };
  if (contact.name === "" || contact.phone === "") {
    alert("Name and phone are required");
    return;
  }
  contactList.splice(editingIndex, 1, contact);
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displayData();
  displayFavorites();
  displayEmergency();
  updateStats();
  clearForm();
  btnAdd.classList.remove("d-none");
  btnSAVEDIT.classList.add("d-none");
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addContactModal")
  );
  modal.hide();
});



//search
let searchinput = document.getElementById("searchinput");
function searchdata() {
  let term = searchinput.value;
  let cartona = "";

  for (let i = 0; i < contactList.length; i++) {
    let nameMatch = contactList[i].name.toLowerCase().includes(term.toLowerCase());
    let phoneMatch = contactList[i].phone.includes(term);
    let emailMatch = contactList[i].email.toLowerCase().includes(term.toLowerCase());

    if (nameMatch || phoneMatch || emailMatch) {
      let contact = contactList[i];

      let groupText = contact.group;
      let favBadge = contact.isfav
        ? `<span class="avatar-status"><i class="bi bi-star-fill"></i></span>`
        : "";
      let emergencyBadge = contact.isemer
        ? `<span class="badge badge-pill bg-danger-subtle text-danger">
                   <i class="bi bi-heart-pulse-fill me-1"></i>Emergency
               </span>`
        : "";

      cartona += `
        <div class="d-flex mb-3">
            <div class="avatar-circle">
                <span>${getInitials(contact.name)}</span>
                ${favBadge}
            </div>

            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    
                    <div>
                        <h5 class="mb-1 fw-semibold text-capitalize">${
                          contact.name
                        }</h5>
                        
                        <div class="mb-1 small text-muted">
                            <i class="bi bi-telephone-fill me-2 text-primary"></i>
                            ${contact.phone}
                        </div>

                        <div class="mb-1 small text-muted">
                            <i class="bi bi-envelope-fill me-2 text-secondary"></i>
                            ${contact.email}
                        </div>

                        <div class="mb-2 small text-muted">
                            <i class="bi bi-geo-alt-fill me-2 text-success"></i>
                            ${contact.addr}
                        </div>

                        <div class="d-flex align-items-center gap-2">
                            <span class="badge badge-pill bg-primary-subtle text-primary">
                                ${groupText}
                            </span>

                            ${emergencyBadge}
                        </div>
                    </div>

                    <div class="contact-actions text-end">
                        <div class="mb-2">
                            <button class="btn btn-light me-1" title="Call">
                                <i class="bi bi-telephone-forward"></i>
                            </button>
                            <button class="btn btn-light me-1" title="Send email">
                                <i class="bi bi-envelope"></i>
                            </button>
                        </div>

                        <div>
                            <button class="btn btn-light me-1" title="Favorite">
                                <i class="bi bi-star"></i>
                            </button>
                            <button class="btn btn-light me-1 text-danger" title="Emergency">
                                <i class="bi bi-heart-pulse"></i>
                            </button>
                            <button class="btn btn-outline-secondary me-1" title="Edit" onclick = "updatecontact(${i})" id="btnedit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-secondary" title="Delete" onclick = "deleteItem(${i})">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>`;
    }
  }
  document.getElementById("contactsContainer").innerHTML = cartona;
}

function updatefav(index) {
  console.log(index + " hello updatefav :)\n");
  contactList[index].isfav;
   if(contactList[index].isfav)
  {
    contactList[index].isfav=0;
  }
  else
    contactList[index].isfav=1;

  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displayData();
  displayFavorites();
  displayEmergency();
  updateStats();
}


function updatemr(index) {
  console.log(index + " hello updatemr :)\n");
  if(contactList[index].isemer)
  {
    contactList[index].isemer=0;
  }
  else
    contactList[index].isemer=1;

  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displayData();
  displayFavorites();
  displayEmergency();
  updateStats();
}
