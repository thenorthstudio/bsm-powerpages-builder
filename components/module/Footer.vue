<script lang="ts" setup>
import type { FooterModule } from '#imports';


const prop = defineProps<{
  m: FooterModule
}>();

const lang = computed(() => prop.m.props.lang.getOption().value);

type TTranslation = {
  [key in ('es' | 'ca' | 'en')]:
  Record<string, { label: string, url: string }>
};
const translations: TTranslation = {
  es: {
    'legal-notice': {
      label: 'Aviso legal',
      url: 'https://www.bsm.upf.edu/es/aviso-legal',
    },
    'cookies-policy': {
      label: 'Política de cookies',
      url: 'https://www.bsm.upf.edu/es/politica-de-cookies',
    },
  },
  ca: {
    'legal-notice': {
      label: 'Avís legal',
      url: 'https://www.bsm.upf.edu/ca/avis-legal',
    },
    'cookies-policy': {
      label: 'Política de cookies',
      url: 'https://www.bsm.upf.edu/ca/politica-cookies',
    },
  },
  en: {
    'legal-notice': {
      label: 'Legal notice',
      url: 'https://www.bsm.upf.edu/en/legal-warning',
    },
    'cookies-policy': {
      label: 'Cookies policy',
      url: 'https://www.bsm.upf.edu/en/cookies-policy',
    },
  },
}


const t = (key: string) => translations[lang.value][key];
</script>


<template>
  <footer class="c-footer">
    <div class="inner | boxed t-xs">

      <div class="top">
        <div class="L">
          <IconLogo class="logo" />
          <IconPartners class="partners" />
        </div>
        <div class="R">
          <div class="social-wrap">
            <a href="https://www.linkedin.com/school/upf-barcelona-school-of-management/"
            rel="noopener noreferrer" target="_blank"
            >
              <IconLinkedin />
            </a>
            <a href="https://x.com/bsm_upf"
            rel="noopener noreferrer" target="_blank"
            >
              <IconTwitter />
            </a>
            <a href="https://www.youtube.com/user/BSMUPF"
            rel="noopener noreferrer" target="_blank"
            >
              <IconYoutube />
            </a>
            <a href="https://www.facebook.com/BarcelonaSchoolOfManagement"
            rel="noopener noreferrer" target="_blank"
            >
              <IconFacebook />
            </a>
            <a href="https://www.instagram.com/bsm_upf/"
            rel="noopener noreferrer" target="_blank"
            >
              <IconInstagram />
            </a>
          </div>
          <div class="info">
            Carrer de Balmes, 132 
            08008, Barcelona
            (+34) 935 421 800
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="legal">
          ©2001 Fundació institut d’Educació Contínua
        </div>
        <a :href="t('legal-notice').url" target="_blank">
          {{ t('legal-notice').label }}
        </a>
        <a :href="t('cookies-policy').url" target="_blank">
          {{ t('cookies-policy').label }}
        </a>
        <div class="flex-space" />
        <div class="lang">
          <LangSelector :default="lang" />
        </div>
      </div>

    </div>
  </footer>
</template>


<style lang="scss" src="/public/builder/scss/footer.scss" />
