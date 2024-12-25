const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['movie', 'tv', 'anime'],
        required: true
    },
    tmdbId: {
        type: String,
        required: true
    },
    imdbId: String,
    overview: String,
    posterPath: String,
    backdropPath: String,
    releaseDate: Date,
    rating: Number,
    genres: [String],
    downloadLinks: {
        '480p': String,
        '720p': String,
        '1080p': String
    },
    streamingSources: {
        gold: String,
        diamond: String
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

contentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Content', contentSchema);
