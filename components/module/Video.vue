<script lang="ts" setup>
import type { VideoModule } from '#imports';


const prop = defineProps<{
    m: VideoModule
}>();
const hasTitle = computed(() => !isEmpty(prop.m.props.title.value));
const hasText = computed(() => !isEmpty(prop.m.props.text.value));

const videoId = computed(() => getYoutubeId(prop.m.props.url.value));
</script>


<template>
    <section class="c-video">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="hasTitle">
                {{ m.props.title.value }}
            </h2>
            <div class="body | rich-text" v-if="hasText"
                v-html="m.props.text.value"
            />

            <button class="video-opener" :data-vid="videoId">
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
            <div class="foot-text | t-sm" v-if="!isEmpty(m.props.foot.value)">
                {{ m.props.foot.value }}
            </div>
        </div>

        <div class="video-modal">
            <div class="background"/>
            <div class="inner">
                <div class="iframe-wrap"/>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/video.scss" />
