import ListStorage from "./shared/ListSessionStorage.js";

function ListForm(persist) {
  const formSelector = "#list-form";
  let listForm = document.querySelector(formSelector);
  if (listForm == null || listForm.tagName.toLowerCase() !== "form")
    throw new Error("could not find list form element");
  listForm.addEventListener("reset", handleCancel);

  if (location.search) {
    let urlParams = new URLSearchParams(location.search);
    let selectedItem = persist.getOneById(urlParams.get("id"));
    if (selectedItem.title) {
      let itemTitleInput = document.querySelector(
        `${formSelector} input[name]`
      );
      if (
        itemTitleInput == null ||
        itemTitleInput.tagName.toLowerCase() !== "input"
      )
        throw new Error("could not find title input element");
      itemTitleInput.value = selectedItem.title;
    }
    listForm.addEventListener(
      "submit",
      handelEditSubmit(selectedItem.createdOn)
    );
    addDeleteButton(selectedItem.createdOn);
  } else {
    listForm.addEventListener("submit", handelAddSubmit);
  }

  function handelEditSubmit(id) {
    return (event) => {
      event.preventDefault();
      let listForm = document.querySelector(formSelector);
      if (listForm == null || listForm.tagName.toLowerCase() !== "form")
        throw new Error("could not find list form element");
      let formData = new FormData(listForm);
      if (formData.get("title") && formData.get("title").length > 0) {
        persist.updateOne(id, { title: formData.get("title") });
        location.replace("/public/index.html");
        return;
      }
      console.error("title must have length greater than 0");
    };
  }

  function handelAddSubmit(event) {
    event.preventDefault();
    let listForm = document.querySelector(formSelector);
    if (listForm == null || listForm.tagName.toLowerCase() !== "form")
      throw new Error("could not find list form element");
    let formData = new FormData(listForm);
    if (formData.get("title") && formData.get("title").length > 0) {
      persist.addOne({ title: formData.get("title") });
      location.replace("/public/index.html");
      return;
    }
    console.error("title must have length greater than 0");
  }

  function addDeleteButton(id) {
    let newButton = document.createElement("button");
    newButton.innerText = "Delete";
    let listForm = document.querySelector(formSelector);
    if (listForm == null || listForm.tagName.toLowerCase() !== "form")
      throw new Error("could not find list form element");
    listForm.appendChild(newButton);
    newButton.addEventListener("click", (event) => {
      event.preventDefault();
      persist.deleteOne(id);
      location.replace("/public/index.html");
    });
  }

  function handleCancel(event) {
    event.preventDefault();
    location.replace("/public/index.html");
  }
}

ListForm(ListStorage);

export default {};
