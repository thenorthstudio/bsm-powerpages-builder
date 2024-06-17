export const useViewportBuilder = () =>
{
    const builder = useState('viewport-builder', () => new ViewportBuilder());
    return builder;
}
