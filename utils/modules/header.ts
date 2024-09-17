import { Module } from "@/utils/moduleTypes";

type TOption = {
  label: string,
  value: 'true' | 'false',
}
type HeaderModulePropDic = {
  title: InstanceType<typeof ModulePropString>;
  text: InstanceType<typeof ModulePropString>;
  hasForm: InstanceType<typeof ModulePropOptions<TOption>>;
  formClaim: InstanceType<typeof ModulePropString>;
}
export class HeaderModule extends Module<HeaderModulePropDic>
{
  constructor()
  {
    super('header');
    this.additionalInfo = 'Imagen de 1440·536px';
  }
  createProps()
  {
    const props = {
      title: new ModulePropString('Título', 'Header'),
      text: new ModulePropString('Texto', MID_LOREM, 'rich'),
      hasForm: new ModulePropOptions<TOption>('Incluir formulario', [
        { label: 'No', value: 'false' },
        { label: 'Sí', value: 'true' },
      ], 0, 1),
      formClaim: new ModulePropString(
        'Encabezado del formulario',
        'QUIERO SABER MÁS',
        'plain', 1
      ),
    }
    const hint = 'Este se debe añadir y configurar en Dynamics';
    props.hasForm.additionalInfo = hint;
    return props;
  }
  override onAnyChange()
  {
    const hasForm = this.props.hasForm.getOption().value == 'true';
    this.props.formClaim.isHiiden = !hasForm;
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
