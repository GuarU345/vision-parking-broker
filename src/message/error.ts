export async function handleError(topic: string, data: unknown) {
    console.error(`Error en el tópico ${topic}:`, data);
}