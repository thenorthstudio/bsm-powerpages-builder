import type { Module } from "@/utils/moduleTypes";
import type { ModulePropArray } from "@/utils/moduleProp";


/* Creates a perfect copy or clone of a Module */
export const cloneModule = <TModule extends Module>(
  module: TModule,
  generateNewId: boolean
): TModule =>
{
  const newModule = moduleFactory[module.type]() as TModule;
  if (!generateNewId) newModule.id = module.id;
  newModule.topMaring = module.topMaring;
  newModule.anchor = module.anchor;
  
  // Loop all of new module's props:
  for (const propName in newModule.props)
  {
    const moduleProp = module.props[propName];
    const prop = newModule.props[propName];
    if (!generateNewId) prop.id = moduleProp.id;
    
    if (prop.type == 'array')
    {
      const propArray = moduleProp as ModulePropArray;
      const newPropArray = prop as ModulePropArray;
      newPropArray.value = [];
      
      // Looop all elements insie the Submodule-array prop:
      for (let i = 0; i < propArray.value.length; i++)
      {
        newPropArray.addNew();
        const submodule = propArray.value[i];
        const newSubmodule = newPropArray.value[i];
        if (!generateNewId) newSubmodule.id = submodule.id;
        
        // Loop all of new submodule's props:
        for (const subPropName in newSubmodule.props)
        {
          const subProp = submodule.props[subPropName];
          const newSubProp = newSubmodule.props[subPropName];
          if (!generateNewId) newSubProp.id = subProp.id;
          newSubProp.value = subProp.value;
        }
      }
    }
    else prop.value = moduleProp.value;
  }
  return newModule;
}

/* Converts input to T when type conversion is not possible (eg. vue template) */
export const asA = <T>(obj: any) => obj as T;


/* Moves elements around inside an array */
export const reorderArray = <T>(array: T[], from: number, to: number) =>
{
  const movedItem = array.splice(from, 1);
  array.splice(to, 0, movedItem[0]);
}

/* Get Youtube ID */
export const getYoutubeId = (url: string) =>
{
  const regex = /.*youtube\.com\/watch\?v=(\w*)(\&.*)?/gi;
  return url.replace(regex, '$1');
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
): Promise<string> =>
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


/* LITERALS */
export const AllLocales: { label: string, value: Lang }[] = [
  { label: 'Castellano', value: 'es' },
  { label: 'Català', value: 'ca' },
  { label: 'English', value: 'en' },
]

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
