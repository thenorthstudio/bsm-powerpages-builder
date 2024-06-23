import { html_beautify } from 'js-beautify';
import { compileString } from 'sass';


export class ViewportBuilder
{
    shadowDoc?: HTMLElement;
    mirrorWindow?: Window;
    mirrorDoc?: Document;
    mainEl?: HTMLElement;
    
    async init(iframe: HTMLIFrameElement, shadowDoc: HTMLElement)
    {
        this.mirrorWindow = iframe.contentWindow!;
        this.mirrorDoc = iframe.contentDocument!;
        this.mirrorDoc.open();
        const template = await $fetch<string>('/builder/template.html');
        this.mirrorDoc.write(template);
        this.mirrorDoc.close();
        await skipFrame();
        
        this.shadowDoc = shadowDoc;
        this.mainEl = this.mirrorDoc.querySelector<HTMLElement>('main')!;

        await this.appendStyle('reset', '/builder/_reset.scss');
        await this.appendStyle('fontface', '/builder/_font-face.scss');
        await this.appendStyle('typography', '/builder/_typography.scss');
        await this.appendStyle('theme', '/builder/theme.scss');
    }


    async update()
    {
        const page = useCurrentPage();
        page.isUpdating.value = true;
        page.scrollY.value = this.mirrorWindow!.scrollY;
        
        await skipTime(10);
        const temp = [...page.modules.value];
        for (let i = 0; i < temp.length; i++)
        {
            const m = temp[i];
            if (m.deathMark)
            {
                // de-render:
                const el = this.getMirrorModule(m.id);
                if (el) this.mainEl!.removeChild(el);
                else console.error('Tried to remove a mirror-ghost module!', m);
                page.modules.value.splice(i, 1);

                // remove CSS/JS if necessary:
                let isModuleCssExtinct = true;
                let isModuleJsExtinct = true;
                for (let j = 0; j < page.modules.value.length; j++)
                {
                    const m2 = page.modules.value[j];
                    if (m2.id == m.id) continue;
                    if (m2.type == m.type)
                    {
                        isModuleCssExtinct = false;
                        isModuleJsExtinct = false;
                        break;
                    }
                }
                if (isModuleCssExtinct)
                {
                    const id = `#${m.type}-module-css`;
                    const styleEl = this.mainEl!.querySelector(id);
                    if (styleEl) this.mainEl!.removeChild(styleEl);
                    else console.error('Tried to remove a mirror-ghost style!', m);
                }
                if (isModuleJsExtinct)
                {
                    const id = `#${m.type}-module-js`;
                    const scriptEl = this.mainEl!.querySelector(id);
                    if (scriptEl) this.mainEl!.removeChild(scriptEl);
                }
            }
            else if (m.dirty)
            {
                const newEl = this.getShadowModule(m.id);
                if (newEl)
                {
                    const oldEl = this.getMirrorModule(m.id);
                    if (!oldEl)
                    {
                        // first-time render:
                        const clone = newEl.cloneNode(true);
                        this.mainEl!.append(clone);

                        // add CSS if necessary:
                        const cssId = `#${m.type}-module-css`;
                        const styleEl = this.mainEl!.querySelector(cssId);
                        if (!styleEl)
                        {
                            const path = `/builder/scss/${m.type}.scss`;
                            await this.appendStyle(`${m.type}`, path);
                        }
                        // add JS if necessary:
                        const jsId = `#${m.type}-module-js`;
                        const scriptEl = this.mainEl!.querySelector(jsId);
                        if (!scriptEl)
                        {
                            const path = `/builder/js/${m.type}.js`;
                            await this.appendScript(`${m.type}`, path);
                        }
                    }
                    // re-render:
                    else this.mainEl!.replaceChild(newEl.cloneNode(true), oldEl);
                }
                else console.error('Tried to add a shadow-ghost module!', m);
            }
        }
        // this.scrollToFocused();

        // dispatch load event for JS:
        setTimeout(() => {
            this.mirrorDoc!.dispatchEvent(new Event('load'));
        }, 10);
        
        await skipTime(10);
        page.isUpdating.value = false;
        this.pinScroll();
    }
    reRender()
    {
        const page = useCurrentPage();
        this.mainEl!.querySelectorAll('.c-module').forEach(
            node => this.mainEl!.removeChild(node)
        );
        page.modules.value.forEach(m => m.dirty = true);
    }
    scrollToFocused()
    {
        const focusEl = this.mainEl!.querySelector('.has-focus');
        if (focusEl)
        {
            const y = focusEl.getBoundingClientRect().top;
            this.mirrorWindow!.scrollTo(0, y - 90);
        }
    }
    pinScroll()
    {
        const page = useCurrentPage();
        this.mirrorWindow!.scrollTo(0, page.scrollY.value);
    }
    
