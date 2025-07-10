export function goBack() {
    window.history.back();
}

/**
 * Navigue vers le chemin spécifié.
 *
 * @param path - Le chemin de navigation.
 */
export function goTo(path: string) {
    window.location.href = path;
}
