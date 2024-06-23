<script lang="ts" setup>
import type { HeaderModule } from '#imports';


const prop = defineProps<{
    instance: HeaderModule
}>();
</script>


<template>
    <header class="c-header">
        <div class="background">
            <BuilderImage />
            <div class="overlay"></div>
        </div>
        <div class="inner">
            <h1 class="t-title" v-if="!isEmpty(instance.props.title.value)">
                {{ instance.props.title.value }}
            </h1>
            <div class="body"
                v-if="!isEmpty(instance.props.text.value)"
                v-html="instance.props.text.value"
            ></div>
        </div>
    </header>
</template>


<style lang="scss" src="/public/builder/scss/header.scss" />
