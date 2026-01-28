import { Router, Request, Response } from 'express';
import { getAuth } from '../config/firebase';

const router = Router();

// Register user (handled by Firebase client SDK, but we can set custom claims here)
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, displayName, role = 'citizen' } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // In production, user creation should happen via Firebase client SDK
        // This endpoint is just for setting custom claims if needed
        res.json({
            message: 'Please use Firebase client SDK for registration',
            note: 'Registration handled on the frontend'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Set user role (admin only)
router.post('/set-role', async (req: Request, res: Response) => {
    try {
        const { uid, role } = req.body;

        if (!uid || !role) {
            return res.status(400).json({ error: 'UID and role required' });
        }

        if (!['citizen', 'authority', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        await getAuth().setCustomUserClaims(uid, { role });

        res.json({ success: true, message: 'Role updated successfully' });
    } catch (error) {
        console.error('Set role error:', error);
        res.status(500).json({ error: 'Failed to set role' });
    }
});

// Verify token (for testing)
router.post('/verify', async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }

        const decodedToken = await getAuth().verifyIdToken(token);

        res.json({
            success: true,
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                role: decodedToken.role || 'citizen'
            }
        });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
