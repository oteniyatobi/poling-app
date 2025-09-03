/**
 * Validation middleware for poll-related requests
 * Following the established patterns from run-b-chat-only API
 */

const validatePoll = (req, res, next) => {
  const { question, description, options } = req.body;
  const errors = [];

  // Question validation
  if (!question) {
    errors.push('Question is required');
  } else if (typeof question !== 'string') {
    errors.push('Question must be a string');
  } else if (question.trim().length === 0) {
    errors.push('Question cannot be empty');
  } else if (question.length > 200) {
    errors.push('Question must be less than 200 characters');
  }

  // Description validation (optional)
  if (description && typeof description !== 'string') {
    errors.push('Description must be a string');
  } else if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  // Options validation
  if (!options || !Array.isArray(options)) {
    errors.push('Options must be an array');
  } else if (options.length < 2) {
    errors.push('At least 2 options are required');
  } else if (options.length > 10) {
    errors.push('Maximum 10 options allowed');
  } else {
    options.forEach((option, index) => {
      if (!option || typeof option !== 'object') {
        errors.push(`Option ${index + 1} must be an object`);
      } else if (!option.text) {
        errors.push(`Option ${index + 1} text is required`);
      } else if (typeof option.text !== 'string') {
        errors.push(`Option ${index + 1} text must be a string`);
      } else if (option.text.trim().length === 0) {
        errors.push(`Option ${index + 1} text cannot be empty`);
      } else if (option.text.length > 100) {
        errors.push(`Option ${index + 1} text must be less than 100 characters`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please fix the following errors:',
      errors
    });
  }

  next();
};

const validateVote = (req, res, next) => {
  const { optionId } = req.body;
  const errors = [];

  if (!optionId) {
    errors.push('Option ID is required');
  } else if (typeof optionId !== 'number' && !Number.isInteger(parseInt(optionId))) {
    errors.push('Option ID must be a valid integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please fix the following errors:',
      errors
    });
  }

  next();
};

const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Page must be a positive integer'
    });
  }
  
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Limit must be between 1 and 100'
    });
  }
  
  next();
};

module.exports = {
  validatePoll,
  validateVote,
  validatePagination
};
