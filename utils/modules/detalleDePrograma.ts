import { Module, SubModule } from "@/utils/moduleTypes";


type DetalleDeProgramaSubPropDic = {
  title: InstanceType<typeof ModulePropString>,
  text: InstanceType<typeof ModulePropString>,
}
export class DetalleDeProgramaSubModule extends SubModule<DetalleDeProgramaSubPropDic>
{
  createProps()
  {
    return {
      title: new ModulePropString('Título', 'Idioma', 'plain'),
      text: new ModulePropString('Texto', 'Castellano', 'plain'),
    };
  }
  getDescriptor()
  {
    const title = this.props.title.value;
    const description = this.props.text.value;
    if (!isEmpty(title))
    {
      let desc = title;
      if (!isEmpty(description)) desc += `: ${description}`;
      return desc;
    }
    else if (!isEmpty(description)) return description;
    else return this.getTitle();
  }
}


type DetalleDeProgramaPropDic = {
  style: InstanceType<typeof ModulePropOptions>,
  details: InstanceType<typeof ModulePropArray<DetalleDeProgramaSubModule>>;
}
export class DetalleDeProgramaModule extends Module<DetalleDeProgramaPropDic>
{
  constructor() { super('detalle-de-programa') }
  createProps()
  {
    const props = {
      style: new ModulePropOptions('Estilo', [
        { label: 'Gris', value: 'grey' },
        { label: 'Rojo', value: 'red' },
      ]),
      details: new ModulePropArray(
        DetalleDeProgramaSubModule, 'detalle', 'Detalles'
      ),
    };
    props.details.additionalInfo = 'Icono de 40·40px';
    return props;
  }
  getDescriptor()
  {
    let title = this.getTitle();
    const details = this.props.details.value;
    if (details.length) title += ` (${details.length})`;
    return title;
  }
}
