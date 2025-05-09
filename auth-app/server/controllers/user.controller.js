import User from "../models/user.model.js";


//get user data
export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;

        const user = await User.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        return res.json({
            success: true, 
            message: "User data fetched successfully", 
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerifieds
            }
        });

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}