type PageExport = {
  language: Lang
  modules: Module[]
}


type Lang = 'es' | 'ca' | 'en';
type LangURLs = { [key in Lang]: string };


type ModuleMarginType = (
  'normal-margin' |
  'small-margin'
)

type ModuleType = (
  'menu' |
  'header' |
  'detalle-de-programa' |
  'columnas-de-texto' |
  'contenido-destacado' |
  'cards-de-programa' |
  'cards-genericas' |
  'cards-con-iconografia' |
  'lista-con-iconografia' |
  'acordeon' |
  'grid-de-imagenes' |
  'video' |
  'thank-you' |
  'footer'
)

type ModulePropType = (
  'string' |
  'options' |
  'number' |
  'list' |
  'array'
)
