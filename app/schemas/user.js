const Schema = require('mongoose').Schema;
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  password: String,
  // 0: normal user
  // 1: verified user
  // 10: admin
  // 20: super admin
  role: {
    type: Number,
    default: 0,
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now(),
    },
    updateAt: {
      type: Date,
      default: Date.now(),
    },
  },
});

UserSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
    });
  });
  next();
});

UserSchema.statics = {
  fetch(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById(id, db) {
    return this
      .findById({_id: id})
      .exec(cb);
  },
};

UserSchema.methods = {
  comparePassword(_password, cb) {
    bcrypt.compare(_password, this.password, (err, isMatch) => {
      if (err) return cb(err);

      cb(null, isMatch);
    });
  }
}


module.exports = UserSchema;
