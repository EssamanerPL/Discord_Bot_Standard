import {mongoose } from 'mongoose';

const ticketSchema = new mongoose.Schema({
    GuildID: String,
    MemberID: String,
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String,
});

const ServiceModel = mongoose.model('services', ticketSchema);

export default ServiceModel;