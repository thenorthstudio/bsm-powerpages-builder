/* Base class for both modules and sub-modules */
export type ModulePropDic = { [key: string]: ModuleProp };

export abstract class ModuleBase<TPropDic extends ModulePropDic = ModulePropDic>
{
  id: number;
  props: TPropDic;
  
  constructor()
  {
    this.id = Date.now();
    this.props = this.createProps();
  }
  
  /* Abstract methods */
  abstract createProps(): TPropDic;
  abstract getTitle(): string;
  abstract getDescriptor(): string;
  onAnyChange() {  }
}


/* Base class for each module in the repository */
export abstract class Module<TPropDic extends ModulePropDic = ModulePropDic>
  extends ModuleBase<TPropDic>
{
  type: ModuleType;
  dirty: boolean;
  hovering: boolean;
  deathMark: boolean;
  additionalInfo?: string;
  topMaring: ModuleMarginType;
  anchor?: string;
  
  constructor(type: ModuleType) 
  {
    super();
    this.type = type;
    this.dirty = true;
    this.hovering = false;
    this.deathMark = false;
    this.topMaring = 'normal-margin';
  }
  
  /* Base methods */
  getTitle()
  {
    // All modules except 'thank-you' use the title prop
    // or already have a ortographically correct title
    if (!(['thank-you'] as ModuleType[]).includes(this.type))
    {
      if (this.props.title)
      {
        if (this.props.title.value) return this.props.title.value as string;
        else return this.props.title.defaultValue as string;
      }
      else
      {
        const title = this.type.replace(/-/g, ' ');
        return title.slice(0, 1).toUpperCase() + title.slice(1);
      }
    }
    else return "'Thank you page'";
  }
  toggleHover(state: boolean)
  {
    this.hovering = state;
    this.dirty = true;
  }
}


/* Base class for any sub-part of a module (like arrays of objects) */
export abstract class SubModule<TPropDic extends ModulePropDic = ModulePropDic>
  extends ModuleBase<TPropDic>
{
  type: string;
  
  constructor(type: string)
  {
    super();
    this.id = Math.floor(Math.random() * 10000);
    this.type = type;
  }
  
  getTitle()
  {
    const title = this.type.replace(/-/g, ' ');
    return title.slice(0, 1).toUpperCase() + title.slice(1);
  }
}
