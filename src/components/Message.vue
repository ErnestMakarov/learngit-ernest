<script setup>
let props = defineProps({
    title: String,
    color: {
        type: String,
        validator(value, props) {
            return [
                'dark',
                'primary',
                'link',
                'info',
                'warning',
                'danger',
            ].includes(value);
        }
    },
    large: Boolean,
    medium: Boolean,
    small: Boolean,
});

let classes = [];
if(props.color) {
    classes.push('is-' + props.color);
}
let size = props.large ? 'large' : props.medium ? 'medium' : props.small ? 'small' : '';
if(size) {
    classes.push('is-' + size);
}
</script>
<template>
    <article class="message" :class="classes">
        <div v-if="title" class="message-header">
            <p>{{ title }}</p>
            <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
            <slot></slot>
        </div>
    </article>
</template>