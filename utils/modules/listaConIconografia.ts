import { Module, SubModule } from "@/utils/moduleTypes";


type ListaConIconografiaSubPropDic = {
    text: InstanceType<typeof ModulePropString>,
}
export class ListaConIconografiaSubModule extends SubModule<ListaConIconografiaSubPropDic>
{
    createProps() {
        return {
            text: new ModulePropString('Texto', MID_LOREM, 'rich'),
        }
    }
    getDescriptor()
    {
        const text = cleanHTML(this.props.text.value);
        if (!isEmpty(text)) return text;
        else return this.getTitle();
    }
}


type ListaConIconografiaPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    items: InstanceType<typeof ModulePropArray<ListaConIconografiaSubModule>>;
}
export class ListaConIconografiaModule extends Module<ListaConIconografiaPropDic>
{
    constructor()
    {
        super('lista-con-iconografia');
        this.additionalInfo = 'Imagen de 40·40px';
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Lista con iconografía'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            items: new ModulePropArray(
                ListaConIconografiaSubModule, 'elemento', 'Elementos'
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
