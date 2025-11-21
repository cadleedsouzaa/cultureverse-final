// client/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_title": "CultureVerse Lens",
      "tagline": "Discover <1>India's Heritage</1> through the lens of AI.",
      "nav_demo": "DEMO",
      "nav_archive": "ARCHIVE",
      "upload_title": "Upload or Scan",
      "btn_upload": "Upload Image",
      "btn_camera": "Use Camera",
      "btn_identify": "Identify Craft",
      "btn_analyzing": "Analyzing...",
      "sub_upload": "Supports JPG, PNG",
      "sub_camera": "Real-time AR Scan",
      "passport_title": "Cultural Passport",
      "passport_sub": "Travel across India to unlock artifacts.",
      "progress": "Collection Progress",
      "collected": "Collected",
      "unexplored": "Unexplored",
      "view_details": "View Full Details",
      // Craft Specifics
      "craft_channapatna_title": "Channapatna Toys",
      "craft_channapatna_desc": "Traditional ivory-wood toys coated with non-toxic vegetable lacquer. Protected as a Geographical Indication (GI).",
      "craft_blue-pottery_title": "Jaipur Blue Pottery",
      "craft_blue-pottery_desc": "Unique pottery made from quartz stone powder, powdered glass, and gum. Known for its blue and white Persian patterns.",
      "craft_warli_title": "Warli Art",
      "craft_warli_desc": "Tribal art using rice paste circles, triangles, and squares on red mud walls to depict social life.",
      "craft_kolam_title": "Kolam",
      "craft_kolam_desc": "Geometric floor patterns made with rice flour to welcome prosperity. A daily ritual of mathematical beauty.",
      "craft_madhubani_title": "Madhubani Art",
      "craft_madhubani_desc": "Folk art done with fingers, twigs, brushes, and matchsticks, characterized by eye-catching geometrical patterns."
    }
  },
  hi: { // HINDI
    translation: {
      "app_title": "कल्चरवर्स लेंस",
      "tagline": "AI के माध्यम से <1>भारत की विरासत</1> की खोज करें।",
      "nav_demo": "डेमो",
      "nav_archive": "संग्रह",
      "upload_title": "अपलोड या स्कैन",
      "btn_upload": "तस्वीर अपलोड करें",
      "btn_camera": "कैमरा खोलें",
      "btn_identify": "कला पहचानें",
      "btn_analyzing": "विश्लेषण जारी...",
      "sub_upload": "JPG, PNG समर्थित",
      "sub_camera": "रीयल-टाइम स्कैन",
      "passport_title": "सांस्कृतिक पासपोर्ट",
      "passport_sub": "कलाकृतियों को खोजने के लिए भारत की यात्रा करें।",
      "progress": "संग्रह प्रगति",
      "collected": "संग्रहित",
      "unexplored": "अनदेखा",
      "view_details": "पूरा विवरण देखें",
      // Craft Specifics
      "craft_channapatna_title": "चन्नपटना खिलौने",
      "craft_channapatna_desc": "गैर-विषैले वनस्पति रंगों से लेपित पारंपरिक लकड़ी के खिलौने। इसे भौगोलिक संकेत (GI) के रूप में संरक्षित किया गया है।",
      "craft_blue-pottery_title": "जयपुर ब्लू पॉटरी",
      "craft_blue-pottery_desc": "क्वार्ट्ज पत्थर पाउडर और कांच से बनी अनूठी मिट्टी के बर्तन। अपने नीले और सफेद फारसी पैटर्न के लिए जाना जाता है।",
      "craft_warli_title": "वारली कला",
      "craft_warli_desc": "लाल मिट्टी की दीवारों पर चावल के पेस्ट का उपयोग करके बनाई गई जनजातीय कला जो सामाजिक जीवन को दर्शाती है।",
      "craft_kolam_title": "कोलम",
      "craft_kolam_desc": "समृद्धि का स्वागत करने के लिए चावल के आटे से बने ज्यामितीय फर्श पैटर्न।",
      "craft_madhubani_title": "मधुबनी कला",
      "craft_madhubani_desc": "उंगलियों, टहनियों और माचिस की तीलियों से की गई लोक कला, जो आकर्षक ज्यामितीय पैटर्न के लिए जानी जाती है।"
    }
  },
  kn: { // KANNADA
    translation: {
      "app_title": "ಕಲ್ಚರ್ವರ್ಸ್ ಲೆನ್ಸ್",
      "tagline": "AI ಮೂಲಕ <1>ಭಾರತದ ಪರಂಪರೆ</1>ಯನ್ನು ಅನ್ವೇಷಿಸಿ.",
      "nav_demo": "ಡೆಮೊ",
      "nav_archive": "ಪರಂಪರೆ",
      "upload_title": "ಅಪ್‌ಲೋಡ್ ಅಥವಾ ಸ್ಕ್ಯಾನ್",
      "btn_upload": "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್",
      "btn_camera": "ಕ್ಯಾಮೆರಾ ಬಳಸಿ",
      "btn_identify": "ಕಲೆಯನ್ನು ಗುರುತಿಸಿ",
      "btn_analyzing": "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
      "sub_upload": "JPG, PNG ಬೆಂಬಲಿತವಾಗಿದೆ",
      "sub_camera": "ಲೈವ್ ಸ್ಕ್ಯಾನ್",
      "passport_title": "ಸಾಂಸ್ಕೃತಿಕ ಪಾಸ್‌ಪೋರ್ಟ್",
      "passport_sub": "ಕಲಾಕೃತಿಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲು ಭಾರತದಾದ್ಯಂತ ಪ್ರಯಾಣಿಸಿ.",
      "progress": "ಸಂಗ್ರಹ ಪ್ರಗತಿ",
      "collected": "ಸಂಗ್ರಹಿಸಲಾಗಿದೆ",
      "unexplored": "ಅನ್ವೇಷಿಸದ",
      "view_details": "ಪೂರ್ಣ ವಿವರಗಳು",
      "craft_channapatna_title": "ಚನ್ನಪಟ್ಟಣ ಆಟಿಕೆಗಳು",
      "craft_channapatna_desc": "ವಿಷಕಾರಿಯಲ್ಲದ ಸಸ್ಯಜನ್ಯ ಬಣ್ಣಗಳಿಂದ ಲೇಪಿತವಾದ ಸಾಂಪ್ರದಾಯಿಕ ದಂತದ ಮರದ ಆಟಿಕೆಗಳು.",
      "craft_blue-pottery_title": "ಜೈಪುರ ನೀಲಿ ಮಡಿಕೆ",
      "craft_blue-pottery_desc": "ಕ್ವಾರ್ಟ್ಜ್ ಕಲ್ಲಿನ ಪುಡಿ ಮತ್ತು ಗಾಜಿನ ಪುಡಿಯಿಂದ ಮಾಡಿದ ವಿಶಿಷ್ಟ ಮಡಿಕೆಗಳು.",
      "craft_warli_title": "ವರ್ಲಿ ಕಲೆ",
      "craft_warli_desc": "ಸಾಮಾಜಿಕ ಜೀವನವನ್ನು ಚಿತ್ರಿಸಲು ಕೆಂಪು ಮಣ್ಣಿನ ಗೋಡೆಗಳ ಮೇಲೆ ಅಕ್ಕಿ ಹಿಟ್ಟು ಬಳಸುವ ಬುಡಕಟ್ಟು ಕಲೆ.",
      "craft_kolam_title": "ಕೋಲಂ",
      "craft_kolam_desc": "ಸಮೃದ್ಧಿಯನ್ನು ಸ್ವಾಗತಿಸಲು ಅಕ್ಕಿ ಹಿಟ್ಟಿನಿಂದ ಮಾಡಿದ ಜ್ಯಾಮಿತೀಯ ನೆಲದ ಮಾದರಿಗಳು.",
      "craft_madhubani_title": "ಮಧುಬನಿ ಕಲೆ",
      "craft_madhubani_desc": "ಬೆರಳುಗಳು ಮತ್ತು ಕಡ್ಡಿಗಳಿಂದ ಮಾಡಿದ ಜಾನಪದ ಕಲೆ."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;