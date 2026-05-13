<script setup>
import { ref, watch } from 'vue';
 
const emit = defineEmits(['search']);
 
const query = ref('');
 
function onSearch() {
    emit('search', query.value);
}
 
function debounce(fn, delay) {
    let timeout;
 
    return (...args) => {
        clearTimeout(timeout);
 
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
 
const debouncedSearch = debounce(onSearch, 400);
 
watch(query, () => {
    debouncedSearch();
});
</script>
 
<template>
    <div class="mb-4">
        <input
            class="input"
            type="text"
            placeholder="Search character..."
            v-model="query"
            @keyup.enter="onSearch"
        />
    </div>
</template>