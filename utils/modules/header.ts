import { Module } from '@/utils/module';


type HeaderModulePropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
}
export class HeaderModule extends Module<HeaderModulePropDic>
{
    constructor()
    {
        super('header');
        this.additionalInfo = 'Imagen: 1440x536px';
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Header'),
            text: new ModulePropString('Texto', MID_LOREM, 'rich'),
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
