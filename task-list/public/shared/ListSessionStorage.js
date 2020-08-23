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

  function getOneById(id) {
    let rawList = sessionStorage.getItem(STORAGE_KEY);
    if (rawList == null) {
      console.error("could not find list in session storage");
      return {};
    }
    let parsedList = JSON.parse(rawList);
    if (Array.isArray(parsedList)) {
      let selectedItem = parsedList.find((item) => item.createdOn == id);
      if (selectedItem) return selectedItem;
      console.error("matching item could not be found in list");
      return {};
    }
    console.error("string retrieved from storage did not parse to array");
    return {};
  }

  function addOne(props) {
    let newItem = {
      createdOn: Date.now(),
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

  function updateOne(id, props) {
    let rawList = sessionStorage.getItem(STORAGE_KEY);
    if (rawList == null) {
      return console.error("could not find list in session storage");
    }
    let parsedList = JSON.parse(rawList);
    if (Array.isArray(parsedList)) {
      if (parsedList.find((item) => item.createdOn == id)) {
        let newList = parsedList.map((item) => {
          if (item.createdOn == id) return Object.assign(item, props);
          return item;
        });
        return sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      }
      return console.error("matchiing item could not be found in list");
    }
    return console.error(
      "string retrieved from storage did not parse to array"
    );
  }

  function deleteOne(id) {
    let rawList = sessionStorage.getItem(STORAGE_KEY);
    if (rawList == null) {
      return console.error("could not find list in session storage");
    }
    let parsedList = JSON.parse(rawList);
    if (Array.isArray(parsedList)) {
      if (parsedList.find((item) => item.createdOn == id)) {
        let newList = parsedList.filter((item) => item.createdOn !== id);
        return sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      }
      return console.error("matchiing item could not be found in list");
    }
    return console.error(
      "string retrieved from storage did not parse to array"
    );
  }

  return {
    getAll,
    getOneById,
    addOne,
    updateOne,
    deleteOne,
  };
}

export default ListSessionStorage("_development_list_app_");
