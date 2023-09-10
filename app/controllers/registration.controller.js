const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
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

    const email_address = req.body.emailAddress;
    let condition = email_address ? { email_address: email_address } : null;

    const existingUser = await Users_accounts.findAll({ where: condition })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err.message || 'Some error occurred while retrieving tutorials.';
        });

    if (existingUser.length > 0) {
        responseData = {
            message: 'email already in use',
        };
    }

    let agreeInTermsAndConditions = req.body.agreeInTermsAndConditions;
    console.log('agreeInTermsAndConditions: ', agreeInTermsAndConditions);
    if (!agreeInTermsAndConditions) {
        console.log('agreeInTermsAndConditions NO');
        responseData = {
            message: 'must agree in terms and conditions',
        };
    }

    if (existingUser.length === 0 && agreeInTermsAndConditions) {
        let session = req.session;
        let uuid = uuidV4();
        let verificationCode = Math.floor(Math.random() * 900000) + 100000;

        let password = req.body.password;
        const saltRounds = 10;

        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });


        const sequelize = sequelizeConfig.sequelize;
        const transaction = await sequelize.transaction();

        try {
            let usersObjects = {
                full_name: req.body.fullName,
                status: 1,
                type: 1,
                uuid: uuid,
            };

            let usersAccountsObjects = {
                contact_number: req.body.contactNumber,
                email_address: req.body.emailAddress,
                password: hashedPassword,
                type: 1, // normal user
                uuid: uuid,
            };

            const user = await Users.create(usersObjects, { transaction: transaction });
            await Users_accounts.create(usersAccountsObjects, { transaction: transaction });
            await transaction.commit();

            session.verification_code = verificationCode;
            session.registration_uuid = uuid;
            session.registration_email_address = req.body.emailAddress;

            responseData = {
                message: 'account has been created',
                uuid: uuid,
                verification_code: verificationCode,
                email_address: req.body.emailAddress,
            };

        } catch (e) {
            await transaction.rollback();

            responseData = {
                message: 'rollback',
            };
        }

    }

    res.send(responseData);
};
