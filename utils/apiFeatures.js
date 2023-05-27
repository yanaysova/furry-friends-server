class APIFeatures {
  constructor(query, queryString, collation) {
    this.query = query;
    this.queryString = queryString;
    this.collation = collation;
  }

  filter() {
    //Filtering
    const queryObject = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => delete queryObject[element]);

    //Removes empty query fields
    for (const element in queryObject) {
      if (queryObject[element] === "") {
        delete queryObject[element];
      }
    }

    //Regex enabled fields
    [
      "firstName",
      "lastName",
      "email",
      "phoneNum",
      "name",
      "breed",
      "color",
    ].forEach((field) => {
      if (queryObject[field]) {
        queryObject[field] = { $regex: queryObject[field], $options: "i" };
      }
    });

    //Excludes inactive pets
    if (queryObject.includeInactive === "false") {
      queryObject.adoptionStatus = { $ne: "inactive" };
    }

    delete queryObject.includeInactive;

    //Filtering with operators
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  applyCollation() {
    if (this.collation) {
      this.query = this.query.collation(this.collation);
    }
    return this;
  }
}

module.exports = APIFeatures;
