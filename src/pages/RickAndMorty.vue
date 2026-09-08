<script setup>
    import axios from 'axios';
    import { ref, computed } from 'vue';

    import CharacterCard from '../components/CharacterCard.vue';
    import SearchBar from '../components/SearchBar.vue';

    const characters = ref([]);

    const info = ref({
        count: 0,
        pages: 0,
        next: null,
        prev: null,
    });

    const loading = ref(false);
    const errorMessage = ref('');
    const currentQuery = ref('');
    const currentPage = ref(1);

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

            const urlObj = new URL(url);
            currentPage.value = Number(
                urlObj.searchParams.get('page') || 1
            );
        } catch (error) {
            if (
                axios.isCancel(error) ||
                error.name === 'CanceledError' ||
                error.code === 'ERR_CANCELED'
            ) {
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

                currentPage.value = 1;
                errorMessage.value = 'No characters found';

                return;
            }

            console.error(error);

            errorMessage.value =
                error.response?.data?.error ||
                error.message ||
                'Something went wrong';
        } finally {
            loading.value = false;
        }
    }

    async function searchCharacters(query) {
        currentQuery.value = query;
        currentPage.value = 1;

        let url = 'https://rickandmortyapi.com/api/character';

        if (query.trim()) {
            url += `?name=${encodeURIComponent(query)}`;
        }

        await fetchCharacters(url);
    }

    async function goToPage(page) {
        if (
            page < 1 ||
            page > info.value.pages ||
            page === currentPage.value
        ) {
            return;
        }

        let url = `https://rickandmortyapi.com/api/character?page=${page}`;

        if (currentQuery.value.trim()) {
            url += `&name=${encodeURIComponent(
                currentQuery.value
            )}`;
        }

        await fetchCharacters(url);
    }

    const pages = computed(() => {
        const total = info.value.pages;
        const current = currentPage.value;

        if (!total) return [];

        if (total <= 7) {
            return Array.from(
                { length: total },
                (_, i) => i + 1
            );
        }

        const result = [1];

        let start = Math.max(current - 1, 2);
        let end = Math.min(current + 1, total - 1);

        if (current <= 3) {
            start = 2;
            end = 5;
        }

        if (current >= total - 2) {
            start = total - 4;
            end = total - 1;
        }

        if (start > 2) {
            result.push('...');
        }

        for (let i = start; i <= end; i++) {
            result.push(i);
        }

        if (end < total - 1) {
            result.push('...');
        }

        result.push(total);

        return result;
    });
</script>

<template>
    <SearchBar @search="searchCharacters" />

    <div
        v-if="loading"
        class="mb-4"
    >
        Loading...
    </div>

    <div
        v-if="errorMessage"
        class="notification is-warning"
    >
        {{ errorMessage }}
    </div>

    <div
        v-if="info.pages > 1"
        class="is-flex is-flex-wrap-wrap is-align-items-center mb-5"
        style="gap: 6px"
    >
        <button
            class="button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
        >
            Prev
        </button>

        <button
            v-for="page in pages"
            :key="page"
            class="button"
            :class="{
                'is-primary':
                    page === currentPage
            }"
            @click="goToPage(page)"
        >
            {{ page }}
        </button>

        <button
            class="button"
            :disabled="currentPage === info.pages"
            @click="goToPage(currentPage + 1)"
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
            <CharacterCard
                :character="character"
            />
        </div>
    </div>
</template>
