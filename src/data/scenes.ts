/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationScene } from "../types";

export const SIMULATION_SCENES: SimulationScene[] = [
  {
    id: "crossing",
    title: "PEDESTRIAN CROSSING",
    category: "Crossing",
    image: "/src/assets/images/road_crossing_scene_1781372971257.jpg",
    description: "Pedestrian crosswalk on a busy roadway with high-visibility markings and active traffic signals.",
    objects: ["Crosswalk lanes", "Pedestrian traffic signal (RED)", "Approaching sedan, 20 meters right", "Steel safety barrier"],
    risks: ["Collision Risk: MEDIUM (Vehicle approaching)", "Traffic Signal State: RED (Do not cross)"],
    thinking: {
      observe: "Detected high-visibility yellow pedestrian crosswalk lanes, vehicular traffic lights, and an approaching grey sedan moving at 35 km/h from the right side.",
      context: "User is standing at a major road intersection waiting to cross. Intending to cross the street.",
      risk: "Collision risk is moderate due to the grey sedan. Pedestrian signal is currently RED for crossing.",
      prioritize: "Priority 1: Immediate Safety (Wait for signal / halt user). Priority 2: Crossing state navigation.",
      speak: "A vehicle is approaching from your right. Please WAIT. The pedestrian signal is currently RED."
    },
    narrations: {
      en: "A vehicle is approaching from your right. Please WAIT. The pedestrian signal is currently RED.",
      hi: "आपके दाईं ओर से एक वाहन आ रहा है। कृपया प्रतीक्षा करें। पैदल चलने वालों का सिग्नल अभी लाल है।",
      mr: "तुमच्या उजवीकडून एक गाडी येत आहे. कृपया थांबा. पादचारी सिग्नल सध्या लाल आहे.",
      ta: "உங்கள் வலது பக்கத்தில் இருந்து ஒரு வாகனம் வருகிறது. தயவுசெய்து காத்திருக்கவும். சிக்னல் சிவப்பு நிறத்தில் உள்ளது.",
      te: "మీ కుడి నుండి ఒక వాహనం వస్తోంది. దయచేసి ఆగండి. పాదచారుల సిగ్నల్ ప్రస్తుతం ఎరుపు రంగులో ఉంది.",
      gu: "તમારી જમણી બાજુથી એક વાહન આવી રહ્યું છે. કૃપા કરીને થોભો. સિગ્નલ અત્યારે લાલ છે.",
      bn: "আপনার ডান দিক থেকে একটি গাড়ি আসছে। দয়া করে অপেক্ষা করুন। পথচারী সংকেত বর্তমানে লাল আছে।"
    },
    agentCollaboration: {
      ContextAgent: "User is situated at Seventh Avenue Pedestrian Crossing. Current activity rate shows halted motion.",
      NavigationAgent: "Preparing GPS coordinates tracking for crosswalk alignment at bearing 180 degrees south.",
      SafetyAgent: "Halt signal activated. Detected approaching metallic object at distance 15 meters moving at 10 meters per second.",
      MemoryAgent: "This is Seventh Avenue Crossing, part of user's typical daily morning walking route.",
      GuardianAgent: "Emergency guardian connection verified. Status: Standby."
    }
  },
  {
    id: "transit",
    title: "BUS STOP TRANSIT",
    category: "Transit",
    image: "/src/assets/images/bus_stop_scene_1781372989286.jpg",
    description: "A transit shelter with arriving municipal double-door bus on municipal route 305.",
    objects: ["Transit shelter", "Bus Route 305 banner", "Approaching Transit Bus, 10 meters front", "Boarding passenger boarding line"],
    risks: ["Collision Risk: LOW (Bus is deceleration status)", "Environmental: Slippery landing pad near entrance"],
    thinking: {
      observe: "Arriving transit bus with route number 305 visible on electronic dashboard. Bus is decelerating to stop adjacent to the tactile platform guides.",
      context: "User is at their preferred bus terminal waiting to board municipal transit.",
      risk: "Slight hazard: slippery curbside terrain near boarding gates. Speed is safe.",
      prioritize: "Priority 1: Transportation information. Priority 2: Boarding door physical navigation.",
      speak: "Bus number 305 is approaching and stopping. Boarding door will open directly 2 meters to your front."
    },
    narrations: {
      en: "Bus number 305 is approaching and stopping. Boarding door will open directly 2 meters to your front.",
      hi: "बस संख्या 305 आ रही है और रुक रही है। बोर्डिंग द्वार सीधे आपके सामने 2 मीटर की दूरी पर खुलेगा।",
      mr: "बस क्रमांक 305 येत आहे आणि थांबत आहे. बोर्डिंगचा दरवाजा थेट तुमच्या समोर 2 मीटर अंतरावर उघडेल.",
      ta: "பஸ் எண் 305 வந்து கொண்டிருக்கிறது. ஏறும் கதவு உங்கள் முன்னால் சரியாக 2 மீட்டர் தொலைவில் திறக்கும்.",
      te: "బస్సు నంబర్ 305 వస్తోంది. ఎక్కే తలుపు మీ ముందర 2 మీటర్ల దూరంలో తెరుచుకుంటుంది.",
      gu: "બસ નંબર 305 આવી રહી છે અને ઉભી રહી છે. બોર્ડિંગ ગેટ તમારી સામે 2 મીટરના અંતરે ખુલશે.",
      bn: "বাস নম্বর 305 আসছে এবং থামছে। বোর্ডিং দরজা সরাসরি আপনার সামনে ২ মিটার দূরে খুলবে।"
    },
    agentCollaboration: {
      ContextAgent: "Identified terminal location matching Route 305 schedules. Dynamic ETA: 30 seconds.",
      NavigationAgent: "Alignment locked. Guide user forward exactly 4 steps once bus completes absolute motion halt.",
      SafetyAgent: "Verified boarding surface coefficient. Recommending holding left-side safety handrail.",
      MemoryAgent: "User boards Bus 305 every Saturday at 11 AM to visit the Central Pharmacy.",
      GuardianAgent: "Guardian notifications updated: User currently entering public transit unit."
    }
  },
  {
    id: "medicine",
    title: "MEDICINE IDENTIFICATION",
    category: "Medicine",
    image: "/src/assets/images/medicine_bottle_scene_1781373001405.jpg",
    description: "Pharmacy cabinet shelf containing prescription tablets with high-contrast text label layout.",
    objects: ["Paracetamol 500mg original bottle", "Safety cap seal", "Shelf divider", "Text instructions on container label"],
    risks: ["Health Hazard: Incorrect dosage identification", "Alert: Multi-bottle clutter adjacent to active target"],
    thinking: {
      observe: "Large white medicinal bottle on shelf labeled Paracetamol 500 mg. Clear bold letters are tracked indicating expiry January 2027.",
      context: "User is at home, standing in front of their medicine cabinet seeking correct dosage details.",
      risk: "Risk of taking wrong medication is high if uncluttered space is not verified. High contrast text reading applied.",
      prioritize: "Priority 1: OCR Reading summary. Priority 2: Expiration and drug warnings.",
      speak: "This is Paracetamol 500 milligrams. Expiry January 2027. Original safety seal is intact."
    },
    narrations: {
      en: "This is Paracetamol 500 milligrams. Expiry January 2027. Original safety seal is intact.",
      hi: "यह पैरासिटामोल 500 मिलीग्राम है। समाप्ति तिथि जनवरी 2027 है। मूल सुरक्षा सील सही सलामत है।",
      mr: "हे पॅरासिटामॉल 500 मिलीग्रॅम आहे. मुदत समाप्ती जानेवारी 2027 आहे. मूळ सुरक्षा सील शाबूत आहे.",
      ta: "இது பாராசிட்டமால் 500 மில்லிகிராம். காலாவதி தேதி ஜனவரி 2027. அசல் பாதுகாப்பு முத்திரை அப்படியே உள்ளது.",
      te: "ఇది పారాసిటమాల్ 500 మిల్లీగ్రాములు. ఎక్స్పైరీ జనవరి 2027. ఒరిజినల్ భద్రతా సీల్ సురక్షితంగా ఉంది.",
      gu: "આ પેરાસિટામોલ 500 મિલિગ્રામ છે. એક્સપાયરી જાન્યુઆરી 2027 છે. મૂળ સેફટી સીલ અકબંધ છે.",
      bn: "এটি প্যারাসিটামল ৫০০ মিলিগ্রাম। মেয়াদ ২০২৭ সালের জানুয়ারি পর্যন্ত। আসল সুরক্ষা সিল অক্ষত রয়েছে।"
    },
    agentCollaboration: {
      ContextAgent: "Analyzing high-accuracy product metadata. Target matching: Pain relief prescription.",
      NavigationAgent: "Stationary mode. No navigation vectors needed. Stabilizing camera frame.",
      SafetyAgent: "Verified dosage limits: Maximum 4 tablets in 24 hours. Keep out of children's reach.",
      MemoryAgent: "User frequently takes Paracetamol for mild chronic knee soreness.",
      GuardianAgent: "Shared medication track entry: Paracetamol 500mg parsed successfully."
    }
  },
  {
    id: "obstacle",
    title: "HAZARD SIDEDWALK PATH",
    category: "Obstacle",
    image: "/src/assets/images/sidewalk_obstacle_scene_1781373016985.jpg",
    description: "Sidewalk pedestrian environment blocked by highly vibrant orange construction barricades.",
    objects: ["Orange construction barrier", "High-visibility warning stripes", "Concrete curbside", "Slight pothole, 1 meter front left"],
    risks: ["Collision Risk: HIGH (Path blocked)", "Fall Hazard: MEDIUM (Curbside slope and pothole)"],
    thinking: {
      observe: "Bright orange and white construction barricade blocking the center sidewalk. A small, uncovered pothole is also noticed 1 meter ahead on the left margin.",
      context: "User is walking along public walkway, heading toward an intersection.",
      risk: "Path is entirely blocked. High risk of stumbling over the barrier or into the left pothole.",
      prioritize: "Priority 1: IMMEDIATE PATH WARNING and re-routing. Priority 2: General awareness.",
      speak: "Warning. Sidewalk blocked ahead by construction barriers. Please step 3 paces to your left to circumvent."
    },
    narrations: {
      en: "Warning. Sidewalk blocked ahead by construction barriers. Please step 3 paces to your left to circumvent.",
      hi: "चेतावनी। सामने निर्माण कार्य में बाधा है। कृपया बाईं ओर झुकें और सुरक्षित बचकर निकलें।",
      mr: "इशारा. समोर रस्ता बंद आहे. कृपया बाजूने जाण्यासाठी डाव्या बाजूला ३ पावले टाका.",
      ta: "எச்சரிக்கை. பாதை கட்டுமானப் பொருட்களால் தடுக்கப்பட்டுள்ளது. கடந்து செல்ல தயவுசெய்து 3 படிகள் இடதுபுறம் செல்லவும்.",
      te: "హెచ్చరిక. ముందర దారి మూసివేయబడింది. దయచేसि ఎడమవైపుకి 3 అడుగులు వేసి ప్రక్కకు వెళ్ళండి.",
      gu: "ચેતવણી. આગળ રસ્તો બંધ છે. કૃપા કરીને બચવા માટે તમારી ડાબી બાજુ ૩ ડગલાં આગળ વધો.",
      bn: "সতর্কবার্তা। সামনে রাস্তা নির্মাণ কাজের ব্যারিকেড ধারা অবরুদ্ধ। পাশ দিয়ে যেতে অনুগ্রহ করে বাম দিকে ৩টি পদক্ষেপ নিন।"
    },
    agentCollaboration: {
      ContextAgent: "Detected active municipal civil service sector zone. Dynamic danger code activated.",
      NavigationAgent: "Re-calculating pedestrian walk vector. Angle adjusted to 45 degrees left deviation.",
      SafetyAgent: "CRITICAL ALERT: Physical obstruction within 1.5 meters radius. Stop immediately.",
      MemoryAgent: "Alert state mapped. Tagging coordinates as 'Obstruction Under Construction' in global map memory.",
      GuardianAgent: "Haptic emergency vibration sequence sent to wearable safety receiver."
    }
  }
];
