import { Module } from "@/utils/moduleTypes";


type FormularioModulePropDic = {
  title: InstanceType<typeof ModulePropString>;
  text: InstanceType<typeof ModulePropString>;
}
export class FormularioModule extends Module<FormularioModulePropDic>
{
  constructor()
  {
    super('formulario');
    this.additionalInfo = 'Este se debe añadir y configurar en Dynamics';
  }
  createProps()
  {
    const props = {
      title: new ModulePropString('Título', 'Formulario'),
      text: new ModulePropString('Texto', SHORT_LOREM, 'rich'),
    }
    return props;
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
