import { CRAFT_DATA } from "../data/crafts";

export interface ArchiveItem {
  id: string;
  craftId: string;
  title: string;
  desc: string;
  location: string;
  imageSrc: string;
  timestamp: number;
  isUserUploaded: boolean;
}

const STORAGE_KEY = "culture_lens_archive";

export const getArchiveItems = (): ArchiveItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

// Update an item (Use this for the Edit feature)
export const updateArchiveItem = (id: string, newData: Partial<ArchiveItem>) => {
    const items = getArchiveItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...newData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return true;
    }
    return false;
};

// Helper to shrink images
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 500;
        if (width > MAX_WIDTH) { height = (height * MAX_WIDTH) / width; width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const addToArchive = async (craftId: string, imageFile: File, customDescription?: string, defaultLocation: string = "Unknown Location") => {
  try {
    const base64Image = await resizeImage(imageFile);
    
    let title = "";
    let desc = "";
    let location = defaultLocation;
    let finalCraftId = craftId;

    if (CRAFT_DATA[craftId]) {
      title = CRAFT_DATA[craftId].title;
      desc = CRAFT_DATA[craftId].desc;
      location = CRAFT_DATA[craftId].location;
    } else {
      finalCraftId = "unknown";
      title = "Unidentified Artifact"; 
      desc = customDescription || "A unique artifact detected by the scanner.";
    }

    const newItem: ArchiveItem = {
      id: Date.now().toString(),
      craftId: finalCraftId,
      title: title,
      desc: desc,
      location: location,
      imageSrc: base64Image,
      timestamp: Date.now(),
      isUserUploaded: true
    };

    const currentItems = getArchiveItems();
    const updatedItems = [newItem, ...currentItems];
    if (updatedItems.length > 20) updatedItems.pop(); 

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  } catch (error) { console.error(error); }
};