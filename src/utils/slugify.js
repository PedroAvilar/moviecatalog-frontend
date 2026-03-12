export function slugify(text) {
    if (!text) return 'filme';

    const slug = text
        .toString()
        .normalize("NFD") // Decomposes accented characters
        .replace(/[\u0300-\u036f]/g, "") // Remove Latin accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\p{L}\p{N}-]+/gu, '') // It retains any Unicode letters and numbers
        .replace(/--+/g, '-') // Replaces multiple hyphens with a single hyphen
        .replace(/^-+/, '') // Remove hyphens from the beginning
        .replace(/-+$/, ''); // Remove hyphens from the end

    return slug || 'filme'
}