const registrationForm = document.querySelector("#registrationForm");
const newPassword2Element = registrationForm.elements.namedItem("newPassword2");

newPassword2Element.addEventListener("input", () => {
  const registrationData = new FormData(registrationForm);
  const newPassword1 = registrationData.get("newPassword1");
  const newPassword2 = registrationData.get("newPassword2");
  if (newPassword1 !== newPassword2) {
    newPassword2Element.setCustomValidity("Passwords do not match");
  } else {
    newPassword2Element.setCustomValidity("");
  }
});

registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const registrationData = new FormData(registrationForm);
  const registrationObj = Object.fromEntries(registrationData.entries());
  alert(JSON.stringify(registrationObj, null, 2));
  registrationForm.reset();
});
