<script lang="ts" setup>
import type { DetalleDeProgramaModule } from '#imports';


const prop = defineProps<{
  m: DetalleDeProgramaModule
}>();
</script>


<template>
  <section class="c-detalle-de-programa" :class="`is-${m.props.style.getOption().value}`">
    <div class="inner | boxed">
      <div class="swiper">
        <div class="swiper-wrapper">

          <div class="swiper-slide" v-for="(d, i) in m.props.details.value" :key="i">
            <div class="inner">
              <BuilderImage />
              <div class="title | t-md">
                {{ d.props.title.value }}
              </div>
              <div class="text | t-body">
                {{ d.props.text.value }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>


<style lang="scss" src="/public/builder/scss/cards-de-programa.scss" />
