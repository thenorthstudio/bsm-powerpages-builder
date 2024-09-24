<script lang="ts" setup>
const props = defineProps<{ floaterPosition: 'top' | 'bottom' }>();
const page = useCurrentPage();

const currentLang = computed(() => AllLocales.find(l => l.value == page.lang.value));
const getURL = (lang: Lang) => page.langUrls.value[lang];
</script>


<template>
  <div class="c-lang-selector">
    <IconLang />
    <button> {{ currentLang?.label }}</button>
    <IconDown />

    <div class="floater" :class="`from-${floaterPosition}`">
      <a v-for="lang in AllLocales" :href="getURL(lang.value)" :key="lang.value">
        {{ lang.label }}
      </a>
    </div>
  </div>
</template>
