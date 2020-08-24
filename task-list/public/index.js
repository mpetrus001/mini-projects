import ListStorage from "./shared/ListSessionStorage.js";

function ListView(persist) {
  const listSelector = "#list-view";
  let listUl = document.querySelector(listSelector);
  if (listUl == null || listUl.tagName.toLowerCase() !== "ul")
    throw new Error("could not find list view element");
  listUl.addEventListener("click", handleListClick);

  render();

  function handleListClick(event) {
    event.preventDefault();
    let selectedLi = event.target.closest("li");
    let selectedItemId = selectedLi.getAttribute("id");
    if (selectedItemId.length < 1)
      return console.error("could not find item id");
    location.assign(`/public/edit.html?id=${selectedItemId}`);
  }

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
      newDiv.innerText = "Add some items!";
      newLi.appendChild(newDiv);
      listUl.appendChild(newLi);
      return;
    }
    for (let item of currentList) {
      let newLiWithPropDivs = [addTitleDiv, addCreatedOnDiv].reduce(
        (returnLi, addDiv) => addDiv(returnLi, item),
        document.createElement("li")
      );
      newLiWithPropDivs.setAttribute(
        "id",
        item.createdOn ? item.createdOn : ""
      );
      listUl.appendChild(newLiWithPropDivs);
    }

    function addTitleDiv(liElement, item) {
      let titleDiv = document.createElement("div");
      titleDiv.innerText = item.title ? item.title : "#";
      liElement.appendChild(titleDiv);
      return liElement;
    }

    function addCreatedOnDiv(liElement, item) {
      let dateDiv = document.createElement("div");
      let createdOn = item.createdOn
        ? new Date(item.createdOn)
        : { toLocaleDateString: () => "#" };
      dateDiv.innerText = createdOn.toLocaleDateString();
      liElement.appendChild(dateDiv);
      return liElement;
    }
  }
}

ListView(ListStorage);

export default {};
