exports.attachUser = (req, res, next) => {
  res.locals.user = req.session?.user || null;
  res.locals.csrfToken = req.csrfToken();
  next();
};