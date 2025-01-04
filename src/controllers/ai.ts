class AiController {
    async generateText(prompt: string): Promise<string> {
        try {
            var char = " dengan hasil (seperti <h1> dan kawan kawan) dan PADA HASIL AKHIR NYA BERIKAN 'made by ai'";
            const apiurl: string = `https://sandipbaruwal.onrender.com/gemini?prompt=${char +prompt}' &uid=62825372`;// Suggested code may be subject to a license. Learn more: ~LicenseLog:237231439.
            const response = await fetch(apiurl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.answer;

        } catch (error) {
            console.error("Error generating text:", error);
            throw error; // Re-throw the error to be handled by the calling function
        }
    }
    async generateSummary(notes: string): Promise<string> {
        try {
            let char = `bisa rangkumkan hal ini. ${notes}`
            const apiurl: string = 'https://sandipbaruwal.onrender.com/gemini';

            async function fetchInChunks(fullText: string, uid: string): Promise<string> {
                const paragraphs = fullText.split('\n\n'); // Pisahkan teks menjadi paragraf
                let combinedResult = '';

                for (const paragraph of paragraphs) {
                    const encodedPrompt = encodeURIComponent(paragraph.trim());
                    const response = await fetch(`${apiurl}?prompt=${encodedPrompt}&uid=${uid}`);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    combinedResult += data.answer + '\n\n'; // Gabungkan hasil
                }

                return combinedResult.trim();
            }

        // Contoh penggunaan
            let result;
            const fullText = char + notes; // Data lengkap
            const uid = '62825372'; // UID Anda
                result = await fetchInChunks(fullText, uid);
                console.log(result)

            return result
        } catch (error) {
            console.error("Error generating text:", error);
            throw error; // Re-throw the error to be handled by the calling function
        }
    }
}

export default AiController;
