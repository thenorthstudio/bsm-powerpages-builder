<script lang="ts" setup>
import type { CardsDeProgramaModule } from '#imports';


const prop = defineProps<{
    instance: CardsDeProgramaModule
}>();
const hasTitle = computed(() => !isEmpty(prop.instance.props.title.value));
const hasText = computed(() => !isEmpty(prop.instance.props.text.value));
const classList = computed(() =>
{
    type Classes = ('has-1-item' | 'is-2-cols' | 'has-2-items' | 'has-swiper');
    const list: Classes[] = [];
    
    const amount = prop.instance.props.programs.value.length;
    if (amount == 1)
    {
        list.push('has-1-item');
        if (hasTitle.value || hasText.value)
            list.push('is-2-cols');
    }
    else if (amount == 2) list.push('has-2-items');
    else list.push('has-swiper');

    return list;
})
</script>


<template>
    <section class="c-cards-de-programa" :class="classList">
        <div class="inner | boxed">
            <div class="L">
                <h2 class="t-title" v-if="hasTitle">
                    {{ instance.props.title.value }}
                </h2>
                <div class="body | rich-text" v-if="hasText"
                    v-html="instance.props.text.value"
                ></div>
            </div>
            <div class="R">
                <div class="swiper">
                    <SwiperArrows v-if="classList.includes('has-swiper')" />
                    <div class="program-grid | swiper-wrapper">
                        <div class="program-block | swiper-slide" :key="i"
                            v-for="(p, i) in instance.props.programs.value"
                            >
                            <div class="inner">
                                <div class="top">
                                    <BuilderImage />
                                    <h3 v-if="!isEmpty(p.props.title.value)">
                                        {{ p.props.title.value }}
                                    </h3>
                                    <div class="body | t-sm | rich-text-simple"
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
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/cards-de-programa.scss" />
