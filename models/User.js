import mongoose, {Schema} from 'mongoose'

const UserSchema = mongoose.Schema(
    { 
        email: {
            type:String,
            required: true,
            unique: true
        },
        password: {
            type:String,
            required: true
        },
        profileImage: {
            type: String,
            required: false,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        roles:{ 
            type: [Schema.Types.ObjectId], // type of primary key is objectId and it is forign key of Role model
            required: true,
            ref: 'Role'
         }, // refering to Role model
        name: {
            type: String,
            required: false,
            default: ""
        },
        headTag: {
            type: String,
            required: false,
            maxLength: 120,
            default: "Student"
        },
        
        branch: {
            type: String,
            required: false,
            default: "Engineering"
        },
        year: {
            type: Number,
            required: false,
            default: 0
        },
        skills: {
            type: [String],
            required: false,
            default: []
        },
        about: {
            type: String,
            required: false,
            default: "I am a student of Engineering"
        },
        github_link: {
            type: String,
            required: false,
            default: ''
        },
        linkedin_link: {
            type: String,
            required: false,
            default: ''
        },
        other_link: {
            type: String,
            required: false,
            default: ''
        },
        organizer_in: {
            type: [Schema.Types.ObjectId],
            required: false,
            default: [],
            ref: 'Club'
        },
        staff_in: {
            type: [Schema.Types.ObjectId],
            required: false,
            default: [],
            ref: 'Club'
        },
        member_in: {
            type: [Schema.Types.ObjectId],
            required: false,
            default: [],
            ref: 'Club'
        },
        registered_events: {
            type: [Schema.Types.ObjectId],
            required: false,
            default: [],
            ref: 'Event'
        },

    },
    {
        timestamps: true  // To store creared or modifiesd time of the record
    }
);
export default mongoose.model('User', UserSchema); // Exporting the model