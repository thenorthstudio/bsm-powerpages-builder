export const skipFrame = async () => {
    await new Promise(r => requestAnimationFrame(r));
}

export const skipTime = async (miliseconds: number) => {
    await new Promise(r => setTimeout(r, miliseconds));
}
