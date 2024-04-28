import mongoose from 'mongoose'

const RoleSchema = mongoose.Schema(
    {
        role: {  // primary key what ever created here
            type: String, 
            required: true 
        },  
        
    },
    {
        timestamps: true  // To store creared or modifiesd time of the record
    },
);

export default mongoose.model('Role', RoleSchema); // Exporting the model