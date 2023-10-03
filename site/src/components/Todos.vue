<template>
  <div class="container">
    <div class="input">
      <form @submit.prevent="addTodo">
        <input v-model="input" placeholder="add your todo" />
        <button type="submit">add</button>
      </form>
    </div>
    <div class="list">
      <p v-for="item in list" :key="item.Id">{{ item.TaskName }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ITodo } from '../types/todo';

const input = ref('');
const list = ref<ITodo[]>([]);

const fetchTodos = () => {
  fetch('/api/todos', {
    method: 'get',
  })
    .then((resp) => resp.json())
    .then((resp) => {
      list.value = resp.filter((task: any) => task.TaskName !== '');
    });
};

onMounted(() => {
  fetchTodos();
});

const addTodo = () => {
  if (!input.value) {
    alert('请输入之后再提交');
    return;
  }
  fetch('/api/todo', {
    method: 'post',
    body: JSON.stringify({
      name: input.value,
      status: 0,
    }),
  }).then(() => {
    fetchTodos();
    input.value = '';
    // if (resp.status === 200) {
    // }
  });
};
</script>

<style lang="scss">
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .input {
    margin-bottom: 8px;
    button {
      margin-left: 8px;
    }
  }
  .list {
    & > p {
      width: 400px;
      border-radius: 8px;
      border: 1px solid #ccc;
      margin: 4px 0;
      padding: 0.6em 1.2em;
      font-size: 1em;
    }
  }
}
</style>
