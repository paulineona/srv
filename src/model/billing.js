const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Billing = new Schema({

    billing_cycle: {
        type: Number
    },
    billing_month: {
        type: String
    },
    amount: {
        type: Number,
        default: 0
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    last_edited: {
        type: String
    },
    account: {
        account_name: {
            type: String
        },
        date_created: {
            type: Date
        },
        is_active: {
            type: String
        },
        last_edited: {
            type: String
        },
        customer: {
            first_name: {
                type: String
            },
            last_name: {
                type: String
            },
            address: {
                type: String
            },
            status: {
                type: String
            },
            date_created: {
                type: Date
            },
            last_edited: {
                type: String
            }
        }
    }
},
    {
        timesstamps: true
    }
);

const BillingModel = mongoose.model('Billing', Billing);

module.exports = BillingModel;