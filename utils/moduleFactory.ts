import { Module, SubModule } from "@/utils/moduleTypes";


export const moduleFactory: { [key in ModuleType]: () => Module } =
{
  'header': () => new HeaderModule(),
  'detalle-de-programa': () => new DetalleDeProgramaModule(),
  'columnas-de-texto': () => new ColumnasDeTextoModule(),
  'contenido-destacado': () => new ContenidoDestacadoModule(),
  'cards-de-programa': () => new CardsDeProgramaModule(),
  'cards-genericas': () => new CardsGenericasModule(),
  'cards-con-iconografia': () => new CardsConIconografiaModule(),
  'lista-con-iconografia': () => new ListaConIconografiaModule(),
  'acordeon': () => new AcordeonModule(),
  'grid-de-imagenes': () => new GridDeImagenesModule(),
  'video': () => new VideoModule(),
  'thank-you': () => new ThankYouModule(),
  'footer': () => new FooterModule()
}


export const submoduleFactory: { [key in ModuleType]: () => SubModule } =
{
  'header': () => ({} as SubModule),
  'detalle-de-programa': () => new DetalleDeProgramaSubModule('detalle'),
  'columnas-de-texto': () => new ColumnasDeTextoSubModule('columna'),
  'contenido-destacado': () => new ContenidoDestacadoSubModule('contenido'),
  'cards-de-programa': () => new CardsDeProgramaSubModule('programa'),
  'cards-genericas': () => new CardsGenericasSubModule('card'),
  'cards-con-iconografia': () => new CardsConIconografiaSubModule('card'),
  'lista-con-iconografia': () => new ListaConIconografiaSubModule('elemento'),
  'acordeon': () => new AcordeonSubModule('desplegable'),
  'grid-de-imagenes': () => new GridDeImagenesSubModule('imagen'),
  'video': () => ({} as SubModule),
  'thank-you': () => new ThankYouSubModule('enlace'),
  'footer': () => ({} as SubModule)
}


export type ExternalLib = ('swiper' | 'youtube');
export const exLibRequirements: { [key in ModuleType]: ExternalLib[] } =
{
  'header': [],
  'detalle-de-programa': ['swiper'],
  'columnas-de-texto': [],
  'contenido-destacado': ['swiper'],
  'cards-de-programa': ['swiper'],
  'cards-genericas': ['swiper', 'youtube'],
  'cards-con-iconografia': [],
  'lista-con-iconografia': [],
  'acordeon': ['swiper'],
  'grid-de-imagenes': [],
  'video': ['youtube'],
  'thank-you': [],
  'footer': []
}
