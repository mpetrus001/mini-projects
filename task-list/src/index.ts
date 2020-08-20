import type { Book } from "./BookSessionStorage";
import BookSessionStorage from "./BookSessionStorage";

function BookListView(bookPersist: IPersistHandler) {
  const displayProps = ["title", "author"];
  const bookListSelector = "#book-list";

  render();

  function render() {
    let bookListUl = document.querySelector(bookListSelector);
    if (bookListUl == null || bookListUl.tagName.toLowerCase() !== "ul")
      throw new Error("could not find book list element");
    // clear the current list
    while (bookListUl.lastChild) {
      bookListUl.lastChild.remove();
    }
    let bookList = bookPersist.getAll();
    if (bookList.length < 1) {
      let newBookLi = document.createElement("li");
      let newDataDiv = document.createElement("div");
      newDataDiv.innerText = "Add some books!";
      newBookLi.appendChild(newDataDiv);
      bookListUl.appendChild(newBookLi);
      return;
    }
    for (let book of bookList) {
      let newBookLi = document.createElement("li");
      for (let prop of displayProps) {
        let newDataDiv = document.createElement("div");
        newDataDiv.innerText = book.hasOwnProperty(prop) ? book[prop] : "";
        newBookLi.appendChild(newDataDiv);
      }
      bookListUl.appendChild(newBookLi);
    }
  }
}

BookListView(BookSessionStorage);

export default {};

interface IPersistHandler {
  getAll: () => Book[];
}
