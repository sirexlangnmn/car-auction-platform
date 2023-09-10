const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const db = require('../models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Users = db.users;
const Op = db.Sequelize.Op;

exports.checkOwnership = async (req, res) => {
  let carUserUuid = req.body.userUuid
  let encryptedSessionUuid = req.session.user.uuid;
	const bytes = CryptoJS.AES.decrypt(encryptedSessionUuid, JWT_SECRET);
	const originalSessionUuid = bytes.toString(CryptoJS.enc.Utf8);

  if (carUserUuid === originalSessionUuid) {
    responseData = 'yes';
  } else {
    responseData = 'no';
  }
	res.send(responseData);
};

