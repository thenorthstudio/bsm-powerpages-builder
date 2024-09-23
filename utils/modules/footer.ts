import { Module } from "@/utils/moduleTypes";


type TOption = {
  label: string,
  value: 'es' | 'ca' | 'en',
}
type FooterModulePropDic = {
  lang: InstanceType<typeof ModulePropOptions<TOption>>;
}
export class FooterModule extends Module<FooterModulePropDic>
{
  constructor() { super('footer') }
  createProps()
  {
    const props = {
      lang: new ModulePropOptions<TOption>('Idioma', [
        { label: 'Español', value: 'es' },
        { label: 'Catalán', value: 'ca' },
        { label: 'Inglés', value: 'en' },
      ]),
    }
    const hint = 'Cambia los links legales';
    props.lang.additionalInfo = hint;
    return props;
  }
  getDescriptor()
  {
    const lang = this.props.lang.getOption().value;
    return `[${lang.toUpperCase()}] ${this.getTitle()}`;
  }
}
