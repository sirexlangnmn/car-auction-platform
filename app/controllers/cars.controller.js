const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const db = require('../models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Cars = db.cars;
const Biddings = db.biddings;
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

	let encryptedUuid = req.session.user.uuid;
	const bytes = CryptoJS.AES.decrypt(encryptedUuid, JWT_SECRET);
	const originalUuid = bytes.toString(CryptoJS.enc.Utf8);

	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();

	try {
		let carObjects = {
			brand: req.body.carBrand,
			year: req.body.year,
			type: req.body.type,
			opening_price: req.body.openingPrice,
			price_increment: req.body.priceIncrement,
			current_bid: 0,
			status: 1, // 1 = open for bid
			expiry_date: req.body.expiryDate,
			uuid: uuidV4(),
			user_uuid: originalUuid,
		};

		const cars = await Cars.create(carObjects, { transaction: transaction });
		await transaction.commit();

		responseData = {
			title: 'Success',
			message: 'Auction Created',
			icon: 'success',
		};

	} catch (e) {
		await transaction.rollback();

		responseData = {
			title: 'Warning',
			message: 'Ask the Administrator',
			icon: 'warning',
		};
	}

	res.send(responseData);
};


exports.findCars = async (req, res) => {
	let encryptedUuid = req.session.user.uuid;
	const bytes = CryptoJS.AES.decrypt(encryptedUuid, JWT_SECRET);
	const originalUuid = bytes.toString(CryptoJS.enc.Utf8);

	const condition = {
		status: 1,
		// user_uuid: {
		// 	[Op.not]: originalUuid,
		// },
	};

	const cars = await Cars.findAll({ where: condition })
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || 'Some error occurred while retrieving tutorials.';
		});


	res.send(cars);
};



exports.bidProcess = async (req, res) => {
	let responseData;
	let encryptedSessionUuid = req.session.user.uuid;
	let carCurrentBid = req.body.current_bid;
	let carUuid = req.body.uuid;


	const bytes = CryptoJS.AES.decrypt(encryptedSessionUuid, JWT_SECRET);
	const originalUuid = bytes.toString(CryptoJS.enc.Utf8);

	const condition = {
		status: 1,
		uuid: carUuid,
	};

	const car = await Cars.findAll({ where: condition })
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || 'Some error occurred while retrieving tutorials.';
		});

	let postCurrentBid = Number(carCurrentBid);
	let currentBid = Number(car[0].current_bid);
	let openingPrice = Number(car[0].opening_price);
	let priceIncrement = Number(car[0].price_increment);
	let lastBidPricePlusBidPriceIncrement = postCurrentBid + priceIncrement;


	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();

	if (openingPrice > currentBid) {
		// the initial value of current bid is 0
		// for the first bidder, automatically bid for the amount of the opening price
		try {
			const carObjects = {
				current_bid: openingPrice,
			};
			const condition = { uuid: carUuid };

			const biddingObjects = {
				car_uuid: carUuid,
				user_uuid: originalUuid,
				price: openingPrice
			};

			await Promise.all([
				Cars.update(carObjects, { where: condition, transaction }),
				Biddings.create(biddingObjects, { transaction: transaction }),
			]);
			await transaction.commit();

			responseData = {
				title: 'Success',
				message: 'Bid Success',
				icon: 'success',
				car: car,
				currentBid: openingPrice,
			};

		} catch (e) {
			await transaction.rollback();

			responseData = {
				title: 'Warning',
				message: 'Rollback openingPrice > currentBid',
				icon: 'warning',
			};
		}
	} else {
		if (lastBidPricePlusBidPriceIncrement >= currentBid) {
			// if the last bid price + bid price increment post by the user is greater than
			// the current bid value that come from database
			// can proceed to bidding

			try {
				const carObjects = {
					current_bid: lastBidPricePlusBidPriceIncrement,
				};
				const condition = { uuid: carUuid };

				const biddingObjects = {
					car_uuid: carUuid,
					user_uuid: originalUuid,
					price: lastBidPricePlusBidPriceIncrement
				};

				await Promise.all([
					Cars.update(carObjects, { where: condition, transaction }),
					Biddings.create(biddingObjects, { transaction: transaction }),
				]);
				await transaction.commit();

				responseData = {
					title: 'Success',
					message: 'Bid Success',
					icon: 'success',
					car: car,
					currentBid: lastBidPricePlusBidPriceIncrement,
				};

			} catch (e) {
				await transaction.rollback();

				responseData = {
					title: 'Warning',
					message: 'Rollback lastBidPricePlusBidPriceIncrement >= currentBid',
					icon: 'warning',
				};
			}
		}

		if (currentBid >= lastBidPricePlusBidPriceIncrement) {
			// if the current bid value that come from database is greater than
			// the last bid price + bid price increment post by the user, meaning
			// there is someone quicker to bid

			responseData = {
				title: 'Warning',
				message: 'somebody has bid quicker with this price',
				icon: 'warning',
			};
		}
	}

	res.send(responseData);
};


