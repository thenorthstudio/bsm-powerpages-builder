<script lang="ts" setup>
defineProps<{
    alt?: string
}>();
</script>


<template>
    <div class="c-image">
        <img src="" :alt="alt" />
        <div class="builder-only">
            img
        </div>
    </div>
</template>
