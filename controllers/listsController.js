const User = require('../models/userModel');
const List = require('../models/listsModel');
const crypto = require('crypto');
const ErrorHandler = require('../utils/ErrorHandler');
const CatchAsyncErrors = require('../utils/CatchAsyncErrors');

/**
 *
 * @param {string} user
 * Takes a user id and returns all listsType related to user
 */
exports.getListById = async (req, res, next) => {
	try {
		const list = await List.findOne({ user: req.body.user });
		res.status(200).json(list).end();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.createListCategory = async (req, res, next) => {
	try {
		const list = await List.create(req.body);
		res.json(list).end();
	} catch (error) {
		res.json({ error: error.message });
	}
};

/**
 *
 * @param {_id} user
 * @param {String} listName
 * @param {Array} content
 * ex:
 *
 *
 * @example
 * {
 * 	"user": "63b406a3d56be1e3a012c92a",
 * 	"listName": "Read Later",
 * 	"content": [
 * 		{
 * 		"comicName": "...",
 * 		"comicDescription": "...",
 * 		"chaptersRead": Number,
 * 		"totalChapters": Number },
 * 	],
 *		...
 * }*/
exports.addNewListType = async (req, res, next) => {
	try {
		const list = await List.findOne({ user: req.body.user });
		const newList = [
			...list.listsType,
			{ listName: req.body.listName, content: req.body.content },
		];
		list.listsType = newList;
		await list.save();

		res.json(list).end();
	} catch (error) {
		res.json({ error: error.message });
	}
};

/**
 *
 * Description: following actions can be performed by using id of listName :
 *
 * `1. Add new comic to under listName`
 *
 * `2. Edit listName means can edit name of list eg. watchlist-> readlist`
 *
 * @example
 * {
 * 	"_id": "...",
 * 	"user": "...",
 * 	"listsType": [
 * 		{
 * 			// new listName or new contents of list
 * 			"listName": "Watch later",
 * 			"content": [
 * 				{
 * 					"comicName": "...",
 * 					"comicDescription": "...",
 * 					"chaptersRead": 0,
 * 					"totalChapters": 0,
 * 					"_id": "..."
 * 				},
 * 				...
 * 			],
 * 			"_id": "..."
 * 		},
 * 		...
 * 	],
 * }
 */
exports.addComicToListId = async (req, res, next) => {
	try {
		const user = await List.findOne({ user: req.body.user });

		for (let i = 0; i < user.listsType.length; i++) {
			if (String(user.listsType[i]._id) == req.body.listType._id) {
				console.log('FOUND IT');
				console.log(user.listsType[i]);
				user.listsType[i].content = [
					...user.listsType[i].content,
					req.body.listType.listContent,
				];
				break;
			}
		}
		await user.save();

		res.json(user).end();
	} catch (error) {
		res.json({ error: error.message });
	}
};
