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

const createImageUrl = (req, res, next) => {
  const imageUrl = `http://localhost:8080${req.file.filename}`;
  req.body.picture = imageUrl;
};

module.exports = {
  aliasNewestAdittions,
  addEditDate,
  createImageUrl,
};
