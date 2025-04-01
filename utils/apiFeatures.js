const APIFeatures = class {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let queryStr = { ...this.queryStr };
    const filterOut = ['sort', 'fields', 'page', 'limit'];
    filterOut.forEach(el => delete queryStr[el]);
    queryStr = JSON.stringify(queryStr).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr);

    this.query.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else this.query.sort('-createdAt');

    return this;
  }

  project() {
    if (this.queryStr.fields) {
      const projectBy = this.queryStr.fields.split(',').join(' ');
      this.query.select(projectBy);
    } else this.query.select('-__v');

    return this;
  }

  pagination() {
    const page = this.queryStr.page || 1;
    const limit = this.queryStr.limit || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);

    return this;
  }
};

module.exports = APIFeatures;
