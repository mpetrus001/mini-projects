<template>
  <div class="income-list">
    <IncomeItem
      v-for="data in state.sortedIncome"
      :key="data.id"
      :income="data"
      @delete="HandleDelete"
    />
  </div>
</template>

<script>
import IncomeItem from "./IncomeItem";
export default {
  props: {
    state: Object,
  },

  setup(props, { emit }) {
    function HandleDelete(data) {
      emit("remove-income", data);
    }

    return {
      IncomeItem,
      HandleDelete,
    };
  },
};
</script>

<style scoped>
.income-list {
  margin-top: 15px;
  padding: 10px;
}
</style>
