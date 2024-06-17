import type { SubModule } from "@/utils/module";


abstract class ModulePropBase<T>
{
    id: number;
    abstract type: ModulePropType;
    title: string;
    value: T;
    columnSpan: (1 | 2);

    constructor(title: string, defaultValue: T, columnSpan?: (1 | 2))
    {
        this.id = Math.floor(Math.random() * 1000000);
        this.title = title;
        this.value = defaultValue;
        this.columnSpan = columnSpan || 2;
    }
}


/* All possible types */
type ModulePropStringEditor = ('plain' | 'rich');
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
export class ModulePropOptions extends ModulePropBase<number>
{
    type = 'options' as ModulePropType;
    options: ModulePropOption[];

    constructor(
        title: string,
        options: ModulePropOption[],
        defaultOptionIndex?: number,
        columnSpan?: (1 | 2)
    )
    {
        super(title, defaultOptionIndex || 0, columnSpan);
        this.options = options;
    }
    getValue() { return this.options[this.value] }
}

export class ModulePropNumber extends ModulePropBase<number> {
    type = 'number' as ModulePropType;
}

export class ModulePropArray<TSub extends SubModule = SubModule>
    extends ModulePropBase<Array<TSub>>
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
        super(title, items, 1);
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
    ModulePropArray
)
