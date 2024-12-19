import screenshot from 'screenshot-desktop';
import axios from 'axios'

async function captureScreen() {
    const img = await screenshot({ format: 'jpeg' });  
    return img;
}

async function sendToServer(imageBuffer: Blob) {
    const formData = new FormData();
    formData.append('file', imageBuffer, 'screenshot.jpg');

    try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
            // headers: formData.getHeaders(),
        });
        if (response.status === 200) {
            console.log("Screenshot uploaded successfully.");
        } else {
            console.log("Error uploading screenshot.");
        }
    } catch (error) {
        console.error("Error uploading screenshot:", error);
    }
}

setInterval(async () => {
    const screenshotBuffer = await captureScreen();
    const blob = new Blob([screenshotBuffer], { type: 'image/jpeg' });
    await sendToServer(blob);
}, 1000);