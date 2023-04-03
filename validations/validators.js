const isValidId = function (id) {
    return mongoose.Types.ObjectId.isValid(id);
  };

  module.exports.isValidId = isValidId