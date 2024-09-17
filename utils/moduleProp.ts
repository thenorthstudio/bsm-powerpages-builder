import type { SubModule } from "@/utils/moduleTypes";


abstract class ModulePropBase<T>
{
  id: number;
  abstract type: ModulePropType;
  title: string;
  value: T;
  defaultValue: T;
  columnSpan: (1 | 2);
  additionalInfo?: string;
  isHiiden?: boolean;
  
  constructor(title: string, defaultValue: T, columnSpan?: (1 | 2))
  {
    this.id = Math.floor(Math.random() * 1000000);
    this.title = title;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
    this.columnSpan = columnSpan || 2;
  }
}


/* All possible types */
type ModulePropStringEditor = ('plain' | 'plain-lines' | 'rich' | 'rich-h3');
export class ModulePropString extends ModulePropBase<string>
{
  type = 'string' as ModulePropType;
  editor: ModulePropStringEditor;
  
  constructor(
    title: string,
    defaultValue: string,
    editor?: ModulePropStringEditor,
    columnSpan?: (1 | 2)
  )
  {
    super(title, defaultValue, columnSpan);
    this.editor = editor || 'plain';
  }
}

export type ModulePropOption = { label: string, value: string }
export class ModulePropOptions<TOption extends ModulePropOption = ModulePropOption>
extends ModulePropBase<number>
{
  type = 'options' as ModulePropType;
  options: TOption[];
  
  constructor(
    title: string,
    options: TOption[],
    defaultOptionIndex?: number,
    columnSpan?: (1 | 2)
  )
  {
    super(title, defaultOptionIndex || 0, columnSpan);
    this.options = options;
  }
  getOption() { return this.options[this.value] }
}

export class ModulePropNumber extends ModulePropBase<number> {
  type = 'number' as ModulePropType;
}

export type StringObj = { [key: string]: string };
export class ModulePropList<TItem extends StringObj = StringObj>
extends ModulePropBase<TItem[]>
{
  type = 'list' as ModulePropType;
  factory: () => TItem;
  minAmount?: number;
  maxAmount?: number;
  
  constructor(
    defaultItem: TItem,
    title: string,
    minAmount?: number,
    maxAmount?: number
  )
  {
    const items: TItem[] = [];
    const length = minAmount || 1;
    for (let i = 0; i < length; i++)
      {
      const item = { ...defaultItem };
      items.push(item);
    }
    super(title, items);
    this.factory = () => ({ ...defaultItem });
    this.minAmount = minAmount;
    this.maxAmount = maxAmount;
  }
  
  addNew()
  {
    if (!this.maxAmount || this.value.length < this.maxAmount)
      {
      const item = this.factory();
      this.value.push(item);
      return true;
    }
    else return false;
  }
  remove(index: number)
  {
    if (!this.minAmount || this.value.length > this.minAmount)
      {
      this.value.splice(index, 1);
      return true;
    }
    else return false;
  }
}
export class ModulePropArray<TSub extends SubModule = SubModule>
extends ModulePropBase<TSub[]>
{
  type = 'array' as ModulePropType;
  createSubtype: () => TSub;
  minAmount?: number;
  maxAmount?: number;
  
  constructor(
    subtype: { new(submoduleType: string): TSub },
    submoduleType: string,
    title: string,
    minAmount?: number,
    maxAmount?: number
  )
  {
    const items: TSub[] = [];
    const length = minAmount || 1;
    for (let i = 0; i < length; i++)
      {
      const item = new subtype(submoduleType);
      items.push(item);
    }
    super(title, items);
    this.createSubtype = () => new subtype(submoduleType);
    this.minAmount = minAmount;
    this.maxAmount = maxAmount;
  }
  
  addNew()
  {
    if (!this.maxAmount || this.value.length < this.maxAmount)
      {
      const submodule = this.createSubtype();
      this.value.push(submodule);
      return true;
    }
    else return false;
  }
  remove(index: number)
  {
    if (!this.minAmount || this.value.length > this.minAmount)
      {
      this.value.splice(index, 1);
      return true;
    }
    else return false;
  }
}


/* Union of all types */
export type ModuleProp = (
  ModulePropString |
  ModulePropOptions |
  ModulePropNumber |
  ModulePropList |
  ModulePropArray
)
