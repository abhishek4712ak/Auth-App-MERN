import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        // Check if token exists in cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login again."
            });
        }

        try {
            // Verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_KEY);
            
            // Check if token has required data
            if (!decodedToken || !decodedToken.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token. Please login again."
                });
            }

            // Add user data to request
            req.user = {
                userId: decodedToken.userId,
                email: decodedToken.email,
                name: decodedToken.name,
                isAccountVerified: decodedToken.isAccountVerified
            };

            next();
        } catch (tokenError) {
            // Handle specific JWT errors
            if (tokenError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired. Please login again."
                });
            }
            
            if (tokenError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token. Please login again."
                });
            }

            // Generic token error
            return res.status(401).json({
                success: false,
                message: "Token verification failed. Please login again."
            });
        }
    } catch (error) {
        // Handle any other errors
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
