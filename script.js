const saveButton = document.querySelector("#btnSave");
const deleteButton = document.querySelector("#btnDelete");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const notesContainer = document.querySelector("#notes-container");

function clearForm() {
  titleInput.value = "";
  descriptionInput.value = "";
  deleteButton.classList.add("hidden");
  
}

function populateForm(id) {
  getNoteById(id);
}

function addNote(title, description) {
  const body = {
    title: title,
    description: description,
    isVisible: true,
  };
  fetch("http://localhost:5190/api/notes", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((response) => {
      clearForm();
      getNotes();
    });
}
function deleteNote(id) {
  fetch(`http://localhost:5190/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => {
    console.log(response);
    clearForm();
    getNotes();
  });
}

function updateNote(id, title, description) {
  const body = {
    title: title,
    description: description,
    isVisible: true,
  };
  fetch(`http://localhost:5190/api/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((response) => {
      clearForm();
      getNotes();
    });
}

function displayNoteInForm(note) {
  titleInput.value = note.title;
  descriptionInput.value = note.description;
  deleteButton.classList.remove("hidden");
  deleteButton.setAttribute("data-id", note.id);
  saveButton.setAttribute("data-id", note.id);
}

function getNoteById(id) {
  fetch(`http://localhost:5190/api/notes/${id}`)
    .then((data) => data.json())
    .then((response) => displayNoteInForm(response));
}

function getNotes() {
  fetch("http://localhost:5190/api/notes")
    .then((data) => data.json())
    .then((response) => displayNotes(response));
}

function displayNotes(notes) {
  let allNotes = "";

  notes.forEach((note) => {
    const noteElement = `
        <div class="note" data-id="${note.id}">
        <h3>${note.title} </h3>
        <p>${note.description} </p>
        </div>
        `;
    allNotes += noteElement;
  });
  notesContainer.innerHTML = allNotes;

  // add event listeners
  document.querySelectorAll(".note").forEach((note) => {
    note.addEventListener("click", function () {
      populateForm(note.dataset.id);
    });
  });
}

getNotes();

saveButton.addEventListener("click", function () {
  const id = saveButton.dataset.id;
  if (id) {
    updateNote(id, titleInput.value, descriptionInput.value);
  } else {
    addNote(titleInput.value, descriptionInput.value);
  }
});

deleteButton.addEventListener("click", function () {
  const id = deleteButton.dataset.id;
  deleteNote(id);
});

