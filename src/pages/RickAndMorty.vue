<script setup>
import axios from 'axios';
import { ref } from 'vue';
 
import CharacterCard from '../components/CharacterCard.vue';
import SearchBar from '../components/SearchBar.vue';
 
let characters = ref([]);
 
let info = ref({
    count: 0,
    pages: 0,
    next: null,
    prev: null,
});
 
let loading = ref(false);
let errorMessage = ref('');
let currentQuery = ref('');
 
let controller = null;
 
await fetchCharacters();
 
async function fetchCharacters(
    url = 'https://rickandmortyapi.com/api/character'
) {
    if (controller) {
        controller.abort();
    }
 
    controller = new AbortController();
 
    loading.value = true;
    errorMessage.value = '';
 
    try {
        const res = await axios.get(url, {
            signal: controller.signal,
        });
 
        characters.value = res.data.results;
        info.value = res.data.info;
    } catch (error) {
        if (error.name === 'CanceledError') {
            return;
        }
 
        if (error.response?.status === 404) {
            characters.value = [];
 
            info.value = {
                count: 0,
                pages: 0,
                next: null,
                prev: null,
            };
 
            errorMessage.value = 'No characters found';
            return;
        }
 
        console.error(error);
    } finally {
        loading.value = false;
    }
}
 
async function searchCharacters(query) {
    currentQuery.value = query;
 
    let url = 'https://rickandmortyapi.com/api/character';
 
    if (query.trim()) {
        url += `?name=${query}`;
    }
 
    await fetchCharacters(url);
}
 
async function next() {
    if (!info.value.next) return;
 
    await fetchCharacters(info.value.next);
}
 
async function prev() {
    if (!info.value.prev) return;
 
    await fetchCharacters(info.value.prev);
}
 
</script>
 
<template>
    <SearchBar @search="searchCharacters" />
 
    <div v-if="loading" class="mb-4">
        Loading...
    </div>
 
    <div v-if="errorMessage" class="notification is-warning">
        {{ errorMessage }}
    </div>
 
    <div class="is-flex is-justify-content-space-between mb-4">
        <button
            class="button is-primary"
            :disabled="!info.prev"
            @click="prev"
        >
            Prev
        </button>
 
        <button
            class="button is-primary"
            :disabled="!info.next"
            @click="next"
        >
            Next
        </button>
    </div>
 
    <div class="columns is-multiline">
        <div
            class="column is-3"
            v-for="character in characters"
            :key="character.id"
        >
            <CharacterCard :character="character" />
        </div>
    </div>
</template>