import { type Module } from "@/utils/module";


export const useCurrentPage = () =>
{
    const name = useState('page-name', () => 'pagina nueva');
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
    const reorder = useState('page-reordered', () => false);
    const isUpdating = useState('page-is-updating', () => false);
    

    return {
        name,
        dimensions,
        scrollY,

        modules,
        hasModules,
        findModule,
        reorder,
        isUpdating
    };
};