exports.bidProcessForExpired = async (req, res) => {
	let responseData;
	let encryptedSessionUuid = req.session.user.uuid;
	let carCurrentBid = req.body.current_bid;
	let carUuid = req.body.uuid;


	const bytes = CryptoJS.AES.decrypt(encryptedSessionUuid, JWT_SECRET);
	const originalUuid = bytes.toString(CryptoJS.enc.Utf8);

	const condition = {
		status: 1,
		uuid: carUuid,
	};

	const car = await Cars.findAll({ where: condition })
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || 'Some error occurred while retrieving tutorials.';
		});

	let currentBid = Number(car[0].current_bid);
	let openingPrice = Number(car[0].opening_price);


	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();

	if (openingPrice > currentBid) {
		// the initial value of current bid is 0
		// for the first bidder, automatically bid for the amount of the opening price
		try {
			const carObjects = {
				current_bid: openingPrice,
				status: 3, // 3 = already expired but someone still bid
			};
			const condition = { uuid: carUuid };

			const biddingObjects = {
				car_uuid: carUuid,
				user_uuid: originalUuid,
				price: openingPrice
			};

			await Promise.all([
				Cars.update(carObjects, { where: condition, transaction }),
				Biddings.create(biddingObjects, { transaction: transaction }),
			]);
			await transaction.commit();

			responseData = {
				title: 'Success',
				message: 'Bid Success',
				icon: 'success',
				car: car,
				currentBid: openingPrice,
			};

		} catch (e) {
			await transaction.rollback();

			responseData = {
				title: 'Warning',
				message: 'Rollback openingPrice > currentBid',
				icon: 'warning',
			};
		}
	}

	res.send(responseData);
};


exports.closeListing = async (req, res) => {
	let responseData;
	let encryptedSessionUuid = req.session.user.uuid;
	let carUuid = req.body.uuid;


	const bytes = CryptoJS.AES.decrypt(encryptedSessionUuid, JWT_SECRET);
	const originalUuid = bytes.toString(CryptoJS.enc.Utf8);

	const condition = {
		status: 1,
		uuid: carUuid,
	};

	const car = await Cars.findAll({ where: condition })
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || 'Some error occurred while retrieving tutorials.';
		});



	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();


	try {
		const carObjects = {
			admin_uuid: originalUuid,
			status: 4, // 4 = close by admin
		};
		const condition = { uuid: carUuid };

		await Promise.all([
			Cars.update(carObjects, { where: condition, transaction }),
		]);
		await transaction.commit();

		responseData = {
			title: 'Success',
			message: 'Close Listing Success',
			icon: 'success',
			car: car,
		};

	} catch (e) {
		await transaction.rollback();

		responseData = {
			title: 'Warning',
			message: 'Rollback',
			icon: 'warning',
		};
	}


	res.send(responseData);
};