    getMirrorModule(id: number)
    {
        const el = this.mainEl!.querySelector(`[data-id="${id}"]`);
        return el || false;
    }
    getShadowModule(id: number)
    {
        const el = this.shadowDoc!.querySelector(`[data-id="${id}"]`);
        return el || false;
    }

    async appendStyle(id: string, path: string)
    {
        const scss = await $fetch<string>(path);
        const css = compileString(scss, { style: 'compressed' }).css;
        const node = this.mirrorDoc!.createElement('style');
        node.id = id + '-module-css';
        node.innerHTML = css;

        this.mainEl!.append(node);
        await skipFrame();
    }
    async appendScript(id: string, path: string)
    {
        const js = await $fetch<Blob>(path).then(
            r => r.text()
        ).catch(_ => console.log(`Not found: ${path}`));
        if (js)
        {            
            const node = this.mirrorDoc!.createElement('script');
            node.id = id + '-module-js';
            node.innerHTML = js;
            
            this.mainEl!.append(node);
            await skipFrame();
        }
    }

    async exportPageHTML()
    {
        // Take into account <liquid> macros

        // Create fake-DIV that will hold exported HTML:
        const body = this.mirrorDoc!.querySelector('body')! as HTMLBodyElement;
        const kitchenEl = document.createElement('div') as HTMLElement;
        for (const el of body.children)
        {
            const newEl = el.cloneNode(true);
            kitchenEl.appendChild(newEl);
        }
        await skipTime(10);
        const main = kitchenEl.querySelector('main')! as HTMLElement;

        // Remove builder marker & builder-only elements:
        main.classList.remove('in-builder');
        main.querySelectorAll('.is-builder-only').forEach(
            node => node.parentNode!.removeChild(node)
        );
        
        // Remove builder style tags:
        main.querySelectorAll('style').forEach(node => main.removeChild(node));

        await skipTime(10);
        return html_beautify(kitchenEl.innerHTML, { indent_size: 4 });
    }
    async exportMenuHTML()
    {
        // There are different menus!
    }
    async exportFooterHTML()
    {

    }
    async exportThemeCSS()
    {
        let cssString = '';
        const globalPaths = [
            '_reset',
            '_font-face',
            '_typography',
            '_powerpages-fix',
            'theme'
        ];
        for (let i = 0; i < globalPaths.length; i++)
        {
            const path = globalPaths[i];            
            const scss = await $fetch<string>(`/builder/${path}.scss`);
            cssString += compileString(scss, { style: 'compressed' }).css;
        }

        const modulePaths: { [key in ModuleType]: ModuleType } =
        {
            'header': 'header',
            'columnas-de-texto': 'columnas-de-texto',
            'lista-con-iconografia': 'lista-con-iconografia',
            'cards-con-iconografia': 'cards-con-iconografia',
            'grid-de-imagenes': 'grid-de-imagenes'
        }
        for (const path in modulePaths)
        {            
            const scss = await $fetch<string>(`/builder/scss/${path}.scss`);
            cssString += compileString(scss, { style: 'compressed' }).css;
        }

        // TODO: Prefix!
        // cssString = (await postcss([autoprefixer]).process(cssString)).css;
        return cssString;
    }
}
