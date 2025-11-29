import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      msg: err.msg,
    }));
    
    return res.status(400).json({ errors: formattedErrors });
  }
  
  next();
};
