const aliasNewestAdittions = (req, res, next) => {
  req.query.limit = "3";
  req.query.page = "1";
  req.query.fields = "name,gender,age,breed,picture,id";
  next();
};

const addEditDate = (req, res, next) => {
  req.body.editedAt = Date.now();
  next();
};

module.exports = {
  aliasNewestAdittions,
  addEditDate,
};
