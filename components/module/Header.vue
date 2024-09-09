<script lang="ts" setup>
import type { HeaderModule } from '#imports';


const prop = defineProps<{
  m: HeaderModule
}>();

const hasForm = computed(() => prop.m.props.hasForm.getValue().value == 'true');
</script>


<template>
  <header class="c-header" :class="{ 'has-form': hasForm }">
    <div class="background">
      <BuilderImage />
      <div class="overlay" />
    </div>
    <div class="inner">
      <h1 class="t-title" v-if="!isEmpty(m.props.title.value)">
        {{ m.props.title.value }}
      </h1>
      <div class="body | rich-text-simple"
      v-if="!isEmpty(m.props.text.value)"
      v-html="m.props.text.value"
      />
    </div>
    <div class="form-wrap" v-if="hasForm">
      <div class="head">
        <div class="icon">
          <svg width="27" height="19" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.75 1.33984H25.25V17.6602H1.75V1.33984Z" stroke="#E3E4E5" stroke-width="1.5"/>
            <path d="M1.24072 0.830566L13.5659 10.9448L25.76 0.830566" stroke="#E3E4E5" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="text | t-xxs">
          {{ m.props.formClaim.value }}
        </div>
      </div>
      <div class="body">
        <BuilderForm />
      </div>
    </div>
  </header>
</template>


<style lang="scss" src="/public/builder/scss/header.scss" />
