import axios from "axios";

const imageUpload= async (imageFile)=>{
    const formData= new FormData();
    formData.append('image', imageFile);

    try{
        const response= await axios.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`, formData
        );
        return response.data.data.display_url;
    } catch(error) {
        console.error('Image upload failed:',error);
        throw new Error('Failed to upload image')
    }
};

export default imageUpload;