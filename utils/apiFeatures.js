const APIFeatures = class {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const filterStr = { ...this.queryStr };
    const excludedFields = ['sort', 'fields', 'limit', 'page'];
    excludedFields.forEach(el => delete filterStr[el]);
    this.query.find(filterStr);

    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else this.query.sort('-createdAt');

    return this;
  }
  projection() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query.select(fields);
    } else this.query.select('-__v');

    return this;
  }
  pagination() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);

    return this;
  }
};

module.exports = APIFeatures;
