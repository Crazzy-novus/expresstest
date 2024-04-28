import mongoose, {Schema} from 'mongoose'


const ApplicationFormSchema = new mongoose.Schema({
    rollno: {
        type: String,
        required: true
    },
    admissionNo: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    UserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ClubId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Club'
    },
    status: {
        type: String,
        default: 'pending',
        required: true
    }
    },
    {
        timestamps: true  // To store creared or modifiesd time of the record
    });

    export default mongoose.model('Application', ApplicationFormSchema); // Exporting the model