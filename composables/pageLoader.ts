import { Module } from "@/utils/moduleTypes";


export const usePageLoader = () =>
{
    const page = useCurrentPage();
    
    const importFromObject = (obj: any) =>
    {
        const loadedModules = obj as Module[];
        const finalModules: Module[] = [];

        for (let i = 0; i < loadedModules.length; i++)
        {
            const newModule = cloneModule(loadedModules[i], false);
            finalModules.push(newModule);
        }
        page.modules.value = finalModules;
    }

    const exportAsObject = () =>
    {
        // For now simply export module array,
        // subtype factories must be created on-load
        return page.modules.value;
    }

    return { importFromObject, exportAsObject }
}
