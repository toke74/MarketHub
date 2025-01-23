import multer from "multer";

const storage = multer.diskStorage({});

// Middleware for product images
export const uploadProductImages = multer({ storage }).array("images", 10);
// Field name: "images", Max file count: 10

// Middleware for avatar image
export const uploadAvatarImage = multer({ storage }).single("avatar");
// Field name: "avatar"
