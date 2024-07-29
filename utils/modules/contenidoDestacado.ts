import { Module, SubModule } from "@/utils/moduleTypes";


interface ContenidoDestacadoSubPropDic extends ModulePropDic {
    textTitle: InstanceType<typeof ModulePropString>,
    textText: InstanceType<typeof ModulePropString>,

    numberValue: InstanceType<typeof ModulePropString>,
    numberUnit: InstanceType<typeof ModulePropString>,
    numberText: InstanceType<typeof ModulePropString>,

    testimonialName: InstanceType<typeof ModulePropString>,
    testimonialPosition: InstanceType<typeof ModulePropString>,
    testimonialText: InstanceType<typeof ModulePropString>,
}
export class ContenidoDestacadoSubModule extends SubModule<ContenidoDestacadoSubPropDic>
{
    createProps()
    {
        const props = {
            textTitle: new ModulePropString('Título', 'Titular', 'plain'),
            textText: new ModulePropString('Texto', MID_LOREM, 'rich'),

            numberValue: new ModulePropString('Número', '100', 'plain', 1),
            numberUnit: new ModulePropString('Unidad', '%', 'plain', 1),
            numberText: new ModulePropString('Texto', 'Éxito', 'plain', 1),

            testimonialName: new ModulePropString('Nombre', 'Javier Aparicio', 'plain', 1),
            testimonialPosition: new ModulePropString('Posición', 'UPF Professor', 'plain', 1),
            testimonialText: new ModulePropString('Cita', SHORT_LOREM, 'plain-lines'),
        };
        return props;
    }
    getDescriptor()
    {
        for (const pName in this.props)
        {
            const p = this.props[pName] as InstanceType<typeof ModulePropString>;
            if (p.isHiiden) continue;

            const value = cleanHTML(p.value);
            if (!isEmpty(value)) return value;
        }
        return this.getTitle();
    }
}


type TOption = {
    label: string,
    value: ('text-content' | 'number-data' | 'testimonial')
}
type ContenidoDestacadoPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    contentType: InstanceType<typeof ModulePropOptions<TOption>>;
    contents: InstanceType<typeof ModulePropArray<ContenidoDestacadoSubModule>>;
}
export class ContenidoDestacadoModule extends Module<ContenidoDestacadoPropDic>
{
    constructor()
    {
        super('contenido-destacado');
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Contenido destacado'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            contentType: new ModulePropOptions<TOption>('Tipo de contenido', [
                { label: 'Titular y texto', value: 'text-content' },
                { label: 'Datos números', value: 'number-data' },
                { label: 'Testimonial', value: 'testimonial' }
            ]),
            contents: new ModulePropArray(
                ContenidoDestacadoSubModule, 'contenido', 'Contenidos'
            ),
        }
    }
    override onAnyChange()
    {
        type TKey = keyof ContenidoDestacadoSubPropDic;
        const groups: { [key in TOption['value']]: TKey[] } = {
            'text-content': ['textTitle', 'textText'],
            'number-data': ['numberValue', 'numberUnit', 'numberText'],
            'testimonial': [
                'testimonialName',
                'testimonialPosition',
                'testimonialText'
            ]
        };
        const cType = this.props.contentType.getValue().value;
        this.props.contents.value.forEach(c =>
        {
            for (const pName in c.props)
            {
                const k = pName as TKey;
                const p = c.props[k];
                p.isHiiden = !groups[cType].includes(pName);
            }
        });
        if (cType == 'testimonial')
        {
            const hint = 'Foto profesor de 64·64px';
            this.props.contents.additionalInfo = hint;
            this.additionalInfo = hint;
        }
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        const text = cleanHTML(this.props.text.value);
        const type = this.props.contentType.getValue().value;

        if (!isEmpty(title)) return title;
        else if (!isEmpty(text)) return text;
        else return `${this.getTitle()} (${type})`;
    }
}
