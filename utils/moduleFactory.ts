import { Module, SubModule } from "@/utils/moduleTypes";


export const moduleFactory: { [key in ModuleType]: () => Module } =
{
    'header': () => new HeaderModule(),
    'columnas-de-texto': () => new ColumnasDeTextoModule(),
    'cards-de-programa': () => new CardsDeProgramaModule(),
    'contenido-destacado': () => new ContenidoDestacadoModule(),
    'lista-con-iconografia': () => new ListaConIconografiaModule(),
    'cards-con-iconografia': () => new CardsConIconografiaModule(),
    'acordeon': () => new AcordeonModule(),
    'grid-de-imagenes': () => new GridDeImagenesModule(),
    'video': () => new VideoModule(),
    'thank-you': () => new ThankYouModule()
}


export const submoduleFactory: { [key in ModuleType]: () => SubModule } =
{
    'header': () => ({} as SubModule),
    'columnas-de-texto': () => new ColumnasDeTextoSubModule('columna'),
    'cards-de-programa': () => new CardsDeProgramaSubModule('programa'),
    'contenido-destacado': () => new ContenidoDestacadoSubModule('contenido'),
    'lista-con-iconografia': () => new ListaConIconografiaSubModule('elemento'),
    'cards-con-iconografia': () => new CardsConIconografiaSubModule('card'),
    'acordeon': () => new AcordeonSubModule('desplegable'),
    'grid-de-imagenes': () => new GridDeImagenesSubModule('imagen'),
    'video': () => ({} as SubModule),
    'thank-you': () => new ThankYouSubModule('enlace')
}


export type ExternalLib = ('swiper' | 'youtube');
export const exLibRequirements: { [key in ModuleType]: ExternalLib[] } =
{
    'header': [],
    'columnas-de-texto': [],
    'cards-de-programa': ['swiper'],
    'contenido-destacado': ['swiper'],
    'lista-con-iconografia': [],
    'cards-con-iconografia': [],
    'acordeon': ['swiper'],
    'grid-de-imagenes': [],
    'video': ['youtube'],
    'thank-you': []
}
