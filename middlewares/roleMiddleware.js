export const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole){
            // utente non autenticato o ruolo non definito
            console.error("utente non autneticato o ruolo non specificato");
            return res.status(401).json({ error : "utente non specificato o ruolo non definito"})
        }


        if(!roles.includes(userRole)) {
            console.log ("Accesso consentito per il ruolo ", userRole )
            next()
        }else{
            console.error("Accesso negatp per il ruolo di ", userRole);
            return res.status(403).json({ error: `Accesso non autorizzato per il ruolo '${userRole}'`});
        }
    }
}