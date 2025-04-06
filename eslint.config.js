import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// Mimique les variables CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crée une instance de FlatCompat pour gérer les anciennes configurations
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    // Utiliser compat.extends pour inclure des configurations externes comme si tu utilisais un fichier .eslintrc
    //...compat.extends('eslint-config-my-config'), // Remplacer "eslint-config-my-config" par ta propre config ou celle que tu veux étendre

    // Ajoute des configurations personnalisées
    {
        languageOptions: {
            globals: {
                console: 'readonly', // Définir 'console' comme global pour éviter les warnings
            },
        },
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }], // Autorise console.warn et console.error, mais avertit pour console.log
        },
    },
];
