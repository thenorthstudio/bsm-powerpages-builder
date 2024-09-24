import { Module } from "@/utils/moduleTypes";


export const usePageLoader = () =>
{
  const page = useCurrentPage();
  
  const importFromObject = (obj: PageExport) =>
  {
    const finalModules: Module[] = [];
    for (let i = 0; i < obj.modules.length; i++)
    {
      const newModule = cloneModule(obj.modules[i], false);
      finalModules.push(newModule);
    }
    page.modules.value = finalModules;
    page.lang.value = obj.language;
  }
  
  const exportAsObject = (): PageExport =>
  {
    return {
      language: page.lang.value,
      modules: page.modules.value
    };
  }
  
  return { importFromObject, exportAsObject }
}
