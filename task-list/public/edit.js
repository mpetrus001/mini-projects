import ListStorage from "./shared/ListSessionStorage.js";

function ListForm(persist) {
  const formSelector = "#list-form";
  let listForm = document.querySelector(formSelector);
  if (listForm == null || listForm.tagName.toLowerCase() !== "form")
    throw new Error("could not find list form element");
  listForm.addEventListener("submit", handelSubmit);
  listForm.addEventListener("reset", handleCancel);

  function handelSubmit(event) {
    event.preventDefault();
    let listForm = document.querySelector(formSelector);
    if (listForm == null || listForm.tagName.toLowerCase() !== "form")
      throw new Error("could not find list form element");
    let formData = new FormData(listForm);
    console.log(formData);
    if (formData.get("title") && formData.get("title").length > 0) {
      persist.addOne({ title: formData.get("title") });
      location.replace("/public/index.html");
    }
  }

  function handleCancel(event) {
    event.preventDefault();
    location.replace("/public/index.html");
  }
}

ListForm(ListStorage);

export default {};
