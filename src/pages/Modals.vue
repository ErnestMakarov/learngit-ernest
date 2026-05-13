<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';
import ImgModal from '../components/ImgModal.vue';

let modal1Active = ref(false);
let modal2Active = ref(false);
</script>

<template>
    <div class="container">
        <button class="button is-primary" @click="modal1Active = true">CLICK</button>
        <button class="button is-info" @click="modal2Active = true">Do not open</button>
        <Modal :active="modal1Active" @close="modal1Active = false">
            <div class="box">Hello world, im Ernest</div>
        </Modal>
        <ImgModal :active="modal2Active" @close="modal2Active = false" url="https://www.justmedia.ru/upload/analitika/68/cc/68ccf5e868c39288163641_1400_1200.jpg"></ImgModal>
    </div>
</template>

<style>
.is-primary{
    margin-right: 10px;
}

.is-info    {
    background-color: red;
    color: #FFF;
}
</style>