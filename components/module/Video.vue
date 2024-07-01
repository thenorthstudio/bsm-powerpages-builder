<script lang="ts" setup>
import type { VideoModule } from '#imports';


const prop = defineProps<{
    instance: VideoModule
}>();
const hasTitle = computed(() => !isEmpty(prop.instance.props.title.value));
const hasText = computed(() => !isEmpty(prop.instance.props.text.value));

const videoId = computed(() =>
{
    const regex = /.*youtube\.com\/watch\?v=(\w*)(\&.*)?/gi;
    return prop.instance.props.url.value.replace(regex, '$1');
})
</script>


<template>
    <section class="c-video">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="hasTitle">
                {{ instance.props.title.value }}
            </h2>
            <div class="body | rich-text" v-if="hasText"
                v-html="instance.props.text.value"
            ></div>

            <button class="video-opener" :data-vid="videoId">
                <BuilderImage />
                <div class="play-icon">
                    <svg width="42" height="50" viewBox="0 0 42 50"
                        fill="none" xmlns="http://www.w3.org/2000/svg"
                        >
                        <path d="M1 2.48334L40 25L1 47.5167L1 2.48334Z"
                            stroke="white" stroke-width="2"
                        />
                    </svg>
                </div>
            </button>
            <div class="foot-text | t-sm" v-if="!isEmpty(instance.props.foot.value)">
                {{ instance.props.foot.value }}
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


<style lang="scss" src="/public/builder/scss/video.scss" />
