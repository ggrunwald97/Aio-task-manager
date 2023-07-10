const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error('Email is invalid')
      }
    },
    trim: true,
    lowercase: true,
  },
  age: {
    type: Number,
    validate(number) {
      if (number < 0 ) {
        throw new Error('Age must be greater than 0.')
      }
    }
  },
  password: {
    type: String,
    validate(password) {
      if ((password.length <= 6) || (password.toLowerCase().includes('password'))) {
        throw new Error('Password is invalid')
      }
    },
    // required: true,
    trim: true,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

// before saving, hash the plaintext password
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    // if the password was modified, then replace it with a hashed version of the password.
    user.password = await bcrypt.hash(user.password, 8)
  }

  next();
})

// after deleting user, delete tasks associated with user
userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({owner: user._id})
  next;
})

// method available on individual instance of 'user'
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token;
}

// virtual relationship between tasks / users
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// toJSON method gets called automatically when sending back a user as a response.
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject;
}

// method available on the User
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email })
  if (!user) {
    throw new Error('Unable to log in.')
  }

  const isMatch = (await bcrypt.compare(password, user.password))

  if (!isMatch) {
    throw new Error('Unable to log in.')
  }

  return user;
}

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
