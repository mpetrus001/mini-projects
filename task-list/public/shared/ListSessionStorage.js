function ListSessionStorage(STORAGE_KEY) {
  let rawList = sessionStorage.getItem(STORAGE_KEY);
  // initialize with an empty array if list is not found
  if (rawList == null) {
    console.info("could not find list in session storage");
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  function getAll() {
    let rawList = sessionStorage.getItem(STORAGE_KEY);
    if (rawList == null) {
      console.error("could not find list in session storage");
      return [];
    }
    let parsedList = JSON.parse(rawList);
    if (Array.isArray(parsedList)) return parsedList;
    console.error("string retrieved from storage did not parse to array");
    return [];
  }

  function addOne(props) {
    let newItem = {
      createdOn: new Date(),
      ...props,
    };
    let rawList = sessionStorage.getItem(STORAGE_KEY);
    if (rawList == null) {
      console.error("could not find list in session storage");
      return sessionStorage.setItem(STORAGE_KEY, JSON.stringify([newItem]));
    }
    let parsedList = JSON.parse(rawList);
    if (Array.isArray(parsedList))
      return sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...parsedList, newItem])
      );
    console.error("string retrieved from persist did not parse to array");
  }

  return {
    getAll,
    addOne,
  };
}

export default ListSessionStorage("_development_list_app_");
