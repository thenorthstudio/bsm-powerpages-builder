import { Module, SubModule } from '@/utils/module';


export const moduleFactory: { [key in ModuleType]: () => Module } =
{
    'header': () => new HeaderModule(),
    'columnas-de-texto': () => new ColumnasDeTextoModule(),
    'cards-con-iconografia': () => new CardsConIconografiaModule(),
    'grid-de-imagenes': () => new GridDeImagenesModule()
}


export const submoduleFactory: { [key in ModuleType]: () => SubModule } =
{
    'header': () => ({} as SubModule),
    'columnas-de-texto': () => new ColumnasDeTextoSubModule('columna'),
    'cards-con-iconografia': () => new CardsConIconografiaSubModule('card'),
    'grid-de-imagenes': () => new GridDeImagenesSubModule('imagen')
}
