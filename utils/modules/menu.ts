import { Module } from "@/utils/moduleTypes";


type MenuPropDic = {
  esUrl: InstanceType<typeof ModulePropString>,
  caUrl: InstanceType<typeof ModulePropString>,
  enUrl: InstanceType<typeof ModulePropString>,
  pageLinks: InstanceType<typeof ModulePropList<{ label: string, url: string }>>,
}
export class MenuModule extends Module<MenuPropDic>
{
  constructor() { super('menu') }
  createProps()
  {
    const defaultItem ={
      label: 'Subpágina',
      url: '/subpagina'
    };
    const props = {
      esUrl: new ModulePropString('URL Castellano', 'https://landinges.bsm.upf.edu/pagina', 'plain'),
      caUrl: new ModulePropString('URL Catalán', 'https://landingca.bsm.upf.edu/pagina', 'plain'),
      enUrl: new ModulePropString('URL Inglés', 'https://landingen.bsm.upf.edu/pagina', 'plain'),
      pageLinks: new ModulePropList(defaultItem, 'Subpáginas'),
    };
    props.pageLinks.additionalInfo = 'Debe empezar por /';
    return props;
  }
  override onAnyChange() {
    useCurrentPage().dirtyJS.value = true;
  }
  getDescriptor() { return this.getTitle() }
}
