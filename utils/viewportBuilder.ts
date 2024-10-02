import type { Module } from "@/utils/moduleTypes";
import { html_beautify } from 'js-beautify';
import { compileString } from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';


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
    const html = await $fetch<string>('/builder/index.html');
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
    await this.appendStyle('form-module', '/builder/scss/form.scss');
    await this.appendScript('form-module', '/builder/js/form.js');
  }


  async update()
  {
    const page = useCurrentPage();
    page.isUpdating.value = true;
    page.scrollY.value = this.mirrorWindow!.scrollY;
    let triggerJS = false;

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

        if (exLibRequirements[m.type].length || m.type == 'menu') triggerJS = true;
        m.dirty = false;
      }
    }
    await skipTime(10);
    if (triggerJS) this.triggerJS();

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
    setTimeout(() =>
    {
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
      'swiper': 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
      'youtube': 'https://www.youtube.com/iframe_api',
    }
    const libs = exLibRequirements[module.type];
    for (let i = 0; i < libs.length; i++)
    {
      const lib = libs[i];
      // add JS if necessary:
      const jsId = `${lib}-lib-js`;
      const scriptEl = this.bodyEl!.querySelector(`#${jsId}`);
      if (!scriptEl)
      {
        const path = libPaths[lib];
        const node = this.mirrorDoc!.createElement('script') as HTMLScriptElement;
        node.id = jsId;
        node.src = path;

        this.bodyEl!.append(node);
        await skipFrame();
      }
    }
  }
  async cleanExLib(module: Module, moduleList: Module[])
  {
    // check if any other module is using the libraries::
    const libs = exLibRequirements[module.type];
    for (let i = 0; i < libs.length; i++)
    {
      const lib = libs[i];
      let isLibExtinct = true;
      for (let j = 0; j < moduleList.length; j++)
      {
        const m2 = moduleList[j];
        if (m2.id == module.id) continue;
        const libs2 = exLibRequirements[m2.type];
        if (libs2.includes(lib))
        {
          isLibExtinct = false;
          break;
        }
      }
      if (isLibExtinct)
      {
        const id = `#${lib}-lib-js`;
        const scriptEl = this.bodyEl!.querySelector(id);
        if (scriptEl) this.bodyEl!.removeChild(scriptEl);
        else console.error(`Tried to remove ghost-lib ${lib}`, module);
      }
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
    ).catch(_ => { /* console.log(`No JS exists: ${path}`) */ });
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

  
  scrollToModule(module: Module)
  {
    const selector = `.c-module[data-id="${module.id}"]`;
    const focusEl = this.mainEl!.querySelector(selector);
    if (focusEl)
    {
      this.mirrorWindow!.scrollTo(0, 0);
      const y = focusEl.getBoundingClientRect().top;
      this.mirrorWindow!.scrollTo(0, y - 120);
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

    // Remove builder-only elements & styles:
    const toRemove = '.builder-only, style';
    kitchenEl.querySelectorAll(toRemove).forEach(
      node => node.parentNode!.removeChild(node)
    );

    // Move <nav> and <footer> outside of <main>:
    kitchenEl.prepend(kitchenEl.querySelector('nav')!);
    kitchenEl.append(kitchenEl.querySelector('footer')!);

    // Append all JS at the end:
    kitchenEl.querySelectorAll('script').forEach(
      script => kitchenEl.append(script)
    );

    // Remove Swiper noise:
    kitchenEl.querySelectorAll('.swiper, .swiper>*, .swiper>*>*').forEach(node =>
    {
      const classes = [...node.classList];
      classes.forEach(c =>
      {
        const protectedClasses = ['swiper-wrapper', 'swiper-slide'];
        if (c.startsWith('swiper-') && !protectedClasses.includes(c))
          node.classList.remove(c);
      });
      node.removeAttribute('aria-controls');
      node.removeAttribute('aria-disabled');
      node.removeAttribute('aria-live');
      node.removeAttribute('aria-label');
      node.removeAttribute('role');
      node.removeAttribute('style');
    });

    // Remove <prod-only> tags, keeping content:
    const regex = /<div ?class="prod-only ?">(.*?)<\/div>/gis;
    let html = kitchenEl.innerHTML.replace(regex, '$1');
    html = html_beautify(html, { indent_size: 2 });

    // Add needed fetchxml:
    if (useCurrentPage().hasForm())
    {
      const formFetch = await $fetch<string>('/builder/html/form-fetch.html');
      html = `${formFetch}\n\n${html}`;
    }
    const analytics = await $fetch<string>('/builder/html/analytics.html');
    html = `${analytics}\n\n${html}`;

    return html;
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
      'scss/form',
    ];
    for (let i = 0; i < globalPaths.length; i++)
    {
      const path = globalPaths[i];
      const scss = await $fetch<string>(`/builder/${path}.scss`);
      cssString += compileString(scss, { style: 'compressed', charset: false }).css;
    }

    const modulePaths: { [key in ModuleType]: ModuleType } =
    {
      'menu': 'menu',
      'header': 'header',
      'detalle-de-programa': 'detalle-de-programa',
      'columnas-de-texto': 'columnas-de-texto',
      'contenido-destacado': 'contenido-destacado',
      'cards-de-programa': 'cards-de-programa',
      'cards-genericas': 'cards-genericas',
      'cards-con-iconografia': 'cards-con-iconografia',
      'lista-con-iconografia': 'lista-con-iconografia',
      'acordeon': 'acordeon',
      'grid-de-imagenes': 'grid-de-imagenes',
      'video': 'video',
      'formulario': 'formulario',
      'thank-you': 'thank-you',
      'footer': 'footer',
    }
    for (const path in modulePaths)
    {
      const scss = await $fetch<string>(`/builder/scss/${path}.scss`);
      cssString += compileString(scss, { style: 'compressed' }).css;
    }


    // @ts-ignore
    globalThis.concat = (values) => [...values];
    cssString = await postcss([autoprefixer])
      .process(cssString, { from: undefined })
      .then(r => r.css);
    return cssString;
  }
}
