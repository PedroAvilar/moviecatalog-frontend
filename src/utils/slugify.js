export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/[^\w-]+/g, '') // Remove caracteres especiais
        .replace(/--+/g, '-') // Substitui múltiplos hífens por um único hífen
        .replace(/^-+/, '') // Remove hífens do início
        .replace(/-+$/, ''); // Remove hífens do final
}