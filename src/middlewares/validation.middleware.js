export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path.join('.'),
      }));
      return res.status(400).json({ message: 'Validation error', details });
    }

    req.body = value;
    return next();
  };
};

