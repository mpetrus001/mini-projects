<template>
  <form @submit.prevent="FormHandler">
    <input
      type="text"
      name="incomeDescription"
      id="incomeDescription"
      placeholder="Description..."
      v-model="formData.description"
    />
    <input
      type="number"
      step="0.01"
      name="incomeValue"
      id="incomeValue"
      placeholder="Value..."
      v-model="formData.value"
    />
    <input
      type="date"
      name="incomeDate"
      id="incomeDate"
      placeholder="Date..."
      v-model="formData.date"
    />
    <input type="submit" value="submit" />
  </form>
</template>

<script>
import { reactive } from "vue";
export default {
  setup(props, { emit }) {
    const formData = reactive({
      description: null,
      value: null,
      date: null,
    });

    function FormHandler() {
      // formData.date = "2021-01-04"
      const d = formData.date.split("-");
      // d = ["2021", "01", "04"]
      // subtract one from month becuase it's zero-indexed
      const newD = new Date(d[0], d[1] - 1, d[2]);

      emit("add-income", {
        description: formData.description,
        value: parseFloat(formData.value),
        date: newD.getTime(),
      });

      formData.description = null;
      formData.value = null;
      formData.date = null;
    }

    return {
      FormHandler,
      formData,
    };
  },
};
</script>

<style scoped>
form {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
form input {
  color: #888;
  border: none;
  outline: none;
  font-size: 20px;
}
form input::placeholder {
  color: #aaa;
}
form input:not([type="submit"]) {
  display: block;
  background: #fff;
  border: none;
  outline: none;
  padding: 5px 15px;
}
form input[type="submit"] {
  display: block;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-weight: 500;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  padding: 5px 15px;
  background-color: #1abc9c;
  cursor: pointer;
}
form input:first-of-type {
  border-radius: 8px 0px 0px 8px;
}
form input:last-of-type {
  border-radius: 0px 8px 8px 0px;
}
</style>
