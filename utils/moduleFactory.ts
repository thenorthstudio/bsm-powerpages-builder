import { Module, SubModule } from "@/utils/moduleTypes";


export const moduleFactory: { [key in ModuleType]: () => Module } =
{
    'header': () => new HeaderModule(),
    'columnas-de-texto': () => new ColumnasDeTextoModule(),
    'cards-de-programa': () => new CardsDeProgramaModule(),
    'contenido-destacado': () => new ContenidoDestacadoModule(),
    'lista-con-iconografia': () => new ListaConIconografiaModule(),
    'cards-con-iconografia': () => new CardsConIconografiaModule(),
    'grid-de-imagenes': () => new GridDeImagenesModule()
}


export const submoduleFactory: { [key in ModuleType]: () => SubModule } =
{
    'header': () => ({} as SubModule),
    'columnas-de-texto': () => new ColumnasDeTextoSubModule('columna'),
    'cards-de-programa': () => new CardsDeProgramaSubModule('programa'),
    'contenido-destacado': () => new ContenidoDestacadoSubModule('contenido'),
    'lista-con-iconografia': () => new ListaConIconografiaSubModule('elemento'),
    'cards-con-iconografia': () => new CardsConIconografiaSubModule('card'),
    'grid-de-imagenes': () => new GridDeImagenesSubModule('imagen')
}


export type ExternalLib = ('none' | 'swiper');
export const exLibRequirements: { [key in ModuleType]: ExternalLib[] } =
{
    'header': [],
    'columnas-de-texto': [],
    'cards-de-programa': ['swiper'],
    'contenido-destacado': ['swiper'],
    'lista-con-iconografia': [],
    'cards-con-iconografia': [],
    'grid-de-imagenes': []
}
