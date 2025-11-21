// @ts-ignore
import { pipeline } from '@xenova/transformers';

let captioner: any = null;

export const getDescriptionForImage = async (imageUrl: string): Promise<string> => {
  try {
    if (!captioner) {
      captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
    }
    const result = await captioner(imageUrl);
    let text = result[0]?.generated_text || "An unidentified artifact.";
    return text.charAt(0).toUpperCase() + text.slice(1);
  } catch (error) {
    console.error("Captioning failed:", error);
    return "A unique artifact detected by the scanner.";
  }
};