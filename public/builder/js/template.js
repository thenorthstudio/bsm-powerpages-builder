document.addEventListener('load', () =>
{
    console.log(window.aaaa);
    const sections = document.querySelectorAll('section');

    sections.forEach(el =>
    {
        el.style.backgroundColor = 'cyan';
    });

    window.aaaa = true;
})
