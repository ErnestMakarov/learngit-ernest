<script setup>
import { computed, ref } from 'vue';
import ItemList from '../components/ItemList.vue';
let i = 1;

let items = ref([
    {id: i++, text: '1', isDone: false},
    {id: i++, text: '2', isDone: true},
    {id: i++, text: '3', isDone: false},
    {id: i++, text: '4', isDone: true},
]);
let newItem = ref('');

let doneItems = computed(() => items.value.filter(item => item.isDone));
let toDoItems = computed(() => items.value.filter(item => !item.isDone));

function add(){
    if(newItem.value.trim() !== '') {
        items.value.push({id: i++, text: newItem.value.trim(), isDone: false});
    }
    newItem.value = '';
}
</script>

<template>
    <div class="container">
        <div class="field has-addons mt-2">
            <div class="control is-expanded">
                <input v-model="newItem" class="input" type="text" @keypress.enter="add">
            </div>
            <div class="control">
                <button class="button is-info" @click="add">
                    Add Item
                </button>
            </div>
        </div>
        <div class="content">
            <ItemList :items="items" title="All"></ItemList>
            <ItemList :items="doneItems" title="Done "></ItemList>
            <ItemList :items="toDoItems" title="Todo"></ItemList>
        </div>
    </div>
</template>

<style></style>