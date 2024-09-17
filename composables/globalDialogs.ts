import type { Module, SubModule } from "@/utils/moduleTypes";


export const useGlobalDialogs = () =>
  {
  const newModule = useState('new-module-dialog', () => false);
  const configureModule = useState('configure-module-dialog', () =>
  {
    interface configureModuleProps
    {
      isVisible: boolean,
      module?: Module,
      open(module: Module): void,
      close(): void,
      sub: {
        isVisible: boolean,
        module?: SubModule,
      },
      openSubmodule(submodule: SubModule): void,
      closeSubmodule(): void
    };
    return <configureModuleProps>{
      isVisible: false,
      module: undefined,
      open(module: Module)
      {
        configureModule.value.closeSubmodule();
        configureModule.value.isVisible = true;
        if (configureModule.value.module) {
          configureModule.value.module.toggleHover(false);
        }
        configureModule.value.module = module;
        module.toggleHover(true);
      },
      close()
      {
        configureModule.value.isVisible = false;
        if (configureModule.value.module) {
          configureModule.value.module.toggleHover(false);
        }
        configureModule.value.module = undefined;
        configureModule.value.closeSubmodule();
      },
      sub: {
        isVisible: false,
        module: undefined,
      },
      openSubmodule(submodule: SubModule)
      {
        configureModule.value.sub.isVisible = true;
        configureModule.value.sub.module = submodule;
      },
      closeSubmodule()
      {
        configureModule.value.sub.isVisible = false;  
        configureModule.value.sub.module = undefined;
      }
    }
  });
  watchEffect(() =>
  {
    if (!configureModule.value.isVisible)
      configureModule.value.close();
  });
  const pageExporter = useState('exporter-dialog', () => false);
  
  
  return { newModule, configureModule, pageExporter }
}
