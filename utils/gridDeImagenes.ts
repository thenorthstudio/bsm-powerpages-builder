import { Module, SubModule } from '@/utils/module';


type GridDeImagenesSubPropDic = {
    link: InstanceType<typeof ModulePropString>,
    alt: InstanceType<typeof ModulePropString>,
    width: InstanceType<typeof ModulePropOptions>,
}
export class GridDeImagenesSubModule extends SubModule<GridDeImagenesSubPropDic>
{
    createProps()
    {
        return {
            link: new ModulePropString('Link URL', 'https://www.bsm.upf.edu/'),
            alt: new ModulePropString('Imagen alt-text', 'Lorem ipsum', 'plain', 1),
            width: new ModulePropOptions('Ancho', [
                { label: 'Completo', value: '12' },
                { label: 'Mitad', value: '6' },
                { label: 'Tercio', value: '4' },
                { label: 'Cuarto', value: '3' },
            ], 2, 1),
        }
    }
    getDescriptor()
    {
        const link = this.props.link.value;
        const alt = cleanHTML(this.props.alt.value);
        if (!isEmpty(alt)) return alt;
        else if (!isEmpty(link)) return link;
        else return this.getTitle();
    }
}


type GridDeImagenesPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    images: InstanceType<typeof ModulePropArray<GridDeImagenesSubModule>>;
}
export class GridDeImagenesModule extends Module<GridDeImagenesPropDic>
{
    constructor() { super('grid-de-imagenes') }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Lorem ipsum'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich'),
            images: new ModulePropArray(
                GridDeImagenesSubModule, 'imagen', 'Imágenes', 1
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
