<script lang="ts" setup>
import type { AcordeonModule, AcordeonSubModule } from '#imports';


const prop = defineProps<{
    instance: AcordeonModule
}>();
const hasTitle = computed(() => !isEmpty(prop.instance.props.title.value));
const hasText = computed(() => !isEmpty(prop.instance.props.text.value));

type ViewGroup = {
    name: string,
    foldables: AcordeonSubModule[]
}
const viewGroups = computed(() =>
{
    const groups: ViewGroup[] = [];
    prop.instance.props.foldables.value.forEach(f =>
    {
        let groupName = f.props.group.value;
        if (isEmpty(groupName))
        {
            const found2 = prop.instance.props.foldables.value.find(
                f2 => !isEmpty(f2.props.group.value)
            );
            groupName = found2? found2.props.group.value : 'group';
        }
        const found = groups.find(g => g.name == groupName);
        if (!found)
        {
            const newGroup: ViewGroup = {
                name: groupName,
                foldables: [f]
            }
            groups.push(newGroup);
        }
        else found.foldables.push(f);
    })
    return groups;
})
const hasTabs = computed(() => viewGroups.value.length > 1);
</script>


<template>
    <section class="c-acordeon" :class="{ 'has-tabs': hasTabs }">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="hasTitle">
                {{ instance.props.title.value }}
            </h2>
            <div class="body | rich-text" v-if="hasText"
                v-html="instance.props.text.value"
            ></div>
            
            <div class="tab-wrap | swiper | t-xxs" v-if="hasTabs">
                <div class="swiper-wrapper">
                    <div class="tab | swiper-slide" 
                        :class="{ 'is-current': i == 0 }" :data-index="i"
                        v-for="(g, i) in viewGroups" :key="i"
                        >
                        <button>{{ g.name }}</button>
                    </div>
                </div>
                <div class="mask-wrap">
                    <div class="mask L"></div>
                    <div class="mask R"></div>
                </div>
            </div>
            <div class="viewport-wrap">
                <div class="viewport"
                    :class="{ 'is-current': i == 0 }" :data-index="i"
                    v-for="(g, i) in viewGroups" :key="i"
                    >
                    <div class="foldable" :class="{ 'is-open': j == 0 }"
                        v-for="(f, j) in g.foldables" :key="j"
                        >
                        <button class="head">
                            <h3 class="t-md">
                                {{ f.props.title.value }}
                            </h3>
                            <div class="handle">
                                <div class="inner">
                                    <div class="line V"></div>
                                    <div class="line H"></div>
                                </div>
                            </div>
                        </button>
                        <div class="body | t-sm | rich-text-simple">
                            <div class="inner" v-html="f.props.text.value"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/acordeon.scss" />
