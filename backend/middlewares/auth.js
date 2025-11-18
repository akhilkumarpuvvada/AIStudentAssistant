export const isAuthenticated = (req, res, next) => {
  console.log(req.session.user);
  
  if (!req.session.user) {
    res.status(401).json({ message: "Not Authenticated" });
  }
  next();
};

export const requireRole = (...roles) => {
  return(req, res, next) => {
    const user = req.session.user;
    if(!user) {
      res.status(401).json({ success: false, message: "Please authenticate"})
    }

    if(!roles.includes(user.role)) {
      res.status(403).json({ success: false, message: "Access denied"})
    }
 next();
  }
}