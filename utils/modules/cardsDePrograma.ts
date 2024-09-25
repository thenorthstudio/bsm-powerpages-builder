import { Module, SubModule } from "@/utils/moduleTypes";


type CardsDeProgramaSubPropDic = {
  title: InstanceType<typeof ModulePropString>,
  description: InstanceType<typeof ModulePropString>,
  ctaText: InstanceType<typeof ModulePropString>,
  ctaType: InstanceType<typeof ModulePropOptions>,
  ctaUrl: InstanceType<typeof ModulePropString>,
  ctaId: InstanceType<typeof ModulePropString>,
  details: InstanceType<typeof ModulePropList<{
    title: string,
    text: string,
  }>>,
}
export class CardsDeProgramaSubModule extends SubModule<CardsDeProgramaSubPropDic>
{
  createProps()
  {
    const props = {
      title: new ModulePropString('Título', 'Programa', 'plain'),
      description: new ModulePropString('Descripción', MID_LOREM, 'rich'),
      ctaText: new ModulePropString('CTA Texto', 'Me interesa', 'plain', 1),
      ctaType: new ModulePropOptions('CTA Tipo', [
        { label: 'ID de Programa', value: 'programa' },
        { label: 'Link', value: 'link' },
      ], 0, 1),
      ctaUrl: new ModulePropString('CTA Link', 'https://...', 'plain'),
      ctaId: new ModulePropString('CTA ID', '12345', 'plain'),
      details: new ModulePropList({
        title: 'Título',
        text: 'Texto'
      }, 'Lista de detalles'),
    };
    props.details.additionalInfo = 'Icono de 25·25px';
    props.ctaId.additionalInfo = `
      Si existe un formulario en la página, al hacer click
      llevará al usuario a este con el campo de Programa rellenado.
    `.replace(/\n/g, '');
    return props;
  }
  override onAnyChange()
  {
    const ctaType = this.props.ctaType.getOption().value;
    this.props.ctaUrl.isHiiden = ctaType == 'programa';
    this.props.ctaId.isHiiden = ctaType == 'link';
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
