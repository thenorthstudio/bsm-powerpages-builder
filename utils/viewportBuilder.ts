import type { Module } from "@/utils/moduleTypes";
import { html_beautify } from 'js-beautify';
import { compileString } from 'sass';


export class ViewportBuilder
{
    shadowDoc?: HTMLElement;
    mirrorWindow?: Window;
    mirrorDoc?: Document;
    mainEl?: HTMLElement;
    bodyEl?: HTMLElement;
    
    async init(iframe: HTMLIFrameElement, shadowDoc: HTMLElement)
    {
        this.shadowDoc = shadowDoc;
        this.mirrorWindow = iframe.contentWindow!;
        this.mirrorDoc = iframe.contentDocument!;
        this.mirrorDoc.open();
        let html = await $fetch<string>('/builder/index.html');
        html = await renderTemplate(html, 'menu');
        html = await renderTemplate(html, 'footer');
        html = await renderTemplate(html, 'logo');
        this.mirrorDoc.write(html);
        this.mirrorDoc.close();
        
        await skipFrame();
        this.bodyEl = this.mirrorDoc.querySelector<HTMLElement>('body')!;
        this.mainEl = this.mirrorDoc.querySelector<HTMLElement>('main')!;
        await skipFrame();

        await this.appendStyle('reset-global', '/builder/_reset.scss');
        await this.appendStyle('swiper-lib', '/builder/_swiper.scss');
        await this.appendStyle('fontface-global', '/builder/_font-face.scss');
        await this.appendStyle('typography-global', '/builder/_typography.scss');
        await this.appendStyle('theme-global', '/builder/theme.scss');
        await this.appendStyle('menu-module', '/builder/scss/menu.scss');
        await this.appendStyle('footer-module', '/builder/scss/footer.scss');

        await this.appendScript('theme-global', '/builder/js/theme.js');
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

                await this.cleanCssJs(m, page.modules.value);
                await this.cleanExLib(m, page.modules.value);
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

                        await this.checkAddExLib(m);
                        await this.checkAddCssJs(m);
                    }
                    // re-render:
                    else this.mainEl!.replaceChild(newEl.cloneNode(true), oldEl);
                }
                else console.error('Tried to add a shadow-ghost module!', m);

                // If re-rending a swiper-related module, trigger JS reload:
                if (exLibRequirements[m.type].includes('swiper'))
                    this.triggerJS();
            }
        }
        // this.scrollToFocused();
        
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
    triggerJS()
    {
        // dispatch load event for JS:
        setTimeout(() => {
            this.mirrorWindow!.dispatchEvent(new Event('load'));
        }, 100);
    }

    async checkAddCssJs(module: Module)
    {
        // add CSS if necessary:
        const cssId = `#${module.type}-module-css`;
        const styleEl = this.bodyEl!.querySelector(cssId);
        if (!styleEl)
        {
            const path = `/builder/scss/${module.type}.scss`;
            await this.appendStyle(`${module.type}-module`, path);
        }
        // add JS if necessary:
        const jsId = `#${module.type}-module-js`;
        const scriptEl = this.bodyEl!.querySelector(jsId);
        if (!scriptEl)
        {
            const path = `/builder/js/${module.type}.js`;
            await this.appendScript(`${module.type}-module`, path);
        }
    }
    async cleanCssJs(module: Module, moduleList: Module[])
    {
        // remove CSS/JS if necessary:
        let isModuleCssExtinct = true;
        let isModuleJsExtinct = true;
        for (let j = 0; j < moduleList.length; j++)
        {
            const m2 = moduleList[j];
            if (m2.id == module.id) continue;
            if (m2.type == module.type)
            {
                isModuleCssExtinct = false;
                isModuleJsExtinct = false;
                break;
            }
        }
        if (isModuleCssExtinct)
        {
            const id = `#${module.type}-module-css`;
            const styleEl = this.bodyEl!.querySelector(id);
            if (styleEl) this.bodyEl!.removeChild(styleEl);
            else console.error('Tried to remove a mirror-ghost style!', module);
        }
        if (isModuleJsExtinct)
        {
            const id = `#${module.type}-module-js`;
            const scriptEl = this.bodyEl!.querySelector(id);
            if (scriptEl) this.bodyEl!.removeChild(scriptEl);
        }
    }

    async checkAddExLib(module: Module)
    {
        const libPaths: { [key in ExternalLib]: string } = {
            'none': '',
            'swiper': 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
        }
        const libs = exLibRequirements[module.type];
        for (let i = 0; i < libs.length; i++)
        {
            const lib = libs[i];
            // add JS if necessary:
            const jsId = `#${lib}-lib-js`;
            const scriptEl = this.bodyEl!.querySelector(jsId);
            if (!scriptEl)
            {
                const path = libPaths[lib];
                const node = this.mirrorDoc!.createElement('script') as HTMLScriptElement;
                node.id = `${lib}-lib-js`;
                node.src = path;
                
                this.bodyEl!.append(node);
                await skipFrame();
            }
        }
    }
    async cleanExLib(module: Module, moduleList: Module[])
    {
        // check if any external libraries are needed:
        return;

        let isModuleCssExtinct = true;
        let isModuleJsExtinct = true;
        for (let j = 0; j < moduleList.length; j++)
        {
            const m2 = moduleList[j];
            if (m2.id == module.id) continue;
            if (m2.type == module.type)
            {
                isModuleCssExtinct = false;
                isModuleJsExtinct = false;
                break;
            }
        }
        if (isModuleCssExtinct)
        {
            const id = `#${module.type}-module-css`;
            const styleEl = this.bodyEl!.querySelector(id);
            // if (styleEl) this.bodyEl!.removeChild(styleEl);
            // else console.error('Tried to remove a mirror-ghost style!', module);
        }
        if (isModuleJsExtinct)
        {
            const id = `#${module.type}-module-js`;
            const scriptEl = this.bodyEl!.querySelector(id);
            // if (scriptEl) this.bodyEl!.removeChild(scriptEl);
        }
    }

    async appendStyle(id: string, path: string)
    {
        const scss = await $fetch<string>(path);
        const css = compileString(scss, { style: 'compressed' }).css;
        const node = this.mirrorDoc!.createElement('style');
        node.id = id + '-css';
        node.innerHTML = css;

        this.bodyEl!.append(node);
        await skipFrame();
    }
    async appendScript(id: string, path: string)
    {
        const js = await $fetch<Blob>(path).then(
            r => r.text()
        ).catch(_ => console.log(`Not found: ${path}`));
        if (js)
        {            
            const node = this.mirrorDoc!.createElement('script') as HTMLScriptElement;
            // if (defer) node.defer = true;
            node.id = id + '-js';
            node.innerHTML = js;
            
            this.bodyEl!.append(node);
            await skipFrame();
        }
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


    async exportPageHTML()
    {
        // Take into account <liquid> macros

        // Create fake-DIV that will hold exported HTML:
        const mirrorBody = this.mirrorDoc!.querySelector('body')! as HTMLBodyElement;
        const kitchenEl = document.createElement('div') as HTMLElement;
        for (const el of mirrorBody.children)
        {
            const newEl = el.cloneNode(true);
            kitchenEl.appendChild(newEl);
        }
        await skipTime(10);

        // Remove in-builder marker:
        const kitchenMain = kitchenEl.querySelector('main')! as HTMLElement;
        kitchenMain.classList.remove('in-builder', '|');

        // Remove builder-only elements, styles & menu and footer:
        const toRemove = 'nav, .builder-only, style, footer';
        kitchenEl.querySelectorAll(toRemove).forEach(
            node => node.parentNode!.removeChild(node)
        );

        // Remove module ID attribute:
        kitchenEl.querySelectorAll('[data-id]').forEach(
            node => node.removeAttribute('data-id')
        );

        await skipTime(10);
        return html_beautify(kitchenEl.innerHTML, { indent_size: 4 });
    }
    async exportMenuHTML()
    {
        // There are different menus!
        // or are they..?
        let html = await $fetch<string>('/builder/template/menu.html');
        html = await renderTemplate(html, 'logo');

        // Remove <prod-only> tags, keeping content:
        const regex = /<div ?class="prod-only ?">(.*?)<\/div>/gis;
        html = html.replace(regex, '$1');

        return html_beautify(html, { indent_size: 4 });
    }
    async exportFooterHTML()
    {
    }
    async exportThemeCSS()
    {
        let cssString = '';
        const globalPaths = [
            '_reset',
            '_swiper',
            '_font-face',
            '_typography',
            '_powerpages-fix',
            'theme',
            'scss/menu',
            'scss/footer'
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
            'cards-de-programa': 'cards-de-programa',
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
