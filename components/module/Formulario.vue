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
        <div class="body | rich-text-simple" v-html="m.props.text.value" />
        <BuilderForm />
      </div>
    </div>

    <component is="script" type="text/javascript"
    v-if="m.props.filterProgramas.value.length"
    >
      const filter = window.programasFilter ||
        ["{{ m.props.filterProgramas.value.map(p => p.programaId).join('","') }}"];
      window.programasFilter = filter;
    </component>

  </section>
</template>


<style lang="scss" src="/public/builder/scss/formulario.scss" />
