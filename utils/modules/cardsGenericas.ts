import { Module, SubModule } from "@/utils/moduleTypes";


type TSubOption = {
    label: string,
    value: ('none' | 'image' | 'video')
}
type CardsGenericasSubPropDic = {
    mediaType: InstanceType<typeof ModulePropOptions<TSubOption>>,
    videoUrl: InstanceType<typeof ModulePropString>,
    title: InstanceType<typeof ModulePropString>,
    subtitle: InstanceType<typeof ModulePropString>,
    text: InstanceType<typeof ModulePropString>,
    bottomText: InstanceType<typeof ModulePropString>,
    url: InstanceType<typeof ModulePropString>,
}
export class CardsGenericasSubModule extends SubModule<CardsGenericasSubPropDic>
{
    createProps()
    {
        const props = {
            mediaType: new ModulePropOptions<TSubOption>('Tipo de media', [
                { label: 'Ninguno', value: 'none' },
                { label: 'Imagen', value: 'image' },
                { label: 'Vídeo', value: 'video' }
            ], 1, 1),
            videoUrl: new ModulePropString(
                'Youtube URL', 'https://www.youtube.com/watch?v=...',
                'plain', 1
            ),
            title: new ModulePropString('Titular', 'Lorem ipsum', 'plain'),
            subtitle: new ModulePropString('Subtitular', SHORT_LOREM, 'plain-lines'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich'),
            bottomText: new ModulePropString('Pie de card', 'PIE', 'plain', 1),
            url: new ModulePropString('Enlace de la card', 'https://...', 'plain', 1),
        };
        return props;
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        const subtitle = cleanHTML(this.props.subtitle.value);
        if (!isEmpty(title)) return title;
        else if (!isEmpty(subtitle)) return subtitle;
        else return this.getTitle();
    }
}


type TOption = {
    label: string,
    value: ('people' | 'other')
}
type CardsGenericasPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    contentType: InstanceType<typeof ModulePropOptions<TOption>>;
    cards: InstanceType<typeof ModulePropArray<CardsGenericasSubModule>>;
}
export class CardsGenericasModule extends Module<CardsGenericasPropDic>
{
    constructor()
    {
        super('cards-genericas');
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Cards genéricas'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            contentType: new ModulePropOptions<TOption>('Tipo de contenido', [
                { label: 'Personas', value: 'people' },
                { label: 'Otros', value: 'other' }
            ]),
            cards: new ModulePropArray(
                CardsGenericasSubModule, 'card', 'Cards'
            ),
        }
    }
    override onAnyChange()
    {
        type TKey = keyof CardsGenericasSubPropDic;
        const groups: { [key in TOption['value']]: TKey[] } = {
            'people': [
                'title', 'subtitle', 'text',
                'bottomText', 'url',
            ],
            'other': [
                'mediaType', 'videoUrl',
                'title', 'subtitle', 'text',
                'bottomText', 'url',
            ],
        };
        const cType = this.props.contentType.getOption().value;
        this.props.cards.value.forEach(c =>
        {
            const isVideo = c.props.mediaType.getOption().value == 'video';
            for (const pName in c.props)
            {
                const k = pName as TKey;
                const isHidden = !groups[cType].includes(k);
                if (k != 'videoUrl') c.props[k].isHiiden = isHidden;
                else c.props.videoUrl.isHiiden = isHidden || !isVideo;
            }
        });
        if (cType == 'people')
        {
            // Force media type to image:
            const hint = 'Foto de 250·250px';
            this.props.cards.additionalInfo = hint;
            this.additionalInfo = hint;
        }
        else if (cType == 'other')
        {
            const hint = 'Imagen de 282·177px';
            this.props.cards.additionalInfo = hint;
            this.additionalInfo = hint;
        }
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        const text = cleanHTML(this.props.text.value);
        const type = this.props.contentType.getOption().value;

        if (!isEmpty(title)) return title;
        else if (!isEmpty(text)) return text;
        else return `${this.getTitle()} (${type})`;
    }
}
