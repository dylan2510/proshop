import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unqiue: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false}
}, 
{
    timestamps: true
});

// custom method for this model
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// custom method, to run before save
userSchema.pre("save", async function(next){

    // if password is not modified, don't run the salting
    if (!this.isModified("password")) {
        next(); // skip below and move on
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);

export default User;