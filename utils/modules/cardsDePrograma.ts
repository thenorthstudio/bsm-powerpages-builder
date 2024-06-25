import { Module, SubModule } from "@/utils/moduleTypes";


type DetailItem = {
    title: string,
    text: string,
};
type CardsDeProgramaSubPropDic = {
    title: InstanceType<typeof ModulePropString>,
    description: InstanceType<typeof ModulePropString>,
    details: InstanceType<typeof ModulePropList<DetailItem>>,
    linkUrl: InstanceType<typeof ModulePropString>,
    linkText: InstanceType<typeof ModulePropString>,
}
export class CardsDeProgramaSubModule extends SubModule<CardsDeProgramaSubPropDic>
{
    createProps()
    {
        const defaultItem: DetailItem = {
            title: 'Título',
            text: 'Texto'
        };
        const props = {
            title: new ModulePropString('Título', 'Programa', 'plain'),
            description: new ModulePropString('Descripción', MID_LOREM, 'rich'),
            linkUrl: new ModulePropString('CTA Link', 'https://...', 'plain', 1),
            linkText: new ModulePropString('CTA Texto', 'Me interesa', 'plain', 1),
            details: new ModulePropList(defaultItem, 'Detalle'),
        };
        props.details.additionalInfo = 'Icono de 25·25px';
        return props;
    }
    override onAnyChange() {
        this.props.linkText.isHiiden = isEmpty(this.props.linkUrl.value);
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        const description = cleanHTML(this.props.description.value);
        if (!isEmpty(title)) return title;
        else if (!isEmpty(description)) return description;
        else return this.getTitle();
    }
}


type CardsDeProgramaPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    programs: InstanceType<typeof ModulePropArray<CardsDeProgramaSubModule>>;
}
export class CardsDeProgramaModule extends Module<CardsDeProgramaPropDic>
{
    constructor()
    {
        super('cards-de-programa');
        this.additionalInfo = 'Imagen de 325·225px Iconos de 25·25px';
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Cards de programa'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            programs: new ModulePropArray(
                CardsDeProgramaSubModule, 'programa', 'Programas'
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
