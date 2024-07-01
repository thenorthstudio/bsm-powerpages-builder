import { Module } from "@/utils/moduleTypes";


type VideoPropDic = {
    title: InstanceType<typeof ModulePropString>;
    text: InstanceType<typeof ModulePropString>;
    url: InstanceType<typeof ModulePropString>;
    foot: InstanceType<typeof ModulePropString>;
}
export class VideoModule extends Module<VideoPropDic>
{
    constructor()
    {
        super('video');
        this.additionalInfo = 'Imagen con ratio 16:9';
    }
    createProps()
    {
        return {
            title: new ModulePropString('Título', 'Vídeo'),
            text: new ModulePropString('Texto', LONG_LOREM, 'rich-h3'),
            url: new ModulePropString('Youtube URL', 'https://www.youtube.com/watch?v=...'),
            foot: new ModulePropString('Texto al pie', SHORT_LOREM, 'plain-lines'),
        }
    }
    getDescriptor()
    {
        const title = this.props.title.value;
        const text = cleanHTML(this.props.text.value);
        const url = this.props.url.value;
        const foot = this.props.foot.value;
        
        if (!isEmpty(title)) return title;
        else if (!isEmpty(foot)) return foot;
        else if (!isEmpty(text)) return text;
        else if (!isEmpty(url)) return url;
        else return this.getTitle();
    }
}
