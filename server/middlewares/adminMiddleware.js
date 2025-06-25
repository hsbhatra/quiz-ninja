export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // allow request to proceed
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};