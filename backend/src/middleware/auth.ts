import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../config/firebase';

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        role?: string;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || 'citizen',
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

export const authorizeRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!allowedRoles.includes(req.user.role || 'citizen')) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        next();
    };
};
