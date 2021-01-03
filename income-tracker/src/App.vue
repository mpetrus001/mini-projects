<template>
  <Header :totalIncome="state.totalIncome" />
  <Form :state="state" @add-income="AddIncome" />
  <IncomeList :state="state" @remove-income="RemoveIncome" />
</template>

<script>
import { reactive, computed } from "vue";
import Header from "./components/Header";
import Form from "./components/Form";
import IncomeList from "./components/IncomeList";
export default {
  setup() {
    const state = reactive({
      income: [],
      totalIncome: computed(() => {
        if (state.income.length > 0)
          return state.income.reduce((acc, entry) => acc + entry.value, 0.0);
        return 0;
      }),
      sortedIncome: computed(() =>
        [...state.income].sort((a, b) => b.date - a.date)
      ),
    });

    function AddIncome(data) {
      state.income = [...state.income, { id: Date.now(), ...data }];
    }
    function RemoveIncome(data) {
      state.income = state.income.filter((income) => income.id !== data.id);
    }

    return {
      state,
      Header,
      Form,
      AddIncome,
      IncomeList,
      RemoveIncome,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira Sans", sans-serif;
}
body {
  background: #eee;
}
</style>
