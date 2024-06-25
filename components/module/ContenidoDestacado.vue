<script lang="ts" setup>
import type { ContenidoDestacadoModule } from '#imports';


const prop = defineProps<{
    instance: ContenidoDestacadoModule
}>();
const type = computed(
    () => prop.instance.props.contentType.getValue().value
);
const hasTitle = computed(() => !isEmpty(prop.instance.props.title.value));
const hasText = computed(() => !isEmpty(prop.instance.props.text.value));
const classList = computed(() =>
{
    type Classes = ('has-1-item' | 'has-2-items' | 'has-swiper');
    const list: Classes[] = [];

    const amount = prop.instance.props.contents.value.length;
    if (type.value == 'text-content')
    {
        if (amount == 1) list.push('has-1-item');
        else if (amount == 2) list.push('has-2-items');
        else list.push('has-swiper');
    }
    else if (type.value == 'number-data' || type.value == 'testimonial')
    {
        if (amount == 1) list.push('has-1-item');
        else if (amount == 2) list.push('has-2-items');
        else list.push('has-swiper');
    }
    list.push(`is-${type.value}` as any);
    return list;
});
</script>


<template>
    <section class="c-contenido-destacado" :class="classList">
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
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" :key="i"
                            v-for="(p, i) in instance.props.contents.value"
                            >
                            <div class="inner">

                                <template v-if="type == 'text-content'">
                                    <div class="title | t-subtitle"
                                        v-if="!isEmpty(p.props.textTitle.value)"
                                        >
                                        {{ p.props.textTitle.value }}
                                    </div>
                                    <div class="text | rich-text-simple"
                                        v-html="p.props.textText.value"
                                        v-if="!isEmpty(p.props.textText.value)"
                                        >
                                    </div>
                                </template>

                                <template v-else-if="type == 'number-data'">
                                    <div class="number"
                                        v-if="!isEmpty(p.props.numberValue.value)"
                                        >
                                        {{ p.props.numberValue.value }}
                                        <div class="unit"
                                            v-if="!isEmpty(p.props.numberUnit.value)"
                                            >
                                            {{ p.props.numberUnit.value }}
                                        </div>
                                    </div>
                                    <div class="text | t-xs"
                                        v-if="!isEmpty(p.props.numberText.value)"
                                        >
                                        {{ p.props.numberText.value }}
                                    </div>
                                </template>

                                <template v-else-if="type == 'testimonial'">
                                    <div class="author">
                                        <BuilderImage />
                                        <div class="info">
                                            <div class="name"
                                                v-if="!isEmpty(p.props.testimonialName.value)"
                                                >
                                                {{ p.props.testimonialName.value }}
                                            </div>
                                            <div class="position | t-xs"
                                                v-if="!isEmpty(p.props.testimonialPosition.value)"
                                                >
                                                {{ p.props.testimonialPosition.value }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="quote"
                                        v-html="`“${p.props.testimonialText.value}”`"
                                        v-if="!isEmpty(p.props.testimonialText.value)"
                                    ></div>
                                </template>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/contenido-destacado.scss" />
