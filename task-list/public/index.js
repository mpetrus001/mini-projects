import ListStorage from "./shared/ListSessionStorage.js";

function ListView(persist) {
  const displayProps = ["title", "createdOn"];
  const listSelector = "#list-view";

  render();

  function render() {
    let listUl = document.querySelector(listSelector);
    if (listUl == null || listUl.tagName.toLowerCase() !== "ul")
      throw new Error("could not find list view element");
    // clear the current list
    while (listUl.firstChild) {
      listUl.lastChild.remove();
    }
    let currentList = persist.getAll();
    if (currentList.length < 1) {
      let newLi = document.createElement("li");
      let newDiv = document.createElement("div");
      newDiv.innerText = "Add some books!";
      newLi.appendChild(newDiv);
      listUl.appendChild(newLi);
      return;
    }
    for (let item of currentList) {
      let newLi = document.createElement("li");
      for (let prop of displayProps) {
        let newDiv = document.createElement("div");
        newDiv.innerText = item.hasOwnProperty(prop) ? item[prop] : "";
        newLi.appendChild(newDiv);
      }
      listUl.appendChild(newLi);
    }
  }
}

ListView(ListStorage);

export default {};
