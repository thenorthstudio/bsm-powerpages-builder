import { Module, SubModule } from "@/utils/moduleTypes";


type ColumnasDeTextoSubPropDic = {
    text: InstanceType<typeof ModulePropString>;
}
export class ColumnasDeTextoSubModule extends SubModule<ColumnasDeTextoSubPropDic>
{
    createProps() {
        return { text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3') }
    }
    getDescriptor()
    {
        const str = cleanHTML(this.props.text.value);
        if (!isEmpty(str)) return str;
        else return this.getTitle();
    }
}


type ColumnasDeTextoModulePropDic = {
    title: InstanceType<typeof ModulePropString>;
    columns: InstanceType<typeof ModulePropArray<ColumnasDeTextoSubModule>>;
}
export class ColumnasDeTextoModule extends Module<ColumnasDeTextoModulePropDic>
{
    constructor() { super('columnas-de-texto') }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Columnas de texto'),
            columns: new ModulePropArray(
                ColumnasDeTextoSubModule, 'columna', 'Columnas', 1, 4
            ),
        }
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        if (!isEmpty(title)) return title;
        else return this.getTitle();
    }
}
