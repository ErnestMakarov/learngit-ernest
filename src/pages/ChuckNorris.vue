<script setup>
import { ref } from 'vue';
import axios from 'axios';
let joke = ref('');
let res = await axios.get('https://api.chucknorris.io/jokes/random');
joke.value = res.data.value;
</script>
<template>
<div class="content">
    <h1>{{ joke }}</h1>
</div>
</template>