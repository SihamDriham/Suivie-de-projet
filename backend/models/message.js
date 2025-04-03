    const mongoose = require('mongoose')
    const {model,Schema} = mongoose

    const message = new Schema(
        {
            contenuM: {
            type: String,
            required: true
            },

            conversation: {
            type: Schema.Types.ObjectId,
            ref: 'conversation',
            required: true
            },

            user: { 
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true
            },

            statut: { 
                type: Schema.Types.ObjectId,
                ref: 'Statut', 
                required: true
            }

        },
        {
            timestamps: true,
        }
    )

    const Message = model('Message',message)
    module.exports = Message