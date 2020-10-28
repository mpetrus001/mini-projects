const targetUl = document.querySelector("#task-list");

async function updateTaskList(targetUl) {
  const data = await fetch("http://localhost:5000/tasks").then((res) =>
    res.json()
  );
  const dataRows = data.map((task) => {
    let li = document.createElement("li");
    for (let prop in task) {
      if (task.hasOwnProperty(prop)) {
        let span = document.createElement("span");
        span.innerText = task[prop];
        li.appendChild(span);
      }
    }
    return li;
  });
  dataRows.forEach((row) => targetUl.appendChild(row));
}

updateTaskList(targetUl);
