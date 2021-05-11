const $noteTitle = $('.note-title');
const $noteText = $('.note-textarea');
const $saveNoteBtn = $('.save-note');
const $newNoteBtn = $('.new-note');
const $noteList = $('.list-container .list-group');

// keep track of the notes in textarea
let activeNote = {};

//getting all notes from db
const getNotes = function() {
  return $.ajax({
    url: '/api/notes',
    method: 'GET',
  });
};

//save note to db
const saveNote = function(note) {
  return $.ajax({
    url: '/api/notes',
    data: note,
    method: 'POST',
  });
};

//delete a note from db
const deleteNote = function(id) {
  return $.ajax({
    url: `api/notes/${id}`,
    method: 'DELETE',
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr('readonly', true);
    $noteText.attr('readonly', true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr('readonly', false);
    $noteText.attr('readonly', false);
    $noteTitle.val('');
    $noteText.val('');
  }
};

// Get note data from user inputs, save to the db and update view
const handleNoteSave = function() {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete note that was clicked
const handleNoteDelete = function(event) {
  // prevents the click from being called when the button inside of it is clicked
  event.stopPropagation();

  const note = $(this)
    .parent('.list-group-item')
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Set activeNote and display it
const handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

// Set activeNote to and empty object so user can enter new note
const handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// If title or text is empty, hide the save button
// If not show it
const handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Shows list of note titles
const renderNoteList = function(notes) {
  $noteList.empty();

  const noteListItems = [];

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];

    const $li = $("<li class='list-group-item'>").data(note);
    const $span = $('<span>').text(note.title);
    const $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Retrieves notes from the db and displays them in sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on('click', handleNoteSave);
$noteList.on('click', '.list-group-item', handleNoteView);
$newNoteBtn.on('click', handleNewNoteView);
$noteList.on('click', '.delete-note', handleNoteDelete);
$noteTitle.on('keyup', handleRenderSaveBtn);
$noteText.on('keyup', handleRenderSaveBtn);

//Renders the initial list of notes
getAndRenderNotes();