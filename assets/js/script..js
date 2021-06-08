const titleInputElem = document.getElementById('title-data');
const authorInputElem = document.getElementById('author-data');
const yearInputElem = document.getElementById('year-data');
const isCompleteInputElem = document.getElementById('isComplete-data');
const bookForm = document.getElementById('book-form');
const bookSearchForm = document.getElementById('book-search-form');
const addBookBtn = document.getElementById('add-btn');
const onreadContainer = document.getElementById('onread-container');
const completedContainer = document.getElementById('completed-container');
const searchResultContainer = document.getElementById('search-container');

const booksKey = "STORAGE_BOOKS";

let books = [];

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderBookshelf();
});

bookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  composeBook();
});

bookSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchBooks();
});

const composeBook = () => {
  let title = titleInputElem.value;
  let author = authorInputElem.value;
  let year = yearInputElem.value;
  let isComplete = isCompleteInputElem.checked;

  addBook(title, author, year, isComplete);
};

const addBook = (title, author, year, isComplete) => {
  const dialogBox = createCustomDialog('added-dialog', 'Book is successfully added ✅');
  document.body.append(dialogBox);
  const newBook = {
    id: new Date(),
    title: title,
    author: author || 'Unknown',
    year: parseInt(year) || 'Unknown',
    isComplete: isComplete
  };

  books.push(newBook);

  localStorage.setItem(booksKey, JSON.stringify(books));
  document.getElementById('added-dialog').style.display = 'block';
  refresh();
};

const loadFromStorage = () => {
  let loadedBooks = localStorage.getItem(booksKey);

  if (loadedBooks)
    books = JSON.parse(loadedBooks);
};

const renderBookshelf = () => {
  if (!books)
    return;

  console.log(books);

  const unreadBooks = books.filter((obj) => { return obj.isComplete === false });
  const completedBooks = books.filter((obj) => { return obj.isComplete === true });

  console.log(unreadBooks);

  renderBookshelfSection(onreadContainer, unreadBooks);
  renderBookshelfSection(completedContainer, completedBooks);
};

const renderBookshelfSection = (sectionId, books) => {
  for (let book in books) {
    appendBook(sectionId, books[book]);
  }
};

const appendBook = (sectionId, book) => {
  const container = document.createElement('div');
  container.classList.add('book-on-shelf')
  container.setAttribute('id', book.id);

  const textContainer = document.createElement('div');
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const title = document.createElement('h2');
  title.innerText = book.title;

  const author = document.createElement('p');
  author.innerText = `Author: ${book.author}`;
  const year = document.createElement('p');
  year.innerText = `Year: ${book.year}`;
  const status = document.createElement('p');
  status.innerText = `Status: ${book.isComplete ? 'Completed' : 'On-read'}`;

  const moveOverBtn = createButton('book-action-btn', 'Move over', moveOver);
  const removeBtn = createButton('book-action-btn', 'Remove Book', removeBook);

  textContainer.append(title, author, year, status);
  buttonContainer.append(moveOverBtn, removeBtn);
  container.append(textContainer, buttonContainer);

  sectionId.append(container);
};

const createButton = (className, buttonValue, callback) => {
  const btn = document.createElement('input');
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', buttonValue);
  btn.classList.add(className);
  btn.addEventListener('click', () => {
    const id = btn.parentNode.parentNode.id;
    callback(id);
  });
  return btn;
};

const moveOver = (id) => {
  const dialogBox = createCustomDialog('moved-dialog', 'Book is successfully moved ✅');
  document.body.append(dialogBox);

  for (let book in books) {
    if (books[book].id === id) {
      books[book].isComplete = !books[book].isComplete;
      break;
    }
  }
  localStorage.setItem(booksKey, JSON.stringify(books));
  document.getElementById('moved-dialog').style.display = 'block';
  refresh();
}

const removeBook = (id) => {
  const dialogBox = createCustomDialog('removed-dialog', 'Book is successfully removed ✅');
  document.body.append(dialogBox);

  for (let book in books) {
    if (books[book].id === id) {
      books.splice(book, 1);
      console.log(book);
      break;
    }
  }
  localStorage.setItem(booksKey, JSON.stringify(books));
  document.getElementById('removed-dialog').style.display = 'block';
  refresh();
}

const createCustomDialog = (elemId, text) => {
  const container = document.createElement('div');
  container.classList.add('custom-dialog');
  container.setAttribute('id', elemId);

  const dialogText = document.createElement('h1');
  dialogText.innerText = text;

  container.append(dialogText);
  return container;
}

const refresh = () => {
  setTimeout(() => { location.reload() }, 2000);
}

const searchBooks = () => {
  if (searchResultContainer.childNodes)
    searchResultContainer.innerHTML = '';

  const resultText = document.createElement('h2');
  resultText.innerText = 'Result'
  searchResultContainer.append(resultText);

  const title = document.getElementById('title-data-search').value;
  const resultBooks = books.filter((obj) => { return obj.title.toLowerCase().indexOf(title.toLowerCase()) >= 0 });
  renderBookshelfSection(searchResultContainer, resultBooks);
}