window.addEventListener('load', () =>
{
  if (document.querySelector('main.in-builder'))
    return;

  const moduleName = '.c-form';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    paisProvinciaSetup(root);

    const store = {
      errorList: root.querySelector('.validation-summary'),
      inputs: {
        text: root.querySelectorAll('td.text'),
        select: root.querySelectorAll('td.picklist-cell'),
        datetime: root.querySelectorAll('td.datetime'),
        checkbox: root.querySelectorAll('td.checkbox-cell'),
        submit: root.querySelector('.actions input[type="button"]'),
      }
    };

    /* Focus / blur */
    store.inputs.text.forEach((td) =>
    {
      const control = td.querySelector('input.form-control');
      if (control)
      {
        control.addEventListener('focus', () =>
        {
          td.classList.remove('is-error');
          td.classList.add('is-open');
        });
        control.addEventListener('blur', () =>
        {
          const hasValue = control.value;
          td.classList.toggle('is-open', hasValue);
        });
      }
    })

    /* Error handling */
    const inputs = [...store.inputs.select, ...store.inputs.datetime];
    inputs.forEach(td =>
    {
      const control = td.querySelector('input.form-control');
      if (control) control.addEventListener('focus', () =>
        td.classList.remove('is-error')
      );
    });
    store.inputs.checkbox.forEach(td =>
    {
      const input = td.querySelector('input[aria-required="true"]');
      if (input) input.addEventListener('change', () =>
        td.classList.toggle('is-error', !input.checked)
      );
    });
    store.inputs.submit.addEventListener('click', () =>
    {
      // Stop scroll to top:
      requestAnimationFrame(() => window.scrollTo(0, window.scrollY));
      setTimeout(() =>
      {
        // Summary:
        store.errorList.querySelectorAll('li a').forEach(er =>
        {
          const ref = er.getAttribute('referencecontrolid');
          if (ref && ref != '')
          {
            let label = root.querySelector('label[id="' + ref + '_label_fake"]');
            if (!label) label = root.querySelector('label[id="' + ref + '_label"]');
            if (label)
            {
              const td = label.closest('td');
              if (td) td.classList.add('is-error');
            }
          }
        });
          
        // If form some reason checkboxes are not included in the summary:
        store.inputs.checkbox.forEach(td =>
        {
          const input = td.querySelector('input[aria-required="true"]');
          if (input) td.classList.toggle('is-error', !input.checked);
        });
      }, 100)
    });


    // Datetime picker:
    store.inputs.datetime.forEach(td =>
    {
      const input = td.querySelector('.datetimepicker>input');
      if (input) input.addEventListener('input', e =>
      {
        const date = input.value;
        const dayRegex = (/^(\d\d)(\d)$/).exec(date);
        const monthRegex = (/^(\d\d)\/?(\d\d)(\d)$/).exec(date);
        
        if (monthRegex) input.value = monthRegex[1]+'/'+monthRegex[2]+'/'+monthRegex[3];
        else if (dayRegex) input.value = dayRegex[1]+'/'+dayRegex[2];
      });
      const btn = td.querySelector('.datetimepicker>span.btn');
      if (btn) btn.parentElement.removeChild(btn);
    });
  })
});


const paisProvinciaSetup = (root) =>
{
  const lang = document.querySelector('html').getAttribute('lang').slice(0, 2);
  const store = ['alg_pais', 'alg_provincia'].map(id =>
  {
    const input = root.querySelector('.lookup input[id="'+id+'"]');
    if (input)
    {
      const tr = input.closest('tr');
      const label = tr.querySelector('.table-info label');
      return { id, tr, label, input }
    }
  });


  const createFakeSelect = (storeField, values) =>
  {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 2;
    td.rowSpan = 1;
    td.classList.add('clearfix', 'cell', 'picklist-cell');
    tr.appendChild(td);
    tr.appendChild(document.createElement('td'));

    const tableInfo = document.createElement('div');
    tableInfo.classList.add('table-info', 'required');

    const label = document.createElement('label');
    label.setAttribute('for', storeField.id+'_fake');
    label.setAttribute('id', storeField.id+'_label_fake');
    label.classList.add('field-label');
    label.innerHTML = storeField.label.innerHTML;
    tableInfo.appendChild(label);
    td.appendChild(tableInfo);

    const control = document.createElement('div');
    control.classList.add('control');
    td.appendChild(control);

    const select = document.createElement('select');
    select.setAttribute('id', storeField.id+'_fake');
    select.classList.add('form-control', 'form-select', 'picklist');
    select.addEventListener('change', e =>
    {
      const value = e.target.value;
      storeField.input.value = value;
      storeField.input.setAttribute('value', value);
      storeField.input.dispatchEvent(new Event('change', { target: storeField.input }));
    });
    control.appendChild(select);

    const defaultOption = document.createElement('option');
    defaultOption.setAttribute('selected', 'selected');
    defaultOption.selected = true;
    defaultOption.value = '';
    defaultOption.innerHTML = {
      es: 'Seleccionar',
      ca: 'Seleccionar',
      en: 'Select',
    }[lang];
    select.appendChild(defaultOption);
    values.forEach(value =>
    {
      const option = document.createElement('option');
      option.value = value.id;
      option.innerHTML = value.name[lang] || value.name.en;
      select.appendChild(option);
    });
    
    storeField.tr.parentNode.insertBefore(tr, storeField.tr.nextSibling);
    storeField.tr.style.display = 'none';

    storeField.fake = { tr, label, select }
  }

  // País:
  if (store[0]) createFakeSelect(store[0], window.paisesFetch);

  // Provincia:
  if (store[1])
  {
    createFakeSelect(store[1], []);
    store[0].fake.select.addEventListener('change', e =>
    {
      const value = e.target.value;
      if (value && value != '')
      {
        store[1].fake.select.innerHTML = '';
        requestAnimationFrame(() =>
        {
          const defaultOption = document.createElement('option');
          defaultOption.setAttribute('selected', 'selected');
          defaultOption.selected = true;
          defaultOption.value = '';
          defaultOption.innerHTML = {
            es: 'Seleccionar',
            ca: 'Seleccionar',
            en: 'Select',
          }[lang];
          store[1].fake.select.appendChild(defaultOption);
          window.provinciasFetch.filter(p => p.paisId == value).forEach(p =>
          {
            const option = document.createElement('option');
            option.value = p.id;
            option.innerHTML = p.name[lang] || p.name.en;
            store[1].fake.select.appendChild(option);
          });
          store[1].fake.select.value = '';

          store[1].fake.select.dispatchEvent(new Event('change', { target: store[1].fake.select }));
          if (store[1].fake.select.children.length) store[1].fake.tr.style.display = '';
          else store[1].fake.tr.style.display = 'none';
        })
      }
    });
  }
}
