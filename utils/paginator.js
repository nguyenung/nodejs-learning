const getPaginatedResults = async (req, res, model, conditions = {}, limit=2) => {
    let currentPage
    if (!req.query.page) {
        currentPage = 1
    } else {
        currentPage = parseInt(req.query.page)
    }
    if (Number.isNaN(currentPage) || currentPage < 1) {
        throw new Error('Invalid page number')
    }

    const totalRecords = await model.countDocuments(conditions)
    const totalPage = Math.ceil(totalRecords / limit)
  
    const items = await model.find(conditions)
      .skip(limit * (currentPage - 1))
      .limit(limit)
  
    return {
        url: `${res.locals.baseUrl}/${req.originalUrl === '/' ? '' : req.originalUrl.split('?')[0].replace(/^\//, '')}`,
        totalPage,
        currentPage,
        items,
        hasPrevPage: currentPage > 1 && totalPage > 1,
        prevPage: currentPage - 1,
        hasNextPage: currentPage * limit < totalRecords,
        nextPage: currentPage + 1,
    }
}

module.exports = getPaginatedResults
