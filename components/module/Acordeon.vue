<script lang="ts" setup>
import type { AcordeonModule, AcordeonSubModule } from '#imports';


const prop = defineProps<{
  m: AcordeonModule
}>();
const hasTitle = computed(() => !isEmpty(prop.m.props.title.value));
const hasText = computed(() => !isEmpty(prop.m.props.text.value));

type ViewGroup = {
  name: string,
  foldables: AcordeonSubModule[]
}
const viewGroups = computed(() =>
{
  const groups: ViewGroup[] = [];
  prop.m.props.foldables.value.forEach(f =>
  {
    let groupName = f.props.group.value;
    if (isEmpty(groupName))
    {
      const found2 = prop.m.props.foldables.value.find(
        f2 => !isEmpty(f2.props.group.value)
      );
      groupName = found2 ? found2.props.group.value : 'group';
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
        {{ m.props.title.value }}
      </h2>
      <div class="body | rich-text" v-if="hasText"
      v-html="m.props.text.value"
      />
      
      <div class="tab-wrap | swiper | t-xxs" v-if="hasTabs">
        <div class="swiper-wrapper">
          <div class="tab | swiper-slide" :class="{ 'is-current': i == 0 }" :data-index="i"
          v-for="(g, i) in viewGroups" :key="i"
          >
            <button>{{ g.name }}</button>
          </div>
        </div>
        <div class="mask-wrap">
          <div class="mask L" />
          <div class="mask R" />
        </div>
      </div>
      <div class="viewport-wrap">
        <div class="viewport" :class="{ 'is-current': i == 0 }" :data-index="i"
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
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V14" stroke="currentColor" stroke-width="1.5" class="line V" />
                    <path d="M2 8H14" stroke="currentColor" stroke-width="1.5" class="line H" />
                  </svg>
                </div>
              </div>
            </button>
            <div class="body | t-sm | rich-text-simple">
              <div class="inner" v-html="f.props.text.value" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<style lang="scss" src="/public/builder/scss/acordeon.scss" />
