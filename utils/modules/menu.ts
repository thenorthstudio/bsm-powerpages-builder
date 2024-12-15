import { Module } from "@/utils/moduleTypes";


type MenuPropDic = {
  esUrl: InstanceType<typeof ModulePropString>,
  caUrl: InstanceType<typeof ModulePropString>,
  enUrl: InstanceType<typeof ModulePropString>,
  pageLinks: InstanceType<typeof ModulePropList<{ label: string, url: string }>>,
}
export class MenuModule extends Module<MenuPropDic>
{
  constructor()
  {
    super('menu');
    this.additionalInfo = 'Para el resto de idiomas, las URLs deben empezar por https://';
  }
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
      pageLinks: new ModulePropList(defaultItem, 'Subpáginas', 0),
    };
    props.pageLinks.additionalInfo = 'Debe empezar por /';
    return props;
  }
  override onAnyChange()
  {
    // Ensure all URLs start with https://:
    const props = ['esUrl', 'caUrl', 'enUrl'] as (keyof MenuPropDic)[];
    for (const prop of props)
    {
      const url = this.props[prop].value as string;
      const httpsPrefix = url.match(/^ht{1,2}p?s?:?\/?\/?/i)?.[0] || '';
      if (httpsPrefix && httpsPrefix !== 'https://') {
        this.props[prop].value = 'https://' + url.slice(httpsPrefix.length);
      }
      else if (!url.startsWith('https://')) {
        this.props[prop].value = 'https://' + url;
      }
    }
    // Refresh language selectors:
    useCurrentPage().dirtyJS.value = true;
  }
  getDescriptor() { return this.getTitle() }
}
