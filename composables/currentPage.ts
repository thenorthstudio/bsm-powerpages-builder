import type { HeaderModule } from "#imports";
import { type Module } from "@/utils/moduleTypes";


export const useCurrentPage = () =>
{
  const name = useState('page-name', () => 'pagina-nueva');
  const lang = useState<Lang>('page-lang', () => 'es');
  const langUrls = useState<LangURLs>('page-lang-urls', () => ({
    es: 'https://landinges.bsm.upf.edu/' + name.value,
    ca: 'https://landingca.bsm.upf.edu/' + name.value,
    en: 'https://landingen.bsm.upf.edu/' + name.value,
  }));

  const dimensions = useState('page-size', () =>
  ({
    viewportWidth: '100%',
    iframeWidth: '100%',
    iframeScale: 1
  }));
  const scrollY = useState('page-scroll-y', () => 0);
  
  const modules = useState<Module[]>('page-modules', () => []);
  const hasModules = () => !!modules.value.length;
  const findModule = (moduleId: number) =>
  {
    return modules.value.find(
      m => m.id == moduleId
    );
  }
  const hasForm = () =>
  {
    // const form = modules.value.find(m => m.type == 'form');
    // if (form) return true;

    const header = modules.value.find(m => m.type == 'header') as HeaderModule | undefined;
    if (header && header.props.hasForm.getOption().value == 'true') return true;

    return false;
  }

  const reorder = useState('page-reordered', () => false);
  const isUpdating = useState('page-is-updating', () => false);
  const dirtyJS = useState('page-dirty-js', () => false);
  
  
  return {
    name,
    lang,
    langUrls,

    dimensions,
    scrollY,
    
    modules,
    hasModules,
    findModule,
    hasForm,

    reorder,
    isUpdating,
    dirtyJS
  };
};
