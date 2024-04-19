// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'PasswordSegreta123321';

export const roles = {
  ADMIN : 'admin',
  EDITOR : 'editor',
  USER : 'user',
};
export const authToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Nessun token di autenticazione fornito' });
  }


  try {
    const decodedToken = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], ignoreExpiration: false });
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Utente non trovato' });
    }

    // Aggiungi il ruolo dell'utente alla richiesta (req) per essere utilizzato nei middleware successivi
    req.user = user;

    // Verifica il ruolo dell'utente e autorizza l'accesso in base ai ruoli consentiti
    if (user.role === roles.ADMIN || user.role === roles.EDITOR || user.role === roles.USER)  {
      // Se l'utente è admin o editor, consenti l'accesso
      next();
    } else {
      // Altrimenti, nega l'accesso
      return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
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