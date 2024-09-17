<script lang="ts" setup>
const page = useCurrentPage();
const module = computed(() => dialog.value.module);
const currentSubmodule = computed(() => dialog.value.sub.module);
const { configureModule: dialog } = useGlobalDialogs();

type MaringOptionType = {
  label: string,
  value: ModuleMarginType
}
const marginOptions: Array<MaringOptionType> = [
  { label: 'Normal', value: 'normal-margin' },
  { label: 'Pequeño', value: 'small-margin' }
];
const anchorInput = ref(module.value?.anchor);

const hasOptions = computed(() =>
{
  const invalidTypes = [
    'menu',
    'header',
    'detalle-de-programa',
    'footer',
  ];
  return !invalidTypes.includes(module.value!.type);
});


const isValidSlug = (slug: string) =>
{
  const slugRegex = /^[a-z0-9\-]+$/;
  return slugRegex.test(slug);
};
watch(anchorInput, (newVal, oldVal) =>
{
  if (newVal)
  {
    if (isValidSlug(newVal)) module.value!.anchor = newVal;
    else
    {
      // Revert to the old value if the new one is invalid
      anchorInput.value = oldVal;
    }
  }
  else module.value!.anchor = undefined;
},
  { flush: 'post' }
);
watch([module, currentSubmodule], () =>
{
  if (module.value)
  {
    module.value.onAnyChange();
    anchorInput.value = module.value.anchor;
  }
  if (currentSubmodule.value) currentSubmodule.value.onAnyChange();
},
  { deep: true }
);


const checkTriggerJS = (lib: ExternalLib) =>
{
  if (!module.value) return;
  const libs = exLibRequirements[module.value.type];
  if (libs.includes(lib)) page.dirtyJS.value = true;
}
const goBackFromSubmodule = () => {
  dialog.value.closeSubmodule();
}
</script>


<template>
    <Dialog id="configure-module-dialog"  position="topleft"
    v-model:visible="dialog.isVisible" :keep-in-view-port="false"
    pt:header="border-bottom-1 border-200 | cursor-move"
    pt:content="p-0" @after-hide="goBackFromSubmodule"
    >
      <template #header>
        <div class="flex align-items-center gap-2">
          <template v-if="module && !currentSubmodule">
            <div class="pi pi-cog" />
            <div>{{ module.getTitle() }}</div>
          </template>

          <template v-if="module && currentSubmodule">
            <Button icon="pi pi-arrow-left" class="mr-2"
            size="small" severity="secondary"
            @click="goBackFromSubmodule"
            />
            <div>{{ currentSubmodule.getTitle() }}</div>
          </template>

          <div class="flex align-items-center | text-300"
          v-if="module && module.additionalInfo"
          >
            <div class="ml-2 mr-3"> | </div>
            <div class="pi pi-info-circle cursor-auto"
            v-tooltip.right="module.additionalInfo"
            />
          </div>
        </div>
      </template>

      <div class="inner" v-if="module && !currentSubmodule">
        <div class=" p-3 mb-2 | border-100 border-bottom-1" v-if="hasOptions">
          <!-- Top margin -->
          <div class="flex align-items-center justify-content-end | mb-2">
            <label for="margin-option" class="text-xs text-500 | mr-3">
              Margen superior
            </label>
            <Dropdown id="margin-option" v-model="module.topMaring" checkmark
            :options="marginOptions" option-label="label" option-value="value"
            pt:input="text-xs" pt:list="text-xs"
            />
            <div class="text-xs text-300 | ml-3 | flex align-items-start">
              <div class="pi pi-info-circle"
              v-tooltip.right="`Permite enganchar este módulo al anterior`"
              />
            </div>
          </div>
          <!-- Anchor text -->
          <div class="flex align-items-center">
            <label for="anchor-text" class="text-xs text-500 | flex-none mr-1">
              Ancla &nbsp;&nbsp;&nbsp;&nbsp; #
            </label>
            <InputText id="anchor-text"
            class="flex-1" size="small"
            v-model="anchorInput"
            />
            <div class="text-xs text-300 | ml-3 | flex align-items-start">
              <div class="pi pi-info-circle"
              v-tooltip.right="[
                'Permite crear links directos a este módulo.',
                'Debe ser único en la página.\n\n',
                'No puede contener espacios ni carácteres especiales;',
                'solo guiones (-) y minúsculas.',
              ].join(' ')"
              />
            </div>
          </div>
        </div>
        <div class="field-grid | p-3">
            <DialogPropRenderer :options="p"
                v-for="(p, i) in module.props" :key="i"
                @set-dirty="module!.dirty = true"
                @check-js="checkTriggerJS"
            />
        </div>
      </div>

      <div class="inner field-grid | p-3 pt-5" v-if="currentSubmodule">
        <DialogPropRenderer :options="p" :key="i"
        v-for="(p, i) in currentSubmodule.props"
        @set-dirty="module!.dirty = true"
        />
      </div>

    </Dialog>
</template>


<style lang="scss">
#configure-module-dialog
{
    .p-dialog-content
    {
        position: relative;
        overflow-x: hidden;
    }

    .inner
    {
        width: 80vw;
        max-width: 450px;
        // max-height: 80vh;
    }
    .field-grid
    {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
}
</style>
