import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        profileImg: {
            type: String,
            default: ""
        },
        profileThumbImg: {
            type: String,
            default: ""
        },
        role:{
            type:String,
            enum:["user", "admin"],
            default:"user"
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true }
)

//Hash Password
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})

//Compare password 
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Remove password when sending response
userSchema.methods.toJSON= function(){
    const user= this.toObject()
    delete user.password
    return user
}

const User=mongoose.model("User", userSchema)

export default User