export const authorize = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            return res.status(403).json( { error : "Accesso non autoprizzato"})
        }
        next()
    }
}