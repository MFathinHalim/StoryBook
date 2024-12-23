import ImageKit from "imagekit";

// Initialize ImageKit instance with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.publicImg || "",
  privateKey: process.env.privateImg || "",
  urlEndpoint: process.env.urlEndpoint || "", // e.g., "https://ik.imagekit.io/your_imagekit_id"
});

export default imagekit;