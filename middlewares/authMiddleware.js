import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authToken = async (req, res, next) => {
const token = req.headers.authorization?.split(' ')[1];
 if (!token) {
    return res.status(401).json({ message: 'Nessun token di autenticazione fornito' });
}

try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
    where: {
        id: decodedToken.userId,
    },
    });

    if (!user) {
    return res.status(401).json({ message: 'Utente non trovato' });
    }

    req.user = user;
    next();
} catch (error) {
    return res.status(401).json({ message: 'Token di autenticazione non valido' });
}
};










// class AuthMiddleware {
//     constructor(authService) {
//       this.authService = authService;
//     }
  
//     authorize = async (req, res, next) => {
//       try {
//         const { authorization } = req.headers;
//         if (!authorization) {
//           return res.status(401).send({ error: 'Unauthorized' });
//         }
//         const [bearer, token] = authorization.split(' ');
//         if (bearer !== 'Bearer') {
//           return res.status(401).send({ error: 'Unauthorized' });
//         }
//         const { isValid } = await this.authService.verifyToken(token);
//         if (!isValid) {
//           return res.status(401).send({ error: 'Unauthorized' });
//         }
//         next();
//       } catch (error) {
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }
//     };
//   }
  
//   export default AuthMiddleware;