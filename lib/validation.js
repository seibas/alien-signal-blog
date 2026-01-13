/**
 * Input Validation Utilities
 * Provides reusable validation functions for forms and user inputs
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  // Remove control characters and trim
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Validate blog post title
 */
export function validatePostTitle(title) {
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate blog post slug
 */
export function validatePostSlug(slug) {
  const errors = [];
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slug || slug.trim().length === 0) {
    errors.push('Slug is required');
  } else if (!slugRegex.test(slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  } else if (slug.length > 100) {
    errors.push('Slug must be less than 100 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate blog post content
 */
export function validatePostContent(content) {
  const errors = [];

  if (!content || !Array.isArray(content) || content.length === 0) {
    errors.push('Content is required');
  } else {
    // Check if content has at least one text block with content
    const hasContent = content.some(block =>
      block.type === 'text' && block.text && block.text.trim().length > 0
    );

    if (!hasContent) {
      errors.push('Content must have at least one text block');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate question for Alien Translator
 */
export function validateTranslatorQuestion(question) {
  const errors = [];

  if (!question || question.trim().length === 0) {
    errors.push('Question is required');
  } else if (question.length < 5) {
    errors.push('Question must be at least 5 characters');
  } else if (question.length > 500) {
    errors.push('Question must be less than 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate image file
 */
export function validateImageFile(file, maxSizeMB = 5) {
  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { valid: false, errors };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    errors.push('File must be an image (JPEG, PNG, GIF, or WebP)');
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: errors.length === 0 ? 'strong' : errors.length < 3 ? 'medium' : 'weak'
  };
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
