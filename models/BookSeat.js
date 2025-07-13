const mongoose = require('mongoose');

const bookSeatSchema = new mongoose.Schema({
    fullName: {type:String, required:true},
    city: {type:String, required:true},
    mobile: {type:String, required:true},
    isTeamMember: {type:String, enum:["yes", "no"], required:true},
    memberId: {type: String, required: function () {
    return this.isTeamMember === 'yes';
  }}
}, {
    timestamps:true,
});

module.exports = mongoose.model('BookSeat', bookSeatSchema);