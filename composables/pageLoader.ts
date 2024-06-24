import type { Module } from "@/utils/moduleTypes";
import type { ModulePropArray } from '#imports';


export const usePageLoader = () =>
{
    const page = useCurrentPage();
    
    const importFromObject = (obj: any) =>
    {
        const loadedModules = obj as Module[];
        const finalModules: Module[] = [];

        for (let i = 0; i < loadedModules.length; i++)
        {
            const baseModule = loadedModules[i];
            const newModule = moduleFactory[baseModule.type]();

            newModule.id = baseModule.id;
            newModule.topMaring = baseModule.topMaring;
            for (const propName in newModule.props)
            {
                const baseProp = baseModule.props[propName];
                const prop = newModule.props[propName];

                prop.id = baseProp.id;
                if (prop.type == 'array')
                {
                    const basePropArray = baseProp as ModulePropArray;
                    const propArray = prop as ModulePropArray;

                    propArray.value = [];
                    for (let i = 0; i < basePropArray.value.length; i++)
                    {
                        propArray.addNew();
                        const baseSubmodule = basePropArray.value[i];
                        const submodule = propArray.value[i];
                        
                        submodule.id = baseSubmodule.id;
                        for (const subPropName in submodule.props)
                        {
                            const baseSubProp = baseSubmodule.props[subPropName];
                            const subProp = submodule.props[subPropName];

                            subProp.id = baseSubProp.id;
                            subProp.value = baseSubProp.value;
                        }
                    }
                }
                else prop.value = baseProp.value;
            }
            finalModules.push(newModule);
        }
        page.modules.value = finalModules;
        page.dirtyJS.value = true;
    }

    const exportAsObject = () =>
    {
        // For now simply export module array,
        // subtype factories must be created on-load
        return page.modules.value;
    }

    return { importFromObject, exportAsObject }
}
