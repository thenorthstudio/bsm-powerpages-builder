<script lang="ts" setup>
import type { FormularioModule } from '#imports';


const prop = defineProps<{
  m: FormularioModule
}>();
</script>


<template>
  <section class="c-formulario">
    <div class="icon">
      <IconTextBubble />
    </div>
    <div class="boxed">
      <div class="inner">
        <div class="icon">
          <IconTextBubble />
        </div>
        <h2 class="t-title" v-if="!isEmpty(m.props.title.value)">
          {{ m.props.title.value }}
        </h2>
        <div class="body">
          {{ m.props.text.value }}
        </div>
        <BuilderForm />
      </div>
    </div>
  </section>
</template>


<style lang="scss" src="/public/builder/scss/formulario.scss" />
