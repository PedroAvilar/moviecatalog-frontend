export function slugify(text) {
    if (!text) return 'filme';

    const slug = text
        .toString()
        .normalize("NFD") // Decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos latinos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/[^\p{L}\p{N}-]+/gu, '') // Mantém qualquer letra unicode e números
        .replace(/--+/g, '-') // Substitui múltiplos hífens por um único hífen
        .replace(/^-+/, '') // Remove hífens do início
        .replace(/-+$/, ''); // Remove hífens do final

    return slug || 'filme'
}