<script lang="ts" setup>
import type { CardsConIconografiaModule } from '#imports';


const prop = defineProps<{
    instance: CardsConIconografiaModule
}>();
</script>


<template>
    <section class="c-lista-con-iconografia">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(instance.props.title.value)">
                {{ instance.props.title.value }}
            </h2>
            <div class="body"
                v-if="!isEmpty(instance.props.text.value)"
                v-html="instance.props.text.value"
            ></div>
            <div class="card-grid">
                <div class="card-block"
                    :class="`is-${c.props.width.getValue().value}-cols`"
                    v-for="(c, i) in instance.props.cards.value" :key="i"
                    >
                    <div class="head">
                        <BuilderImage />
                        <h3 class="title" v-if="!isEmpty(c.props.title.value)">
                            {{ c.props.title.value }}
                        </h3>
                    </div>
                    <div class="body" v-if="!isEmpty(c.props.text.value)"
                        v-html="c.props.text.value"
                    ></div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/lista-con-iconografia.scss" />
