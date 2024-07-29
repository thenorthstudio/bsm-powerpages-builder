<script lang="ts" setup>
import type { CardsGenericasModule } from '#imports';


const prop = defineProps<{
    m: CardsGenericasModule
}>();
const hasTitle = computed(() => !isEmpty(prop.m.props.title.value));
const hasText = computed(() => !isEmpty(prop.m.props.text.value));
const contentType = computed(() => prop.m.props.contentType.getValue().value);
const transCards = computed(() =>
{
    type Card = {
        tag: 'a' | 'div',
        link: string,
        media: {
            type: 'none' | 'image' | 'video',
            videoUrl?: string,
        },
        title: {
            class: string,
            value: string,
        },
        subtitle: {
            class: string,
            value: string,
        },
        text: {
            class: string,
            value: string,
        },
        bottomText: {
            tag: string,
            class: string,
            value: string,
        },
    }
    const isPeople = contentType.value == 'people';
    const textClass = {
        title: 't-lg',
        subtitle: isPeople ? 't-xs' : 't-md',
        text: 't-xs',
        bottomText: isPeople ? 't-xxs' : 't-xxxs',
    }
    return prop.m.props.cards.value.map((c) =>
    {
        const hasVideo = c.props.mediaType.getValue().value == 'video';
        const videoUrl = hasVideo ? getYoutubeId(c.props.videoUrl.value) : undefined;
        const hasLink = !isEmpty(c.props.url.value);
        return <Card>{
            tag: hasLink ? 'a' : 'div',
            link: c.props.url.value,
            media: {
                type: c.props.mediaType.getValue().value,
                videoUrl: videoUrl,
            },
            title: {
                class: textClass.title,
                value: c.props.title.value,
            },
            subtitle: {
                class: textClass.subtitle,
                value: c.props.subtitle.value,
            },
            text: {
                class: textClass.text,
                value: c.props.text.value,
            },
            bottomText: {
                tag: hasLink && isPeople ? 'a' : 'div',
                class: textClass.bottomText,
                value: c.props.bottomText.value,
            },
        }
    });
});
const sectionClass = computed(() =>
{
    type Classes = ('has-1-item' | 'is-2-cols' | 'has-2-items' | 'has-swiper');
    const list: Classes[] = [];

    const amount = prop.m.props.cards.value.length;
    if (amount == 1) list.push('has-1-item');
    else if (amount == 2) list.push('has-2-items');
    else list.push('has-swiper');
    if (amount < 3) 
    {
        if (hasTitle.value || hasText.value)
            list.push('is-2-cols');
    }
    return list;
});
</script>


<template>
    <section class="c-cards-genericas" :class="sectionClass">
        <div class="inner | boxed">
            <div class="L">
                <h2 class="t-title" v-if="hasTitle">
                    {{ m.props.title.value }}
                </h2>
                <div class="body | rich-text" v-if="hasText"
                    v-html="m.props.text.value"
                ></div>
            </div>
            <div class="R">
                <div class="swiper">
                    <SwiperArrows v-if="sectionClass.includes('has-swiper')" />
                    <div class="cards-grid | swiper-wrapper">
                        <div class="card-block | swiper-slide" :key="i"
                            v-for="(c, i) in transCards"
                            :class="`is-${contentType}`"
                            >
                            <div class="inner">
                                <div class="top">
                                    <div class="image" v-if="c.media.type != 'none'">
                                        <button v-if="c.media.type == 'video'"
                                            :data-vid="c.media.videoUrl"
                                            class="video-opener" 
                                            >
                                            <BuilderImage />
                                            <div class="play-icon">
                                                <svg class="svg" width="42" height="50" viewBox="0 0 42 50"
                                                    fill="none" xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                    <path d="M1 2.48334L40 25L1 47.5167L1 2.48334Z"
                                                        stroke="white" stroke-width="2"
                                                    />
                                                </svg>
                                            </div>
                                        </button>
                                        <component v-else-if="c.media.type == 'image'"
                                            :is="c.tag" class="image-div"
                                            :href="c.link"
                                            >
                                            <BuilderImage />
                                        </component>
                                    </div>
                                    <component :is="c.tag" class="info-wrap" :href="c.link">
                                        <h3 v-if="!isEmpty(c.title.value)"
                                            :class="`title | ${c.title.class}`"
                                            >
                                            {{ c.title.value }}
                                        </h3>
                                        <div v-if="!isEmpty(c.subtitle.value)"
                                            :class="`subtitle | ${c.subtitle.class}`"
                                            v-html="c.subtitle.value"
                                        ></div>
                                        <div v-if="!isEmpty(c.text.value)"
                                            :class="`text | ${c.text.class}`"
                                            v-html="c.text.value"
                                        ></div>
                                    </component>
                                </div>
                                <div v-if="!isEmpty(c.bottomText.value)"
                                    :class="`bottom | ${c.bottomText.class}`"
                                    >
                                    <component :is="c.bottomText.tag" class="inner" :href="c.link">
                                        {{ c.bottomText.value }}
                                        <div v-if="c.bottomText.tag == 'a'" class="arrow">
                                            <svg class="svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.6 3L15 7.5L10.6 12" stroke="#C8102E"/>
                                                <line x1="1" y1="7.5" x2="14.5111" y2="7.5" stroke="#C8102E"/>
                                            </svg>
                                        </div>
                                    </component>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="video-modal">
            <div class="background"></div>
            <div class="inner">
                <div class="iframe-wrap"></div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/cards-genericas.scss" />
