import { rateLimit } from 'express-rate-limit';
import slowDown from 'express-slow-down';

const loginLimiter = [
    slowDown({
        windowMs: 15 * 60 * 1000,
        delayAfter: 1,
        delayMs: () => 2000, // Chaque requête après la première aura un délai de 2s
    }),
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 5,
        message: {
            success: false,
            error: 'Trop de tentatives de connexion. Veuillez réessayer plus tard',
        },
        legacyHeaders: false, // Désactive les anciens headers pour éviter les conflits avec les headers standards (modernes)
    }),
];

export default loginLimiter;
