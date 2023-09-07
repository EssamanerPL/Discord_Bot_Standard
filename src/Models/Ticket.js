import {model, Schema } from 'mongoose';

const ticketSchema = new Schema({
    GuildID: String,
    MemberID: String,
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String,
});

export default model("ticket", ticketSchema)