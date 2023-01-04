const mongoose = require('mongoose');

const listsSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	lists: [
		{
			// Ex: Wishlist, watchlist, etc
			name: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
		},
	],
});

module.exports = mongoose.model('List', listsSchema);
