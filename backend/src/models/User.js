import mongoose from "mongoose";
import bcrypt from  "bcryptjs";
const schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const userSchema=new schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    bio:{
        type:String,
        default:"",
    },
    profilePic:{
        type:String,
        default:"",
    },
    nativeLanguage:{
        type:String,
        default:"",
    },
    learningLanguage:{
        type:String,
        default:"",
    },
    location:{
        type:String,
        default:"",
    },
    isOnboarded:{
        type:Boolean,
        default:false,
    },

    friends:[{
        type:ObjectId,
        ref:"User",
    }]
},{timestamps:true});

// pre hook
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    try {
        const salt=await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.matchPassword=async function(enteredpassword){
    const ispasswordcorrect=await bcrypt.compare(enteredpassword,this.password);
    return ispasswordcorrect;
};

const User=mongoose.model("User",userSchema);

export default User;