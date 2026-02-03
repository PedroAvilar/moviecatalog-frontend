import noProfile from '../assets/no-profile.png';

export function getProfileUrl(profilePath, size = 'w185') {
    if (!profilePath) {
        return noProfile;
    }
    return `https://image.tmdb.org/t/p/${size}${profilePath}`;
}