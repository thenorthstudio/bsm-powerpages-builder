import { Module } from "@/utils/moduleTypes";


type FormularioModulePropDic = {
  title: InstanceType<typeof ModulePropString>;
  text: InstanceType<typeof ModulePropString>;
  filterProgramas: InstanceType<typeof ModulePropList<{
    programaId: string,
  }>>,
}
export class FormularioModule extends Module<FormularioModulePropDic>
{
  constructor()
  {
    super('formulario');
    this.additionalInfo = 'Configurar en Dynamics (Máximo de 1 formulario por página)';
  }
  createProps()
  {
    const props = {
      title: new ModulePropString('Título', 'Formulario'),
      text: new ModulePropString('Texto', SHORT_LOREM, 'rich'),
      filterProgramas: new ModulePropList({
        programaId: 'ID de programa',
      }, 'Lista de programas'),
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
