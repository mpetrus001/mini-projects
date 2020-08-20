import { nanoid } from "nanoid"

function BookSessionStorage() {
  const STORAGE_KEY = "_my_book_list_session_";
  let rawList = sessionStorage.getItem(STORAGE_KEY);
  // initialize with an empty array if list is not found
  if (rawList == null) {
    console.info("could not find book list in session storage");
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  function getAll() {
    let rawList = sessionStorage.getItem(STORAGE_KEY);
    if (rawList == null) {
      console.error("could not find book list in session storage");
      return [];
    }
    let parsedList = JSON.parse(rawList);
    if (Array.isArray(parsedList)) return parsedList as Book[];
    console.error("string retrieved from persist did not parse to array");
    return [];
  }

  function addOne(bookProps: Book) {
    let newBook = {
      id: nanoid(),
      title: bookProps.title == undefined ? "New Book" : bookProps.title,
      author: bookProps.author == undefined ? "Unknown" : bookProps.author
    }
    let rawList = sessionStorage.getItem(STORAGE_KEY);
    if (rawList == null) {
      console.error("could not find book list in session storage");
      return sessionStorage.setItem(STORAGE_KEY, JSON.stringify([newBook]));
    }
    let parsedList = JSON.parse(rawList);
    if (Array.isArray(parsedList))
      return sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...parsedList, newBook])
      );
    console.error("string retrieved from persist did not parse to array");
  }

  return {
    getAll,
    addOne,
  };
}

export default BookSessionStorage();

export type Book = {
  [prop: string]: string;
  id: string
  title: string
  author: string
};
