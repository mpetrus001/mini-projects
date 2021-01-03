<template>
  <div class="income-item">
    <div class="remove-item" @click="$emit('delete', { id: income.id })">X</div>
    <div class="description">{{ income.description }}</div>
    <div class="price">{{ formattedValue }}</div>
    <div class="date">{{ formattedDate }}</div>
  </div>
</template>

<script>
export default {
  props: {
    income: Object,
  },
  setup(props) {
    const date = new Date(props.income.date);
    let day =
      `${date.getDate()}`.length < 2
        ? `0${date.getDate()}`
        : `${date.getDate()}`;
    let month =
      `${date.getMonth() + 1}`.length < 2
        ? `0${date.getMonth() + 1}`
        : `${date.getMonth() + 1}`;
    let formattedDate = `${month}/${day}/${date.getFullYear()}`;
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(props.income.value);

    return {
      formattedValue,
      formattedDate,
    };
  },
};
</script>

<style>
.income-item {
  position: relative;
  display: flex;
  padding: 15px 15px 15px 0px;
  background-color: #fff;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto 30px;
}
.remove-item {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ef2d2d;
  font-weight: 600;
  font-size: 15px;
  line-height: 1;
  text-align: center;
  margin: 0 15px;
}
.description {
  color: #666;
  flex: 1 1 100%;
  font-size: 20px;
}
.price {
  color: #666;
  min-width: 100px;
  font-size: 20px;
}
.date {
  color: #666;
  text-align: right;
  font-size: 20px;
}
</style>
