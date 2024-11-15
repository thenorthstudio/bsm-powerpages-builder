<script lang="ts" setup>
import type { MenuModule } from '#imports';


const prop = defineProps<{
  m: MenuModule
}>();
const page = useCurrentPage();

const hasFormulario = computed(() => page.modules.value.some(m => m.type == 'formulario'));
const buttonText = computed(() =>
{
  const text = {
    es: 'SOLICITAR INFORMACIÓN   →',
    ca: 'SOL·LICITAR INFORMACIÓ   →',
    en: 'REQUEST INFORMATION   →'
  }
  return text[page.lang.value];
});


const updateLangURLs = () =>
{
  page.langUrls.value.es = prop.m.props.esUrl.value;
  page.langUrls.value.ca = prop.m.props.caUrl.value;
  page.langUrls.value.en = prop.m.props.enUrl.value;
  page.modules.value[page.modules.value.length - 1].dirty = true;
}

watch(() => prop.m.props, updateLangURLs, { deep: true });
onMounted(updateLangURLs);
</script>


<template>
  <nav class="c-menu">
    <div class="inner">
      <a class="logo-block" :href="page.langUrls.value[page.lang.value]" >
        <IconLogo />
      </a>

      <div class="flex-space" />

      <div class="menu-wrap">
        <div class="submenu">
          <div class="links" v-if="m.props.pageLinks.value.length">
            <a v-for="link in m.props.pageLinks.value" :href="link.url">
              {{ link.label }}
            </a> 
          </div>
          <div class="lang-wrap">
            <LangSelector floater-position="top" />
          </div>
          <button class="menu-close">
            <IconCross />
          </button>
        </div>
      </div>

      <div class="form-button-div" v-if="hasFormulario">
        <div class="inner">
          <button class="form-button">
            {{ buttonText }}
          </button>
        </div>
      </div>

      <button class="menu-button" :class="{ 'no-links': !m.props.pageLinks.value.length }">
        <IconBurger />
      </button>

    </div>
  </nav>
</template>


<style lang="scss" src="/public/builder/scss/menu.scss" />
