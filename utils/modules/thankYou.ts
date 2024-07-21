import { Module, SubModule } from "@/utils/moduleTypes";


interface ThankYouSubPropDic extends ModulePropDic
{
    // type: InstanceType<typeof ModulePropOptions<TOption>>;
    title: InstanceType<typeof ModulePropString>,
    cta: InstanceType<typeof ModulePropString>,
    url: InstanceType<typeof ModulePropString>,
}
export class ThankYouSubModule extends SubModule<ThankYouSubPropDic>
{
    createProps()
    {
        const props = {
            title: new ModulePropString('Titular', 'Conoce este lugar', 'plain'),
            cta: new ModulePropString('Texto CTA', 'ACCEDE AQUÍ', 'plain'),
            url: new ModulePropString('URL', '', 'plain'),
        };
        return props;
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        const text = cleanHTML(this.props.cta.value);
        const url = this.props.url.value;

        if (!isEmpty(title)) return title;
        else if (!isEmpty(text)) return text;
        else if (!isEmpty(url)) return url;
        else return this.getTitle();
    }
}


type ThankYouPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    links: InstanceType<typeof ModulePropArray<ThankYouSubModule>>;
}
export class ThankYouModule extends Module<ThankYouPropDic>
{
    constructor()
    {
        super('thank-you');
        this.additionalInfo = 'Imagen de 188px de ancho (alto variable)';
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Tu solcitud se ha enviado correctamente'),
            text: new ModulePropString('Texto', MID_LOREM, 'rich'),
            links: new ModulePropArray(
                ThankYouSubModule, 'enlace', 'Enlaces'
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
