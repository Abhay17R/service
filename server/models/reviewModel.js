import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { // Jo user review de raha hai
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  professional: { // Jis professional ko review mil raha hai
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment: { // Kis appointment ke liye review hai
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true, // Ek appointment par ek hi review
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// Ek static method banayeinge jo professional ki average rating calculate karega
reviewSchema.statics.calculateAverageRating = async function(professionalId) {
    const stats = await this.aggregate([
        { $match: { professional: professionalId } },
        { $group: {
            _id: '$professional',
            totalReviews: { $sum: 1 },
            averageRating: { $avg: '$rating' }
        }}
    ]);

    try {
        if(stats.length > 0) {
            await mongoose.model('User').findByIdAndUpdate(professionalId, {
                totalReviews: stats[0].totalReviews,
                averageRating: stats[0].averageRating.toFixed(1)
            });
        } else {
             await mongoose.model('User').findByIdAndUpdate(professionalId, {
                totalReviews: 0,
                averageRating: 0
            });
        }
    } catch(err) {
        console.error(err);
    }
};

// Review save/delete hone ke baad average rating ko update karein
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.professional);
});

reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.professional);
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;