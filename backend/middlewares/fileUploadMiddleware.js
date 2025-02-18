import multer from "multer";

const storage = multer.diskStorage({});
const upload = multer({ storage });

// Middleware for product images
export const uploadProductImages = upload.array("images", 10);
// Field name: "images", Max file count: 10

// Middleware for avatar image
export const uploadAvatarImage = upload.single("avatar");
// Field name: "avatar"

// Middleware for storeAvatar image
export const uploadStoreAvatar = upload.single("storeAvatar");
// Field name: "storeAvatar"

// Middleware for storeImage image
export const uploadStoreImage = upload.single("storeImage");
// Field name: "storeImage"
