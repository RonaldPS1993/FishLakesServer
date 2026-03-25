/**
 * Extracts bearer token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string} The token without "Bearer " prefix
 */
export const extractToken = (authHeader) => {
  return authHeader.replace(/^Bearer\s+/i, "");
};
