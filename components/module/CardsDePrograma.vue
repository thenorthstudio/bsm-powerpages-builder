<script lang="ts" setup>
import type { CardsDeProgramaModule } from '#imports';


const prop = defineProps<{
    instance: CardsDeProgramaModule
}>();
</script>


<template>
    <section class="c-cards-de-programa">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(instance.props.title.value)">
                {{ instance.props.title.value }}
            </h2>
            <div class="body | rich-text"
                v-if="!isEmpty(instance.props.text.value)"
                v-html="instance.props.text.value"
            ></div>
            <div class="c-swiper-arrows">
                <button class="arrow-prev"></button>
                <button class="arrow-next"></button>
            </div>
            <div class="swiper">
                <div class="program-grid" data-swiper-class="swiper-wrapper"
                    :class="`has-${instance.props.programs.value.length}-items`"
                    >
                    <div class="program-block" data-swiper-class="swiper-slide"
                        v-for="(p, i) in instance.props.programs.value" :key="i"
                        >
                        <div class="inner">
                            <div class="top">
                                <BuilderImage />
                                <h3 v-if="!isEmpty(p.props.title.value)">
                                    {{ p.props.title.value }}
                                </h3>
                                <div class="body | t-sm rich-text-smaller"
                                    v-if="!isEmpty(p.props.description.value)"
                                    v-html="p.props.description.value"
                                ></div>
                                <div class="detail-grid">
                                    <div class="detail-block | t-xs" :key="j"
                                        v-for="(d, j) in p.props.details.value"
                                        >
                                        <div class="L">
                                            <BuilderImage />
                                        </div>
                                        <div class="R">
                                            <h4 class="title" v-if="!isEmpty(d.title)">
                                                {{ d.title }}
                                            </h4>
                                            <p class="text" v-if="!isEmpty(d.text)">
                                                {{ d.text }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom">
                                <a class="cta | t-xxs"
                                    :href="p.props.linkUrl.value" target="_blank"
                                    v-if="!isEmpty(p.props.linkUrl.value)"
                                    >
                                    {{ p.props.linkText.value }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/cards-de-programa.scss" />
