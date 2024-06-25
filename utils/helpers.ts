/* Converts input to T when type conversion is not possible (~vue template) */
export const asA = <T>(obj: any) => obj as T;


/* Moves elements around inside an array */
export const reorderArray = <T>(array: T[], from: number, to: number) =>
{
    const newArray: T[] = [];
    for (let i = 0; i < array.length; i++)
    {
        if (i == from) newArray.push(array[to]);
        else if (i == to) newArray.push(array[from]);
        else newArray.push(array[i]);
    }
    array.splice(0, array.length, ...newArray);
}


/* Checks if a string is empty */
export const isEmpty = (str?: string) => !(str && str.trim() != '');

/* Returns default value if string is empty */
export const stringOrDefault = <T>(str: string, defaultValue: T) =>
{
    if (!isEmpty(str)) return str;
    else return defaultValue;
}

/* Replaces {{ template }} with its file content or a string */
export const renderTemplate = async (
    content: string,
    slot: string,
    source?: string,
)
    : Promise<string> =>
{
    let sourceStr = source;
    if (!sourceStr) sourceStr = await $fetch<string>(`/builder/template/${slot}.html`);
    return content.replace(new RegExp(`{{ ?${slot} ?}}`, 'gi'), sourceStr);
}

/* Clean HTML from string */
export const cleanHTML = (html: string) =>
{
    const regex = /<\/?\w+>/g;
    return html.replace(regex, '');
}

export const LONG_LOREM = `<p>Lorem ipsum dolor sit amet,
<strong>consectetur</strong> adipiscing elit. Mauris condimentum
nec elit vel egestas.<em>Integer sodales erat ac velit suscipit</em>,
sit amet ornare nisl cursus. Sed leo tellus, commodo eu arcu nec,
sagittis tincidunt velit.</p><p>In volutpat purus non
elit pharetra, vel cursus nunc luctus. Quisque accumsan dolor dolor,
pellentesque pretium tellus fringilla at.</p>`;

export const MID_LOREM = `<p>Lorem ipsum dolor sit amet,
<strong>consectetur</strong> adipiscing elit. Mauris condimentum
nec elit vel egestas.<em>Integer sodales erat ac velit suscipit</em>.</p>`;

export const SHORT_LOREM = `Lorem ipsum dolor sit amet, consectetur
adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.`
