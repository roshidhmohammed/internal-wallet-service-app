export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body.data);
    next();
  } catch (error) {
    next(error);
  }
};
