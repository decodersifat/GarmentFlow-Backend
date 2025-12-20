const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;
  
  return { skip, limit: limitNum, page: pageNum };
};

const buildQuery = (filters = {}) => {
  const query = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = value;
    }
  });
  
  return query;
};

const buildSearchQuery = (searchFields = [], searchTerm = '') => {
  if (!searchTerm || searchFields.length === 0) return {};
  
  return {
    $or: searchFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }))
  };
};

module.exports = { paginate, buildQuery, buildSearchQuery };
