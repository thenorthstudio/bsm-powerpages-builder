import { Module, SubModule } from "@/utils/moduleTypes";


export const moduleFactory: { [key in ModuleType]: () => Module } =
{
  'header': () => new HeaderModule(),
  'columnas-de-texto': () => new ColumnasDeTextoModule(),
  'contenido-destacado': () => new ContenidoDestacadoModule(),
  'cards-de-programa': () => new CardsDeProgramaModule(),
  'cards-genericas': () => new CardsGenericasModule(),
  'cards-con-iconografia': () => new CardsConIconografiaModule(),
  'lista-con-iconografia': () => new ListaConIconografiaModule(),
  'acordeon': () => new AcordeonModule(),
  'grid-de-imagenes': () => new GridDeImagenesModule(),
  'video': () => new VideoModule(),
  'thank-you': () => new ThankYouModule()
}


export const submoduleFactory: { [key in ModuleType]: () => SubModule } =
{
  'header': () => ({} as SubModule),
  'columnas-de-texto': () => new ColumnasDeTextoSubModule('columna'),
  'contenido-destacado': () => new ContenidoDestacadoSubModule('contenido'),
  'cards-de-programa': () => new CardsDeProgramaSubModule('programa'),
  'cards-genericas': () => new CardsGenericasSubModule('card'),
  'cards-con-iconografia': () => new CardsConIconografiaSubModule('card'),
  'lista-con-iconografia': () => new ListaConIconografiaSubModule('elemento'),
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
  'contenido-destacado': ['swiper'],
  'cards-de-programa': ['swiper'],
  'cards-genericas': ['swiper', 'youtube'],
  'cards-con-iconografia': [],
  'lista-con-iconografia': [],
  'acordeon': ['swiper'],
  'grid-de-imagenes': [],
  'video': ['youtube'],
  'thank-you': []
}
