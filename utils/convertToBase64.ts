export const convertToBase64 = async (file: File): Promise<string> => {
  const reader = new FileReader();
  
  try {
    const imageData = await new Promise<string>((resolve, reject) => {
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      reader.readAsDataURL(file);
    });
    
    return imageData;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    return "";
  }
};
