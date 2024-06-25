import { Module, SubModule } from "@/utils/moduleTypes";


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
            link: new ModulePropString('Link URL', ''),
            alt: new ModulePropString('Imagen alt-text', '', 'plain', 1),
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
    constructor()
    {
        super('grid-de-imagenes');
        this.additionalInfo = 'Imagen de 200px de alto (ancho variable)';
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Grid de imágenes'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            images: new ModulePropArray(
                GridDeImagenesSubModule, 'imagen', 'Imágenes'
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
