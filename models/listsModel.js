const mongoose = require('mongoose');

const listsSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	listsType: [
		{
			// Ex: Wishlist, watchlist, etc
			listName: {
				type: String,
				required: true,
				unique: true,
			},
			content: [
				{
					comicName: {
						type: String,
						required: true,
					},
					comicDescription: {
						type: String,
					},
					chaptersRead: {
						type: Number,
						required: true,
					},
					totalChapters: {
						type: Number,
						required: true,
					},
					lastTimeRead: {
						type: Date,
						required: true,
						default: Date.now,
					},
				},
			],
		},
	],
});

module.exports = mongoose.model('List', listsSchema);
