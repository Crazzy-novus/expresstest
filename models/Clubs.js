import mongoose, {Schema} from 'mongoose'


const RoleSchema = mongoose.Schema(
    {
        club_name: {  // primary key what ever created here
            type: String, 
            required: true 
        }, 
        host_dept: {
            type: String,
            required: false
        },
        logo: {
            type: String,
            required: false,
        },
        banner: {
            type : String,
            required: false,
        },
        gallery: {
            type: [String],
            required: false,
            default: []
        },
        about: {
            type: String,
            required: false,
            default: "This is a good club to explore"
        },
        email: {
            type: String,
            required: false,
            default: "",
        },
        organizer: [{
            organizer_id: {
                type: Schema.Types.ObjectId,
                required: false,
                ref: 'User'
            },
            role: {
                type: String,
                required: false,
                default: "Head"
            },
            
            default: {}
        }],
        members: {
            type: [Schema.Types.ObjectId],
            required: false,
            default: [],
            ref: 'User'
        },
        
        club_type: {
            type: String,
            required: true,
            default: "Technical"
        },
        
        members_count: {
            type: Number,
            required: false,
            default: 0
        },
        events_count: {
            type: Number,
            required: false,
            default: 0
        },
        fees: {
            type: Number,
            required: false,
            default: 0
        },
       
    },
    {
        timestamps: true  // To store creared or modifiesd time of the record
    },
);

export default mongoose.model('Club', RoleSchema); // Exporting the model