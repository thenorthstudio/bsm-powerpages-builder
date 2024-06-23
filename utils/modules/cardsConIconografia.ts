import { Module, SubModule } from '@/utils/module';


type CardsConIconografiaSubPropDic = {
    title: InstanceType<typeof ModulePropString>,
    width: InstanceType<typeof ModulePropOptions>,
    text: InstanceType<typeof ModulePropString>,
}
export class CardsConIconografiaSubModule extends SubModule<CardsConIconografiaSubPropDic>
{
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Lorem ipsum', 'plain', 1),
            width: new ModulePropOptions('Ancho', [
                { label: 'Completo', value: '12' },
                { label: 'Mitad', value: '6' },
                { label: 'Tercio', value: '4' }
            ], 1, 1),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich'),
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


type CardsConIconografiaPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    cards: InstanceType<typeof ModulePropArray<CardsConIconografiaSubModule>>;
}
export class CardsConIconografiaModule extends Module<CardsConIconografiaPropDic>
{
    constructor()
    {
        super('cards-con-iconografia');
        this.additionalInfo = 'Imagen: 80x80px (.SVG para iconos)';
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Cards con iconografía'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            cards: new ModulePropArray(
                CardsConIconografiaSubModule, 'card', 'Cards', 1
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
