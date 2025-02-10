const paginateQuery = async (model, query, page = 1, limit = 10, sort = { createdAt: -1 }) => {
    page = Math.max(1, Number(page));
    limit = Math.max(1, Number(limit));
  
    const [data, totalDocuments] = await Promise.all([
      model.find(query).sort(sort).skip((page - 1) * limit).limit(limit),
      model.countDocuments(query),
    ]);
  
    return {
      data,
      pagination: {
        totalDocuments,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
      },
    };
  };
  
  module.exports = paginateQuery;
  