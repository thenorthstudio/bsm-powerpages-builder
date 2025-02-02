<script lang="ts" setup>
import type { ThankYouModule } from '#imports';


const prop = defineProps<{
  m: ThankYouModule
}>();
</script>


<template>
  <section class="c-thank-you">
    <div class="top">
      <div class="svg">
        <svg class="svg" width="129" height="94" viewBox="0 0 129 94" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.75 1.25H103.25V73.75H0.75V1.25Z" stroke="#1CC286" stroke-width="1.5"/>
          <path d="M1 1.5L52.2727 43.5L103 1.5" stroke="#1CC286" stroke-width="1.5"/>
          <rect x="76.75" y="41.25" width="51.5" height="51.5" fill="white" stroke="#1CC286" stroke-width="1.5"/>
          <path d="M94 66.5L100.519 74.8333L113.556 56.5" stroke="#1CC286" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="message">
        <h1 v-if="!isEmpty(m.props.title.value)" class="title | t-subtitle">
          {{ m.props.title.value }}
        </h1>
        <p v-if="!isEmpty(m.props.text.value)"
        class="rich-text-simple"
        v-html="m.props.text.value"
        />
      </div>
    </div>
    <div class="bottom">
      <div class="flex-space" />
      <div class="link-wrap">
        <div class="link-block" v-for="(b, i) in m.props.links.value" :key="i">
          <div class="L">
            <BuilderImage />
          </div>
          <div class="R">
            <div class="title" v-if="!isEmpty(b.props.title.value)">
              {{ b.props.title.value }}
            </div>
            <div class="cta | t-xxs" v-if="!isEmpty(b.props.cta.value)">
              {{ b.props.cta.value }}
              <div class="arrow">
                <svg class="svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5996 3L14.9996 7.5L10.5996 12" stroke="#C8102E"/>
                  <line x1="1" y1="7.5" x2="14.5111" y2="7.5" stroke="#C8102E"/>
                </svg>
              </div>
            </div>
          </div>
          <a v-if="!isEmpty(b.props.url.value)"
          :href="b.props.url.value" target="_blank"
          />
        </div>
      </div>
    </div>
  </section>
</template>


<style lang="scss" src="/public/builder/scss/thank-you.scss" />
