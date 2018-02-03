const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
  movie: {
    type: ObjectId,
    ref: 'Movie',
  },
  from: {
    type: ObjectId,
    ref: 'User',
  },
  to: {
    type: ObjectId,
    ref: 'User',
  },
  reply: [
    {
      from: { type: ObjectId, ref: 'User' },
      to: { type: ObjectId, ref: 'User' },
      content: String,
    },
  ],
  content: String,
  meta: {
    createAt: {
      type: Date,
      default: new Date(),
    },
    updateAt: {
      type: Date,
      default: new Date(),
    },
  },
});

CommentSchema.pre('save', (next) => {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.updateAt = Date.now();
  }
  next();
});

CommentSchema.statics = {
  fetch(cb) {
    this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById(id, cb) {
    this
      .findOne({ '_id': id })
      .exec(cb);
  },
}

module.exports = CommentSchema;
