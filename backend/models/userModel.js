import {model,Schema} from "mongoose";

const userSchema  = new Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    mobile:String,
    image:String,
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

export default model("User",userSchema);