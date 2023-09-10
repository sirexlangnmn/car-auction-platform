const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const db = require('../models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Users_accounts = db.users_accounts;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    let responseData;

    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res.status(200).send({
                message: errors.array(),
            });
        }
    } catch (error) {
        return res.status(400).json({
            error: {
                message: error,
            },
        });
    }

    const loginEmailAddress = req.body.loginEmailAddress;
    const loginPassword = req.body.loginPassword;

    let condition = loginEmailAddress ? { email_address: loginEmailAddress } : null;

    const userAccount = await Users_accounts.findAll({ where: condition })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err.message || 'Some error occurred while retrieving tutorials.';
        });


    if (userAccount.length > 0) {
        const verified = bcrypt.compareSync(loginPassword, userAccount[0].password);

        if (verified) {
            let session = req.session;
            let userAccountUuid = userAccount[0].uuid
            let condition = userAccountUuid ? { uuid: userAccountUuid } : null;
            const users = await Users.findAll({ where: condition })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    return err.message || 'Some error occurred while retrieving tutorials.';
                });

            const usersAccounts = await Users_accounts.findAll({ where: condition })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    return err.message || 'Some error occurred while retrieving tutorials.';
                });

                const cipherUuid = CryptoJS.AES.encrypt(users[0].uuid, JWT_SECRET).toString();

                let sessionUser = {
                    full_name: users[0].full_name,
                    uuid: cipherUuid,
                    type: usersAccounts[0].type,
                };

                session.user = sessionUser;

                responseData = {
                    message: 'Login Success',
                };
        } else {
            responseData = {
                message: 'Kindly check email and password (wrong password)',
            };
        }
    } else {
        responseData = {
            message: 'Kindly check email and password (wrong email)',
        };
    }

    res.send(responseData);
};
