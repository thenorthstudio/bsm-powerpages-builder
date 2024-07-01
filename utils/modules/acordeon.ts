import { Module, SubModule } from "@/utils/moduleTypes";


type AcordeonSubPropDic = {
    group: InstanceType<typeof ModulePropString>,
    title: InstanceType<typeof ModulePropString>,
    text: InstanceType<typeof ModulePropString>,
}
export class AcordeonSubModule extends SubModule<AcordeonSubPropDic>
{
    createProps()
    {
        const props = {
            group: new ModulePropString('Grupo', 'Grupo 1', 'plain'),
            title: new ModulePropString('Título', 'Deplegable', 'plain-lines'),
            text: new ModulePropString('Descripción', LONG_LOREM, 'rich'),
        };
        return props;
    }
    getDescriptor()
    {
        const group = this.props.group.value || 'SIN GRUPO';
        const title = this.props.title.value;
        const text = cleanHTML(this.props.text.value);

        let label = '';
        if (!isEmpty(title)) label = title;
        else if (!isEmpty(text)) label = text;
        else label = this.getTitle();

        return `[${group}] ${label}`;
    }
}


type AcordeonPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    foldables: InstanceType<typeof ModulePropArray<AcordeonSubModule>>;
}
export class AcordeonModule extends Module<AcordeonPropDic>
{
    constructor() { super('acordeon'); }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Acordeón'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            foldables: new ModulePropArray(
                AcordeonSubModule, 'desplegable', 'Desplegables'
            ),
        }
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        const text = cleanHTML(this.props.text.value);
        if (!isEmpty(title)) return title;
        else if (!isEmpty(text)) return text;
        else return this.getTitle();
    }
}
