const { GoogleGenerativeAI } = require('@google/generative-ai');
const natural = require('natural');
const fs = require('fs');
require('dotenv').config();

const categoryClassifier = new natural.BayesClassifier();
const priorityClassifier = new natural.BayesClassifier();
const sentimentClassifier = new natural.BayesClassifier();
const spamClassifier = new natural.BayesClassifier();

// ==========================================
// Train Categories: 8 Expanded Departments
// ==========================================

// 1. Hostel
const hostelDocs = [
  'fan is broken in hostel room', 'warden room dirty', 'no wifi in my dorm room',
  'the geyser in the bathroom is not heating water', 'toilet is clogged please send plumber',
  'there are bedbugs in my mattress', 'rats in the corridor of block b', 'tubelight is fused in room 204',
  'door lock is broken anyone can enter', 'window glass shattered in the storm',
  'cleaning staff did not sweep today', 'garbage bin is overflowing in the hallway',
  'washing machine on 2nd floor is out of order', 'ac is leaking water in the dorm room'
];
hostelDocs.forEach(doc => categoryClassifier.addDocument(doc, 'Hostel'));

// 2. Academic
const academicDocs = [
  'advanced data structures elective classes missing', 'cant register for course portal glitch',
  'my grades are wrong professor marks', 'midsem marks are not updated on portal',
  'attendance is showing zero for last week', 'timetable is clashing for mechanical engineers',
  'need transcript for masters application', 'professor did not upload the assignment on lms',
  'library book issue system is down', 'deadline for project submission is too tight',
  'exam hall seating arrangement is incorrect', 'credit limits exceeded error on portal',
  'internship NOC is pending approval', 'placement portal is not letting me apply'
];
academicDocs.forEach(doc => categoryClassifier.addDocument(doc, 'Academic'));

// 3. Infrastructure
const infraDocs = [
  'water cooler leaking 3rd floor', 'parking lot pavement broken',
  'lift is stuck on 4th floor of academic block',
  'street lights near the main gate are off',
  'drinking water RO filter needs replacement'
];
infraDocs.forEach(doc => categoryClassifier.addDocument(doc, 'Infrastructure'));

// 4. IT
const itDocs = [
  'campus wifi keeps disconnecting in library', 'LAN cable port is broken in computer lab',
  'lab computers are extremely slow and infected with virus', 'projector not working in lab',
  'moodle is down', 'email account locked'
];
itDocs.forEach(doc => categoryClassifier.addDocument(doc, 'IT'));

// 5. Cafeteria
const cafeteriaDocs = [
  'mess food is bad', 'mess dal is watery and tasteless', 'roti is burnt in the canteen',
  'canteen hygiene is terrible', 'found a bug in my food', 'not enough seating in the food court'
];
cafeteriaDocs.forEach(doc => categoryClassifier.addDocument(doc, 'Cafeteria'));

// 6. Sports
const sportsDocs = [
  'basketball court net is torn', 'treadmill in the gym is making weird noises',
  'cricket pitch is flooded', 'need more dumbbells in the weight room', 'tennis court lights broken'
];
sportsDocs.forEach(doc => categoryClassifier.addDocument(doc, 'Sports'));

// 7. Finance
const financeDocs = [
  'fee payment gateway failed but money deducted', 'scholarship amount not credited',
  'library fine is incorrect', 'need fee receipt for education loan', 'hostel fee refund pending'
];
financeDocs.forEach(doc => categoryClassifier.addDocument(doc, 'Finance'));

// 8. Security
const securityDocs = [
  'security guards are not checking ID cards', 'main gate is open at night without guard',
  'someone stole my bicycle from the rack', 'lost my id card need a new one',
  'unauthorized outsiders roaming near girls hostel'
];
securityDocs.forEach(doc => categoryClassifier.addDocument(doc, 'Security'));

categoryClassifier.train();

// ==========================================
// Train Priorities: High, Medium, Low
// ==========================================

// High Priority
const highPriorityDocs = [
  'leaking water immediate fix someone slip', 'broken fan cant sleep hot', 'exam next week need this fixed asap',
  'urgent emergency short circuit in switchboard', 'flooding in the bathroom', 'fire alarm keeps ringing',
  'stolen laptop from my room', 'severe food poisoning from mess', 'deadline is today evening critical',
  'danger glass falling from window', 'need an ambulance asap'
];
highPriorityDocs.forEach(doc => priorityClassifier.addDocument(doc, 'High'));

// Medium Priority
const mediumPriorityDocs = [
  'portal glitch register course', 'projector stopped working', 'attendance not updated since monday',
  'lift is making a slight noise', 'washing machine not draining', 'wifi is slow buffering videos',
  'need a bulb replaced', 'door squeaks loudly', 'assignment link is broken on moodle',
  'water cooler is dispensing warm water'
];
mediumPriorityDocs.forEach(doc => priorityClassifier.addDocument(doc, 'Medium'));

// Low Priority
const lowPriorityDocs = [
  'parking lot small pothole', 'food could be slightly better', 'paint is chipping off the wall',
  'suggestion to add more chairs in reading room', 'grass in the lawn needs to be trimmed',
  'minor spelling mistake on the portal', 'would be nice to have different tea in the morning',
  'routine maintenance check requested', 'small cobwebs in the corner'
];
lowPriorityDocs.forEach(doc => priorityClassifier.addDocument(doc, 'Low'));

priorityClassifier.train();

// ==========================================
// Train Sentiments: Angry, Neutral, Calm
// ==========================================

// Angry
const angryDocs = [
  'terrible noise too hot cant sleep', 'worst food ever ridiculous', 'unacceptable behavior pathetic',
  'i am fed up and furious with this management', 'this is complete garbage totally useless',
  'what a joke disgusting terrible service', 'mad about these absurd rules', 'stop ignoring us'
];
angryDocs.forEach(doc => sentimentClassifier.addDocument(doc, 'Angry'));

// Neutral
const neutralDocs = [
  'not showing up on my timetable', 'parking lot pavement broken', 'the fan has stopped working',
  'please fix this issue when possible', 'the portal is glitched for my account',
  'requesting a transcript update', 'reporting a leaking pipe in the lab', 'need a new ID card'
];
neutralDocs.forEach(doc => sentimentClassifier.addDocument(doc, 'Neutral'));

// Calm
const calmDocs = [
  'someone might slip and fall', 'thank you for your help but it is still slightly broken',
  'just a minor suggestion to improve the food', 'no rush take your time but please look into it',
  'appreciate the effort maybe add more chairs', 'it is fine but could be better'
];
calmDocs.forEach(doc => sentimentClassifier.addDocument(doc, 'Calm'));

// ==========================================
// Train Spam/Fraud Detection
// ==========================================

// Spam (Gibberish, Profanity, Unrelated to college)
const spamDocs = [
  'asdfghjkl zxcvbnm qwerty', 'test test test 1234', 'buy cheap cryptocurrency here',
  'click this link for free iphone', 'lorem ipsum dolor sit amet', 'fuck this stupid college and the dean',
  'you guys are idiots and i hate everyone', 'hfbsjkhfbwejk fbwejkhfbew wjef',
  'subscribe to my youtube channel', 'play free online casino games now'
];
spamDocs.forEach(doc => spamClassifier.addDocument(doc, 'Spam'));

// Legit (Valid Complaints)
const legitDocs = [
  ...hostelDocs, ...academicDocs, ...infraDocs, ...itDocs, ...cafeteriaDocs, ...sportsDocs, ...financeDocs, ...securityDocs,
  ...highPriorityDocs, ...mediumPriorityDocs, ...lowPriorityDocs,
  ...angryDocs, ...neutralDocs, ...calmDocs
];
// Take a sample of legit docs to train against spam
legitDocs.forEach(doc => spamClassifier.addDocument(doc, 'Legit'));

spamClassifier.train();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function classifyComplaint(text, imagePath = null, mimeType = null) {
  try {
    if (imagePath && mimeType) {
       console.log('📸 Processing Multimodal Complaint with Image Evidence...');
       const imagePart = fileToGenerativePart(imagePath, mimeType);
       const prompt = `Read this student complaint. First, look at the uploaded image evidence. Does the image visually match the grievance described? If the image is a selfie, a meme, or something entirely unrelated to the complaint, set "is_spam": true. If it is a valid grievance, set "is_spam": false and classify it.
       CRITICAL INSTRUCTION: If the complaint text is in a regional language (e.g. Hindi, Telugu, Spanish) or broken English, you MUST translate and refine it into professional English. Set this string to "translated_text" in your JSON. If it is already perfect English, leave "translated_text" as null.
       Return ONLY a raw JSON object with no markdown. Complaint: "${text}".
       Return EXACTLY: {"is_spam": boolean, "category": "one of Hostel Academic Infrastructure IT Cafeteria Sports Finance Security", "priority": "one of Low Medium High", "sentiment": "one of Angry Neutral Calm", "translated_text": "string or null"}`;

       const result = await model.generateContent([prompt, imagePart]);
       const response = result.response.text().trim();
       
       return parseGeminiResponse(response);
    }
    // 0. Fraud / Spam Detection First
    const spamProbs = spamClassifier.getClassifications(text);
    const topSpam = spamProbs[0];

    // Check if local NLP thinks it's spam
    if (topSpam.label === 'Spam' && topSpam.value > 0.7) {
      console.log(`🛡️ Fraud/Spam blocked locally. (Confidence: ${topSpam.value.toFixed(2)})`);
      return { is_spam: true };
    }

    // 1. Try Natural.js first
    const categoryProbs = categoryClassifier.getClassifications(text);
    const priorityProbs = priorityClassifier.getClassifications(text);
    const sentimentProbs = sentimentClassifier.getClassifications(text);

    // Get the top predictions
    const topCategory = categoryProbs[0];
    const topPriority = priorityProbs[0];
    const topSentiment = sentimentProbs[0];

    // Check confidence threshold (e.g. 0.6)
    const THRESHOLD = 0.6;
    
    if (topCategory.value > THRESHOLD && topPriority.value > THRESHOLD && topSentiment.value > THRESHOLD) {
       console.log(`🤖 Natural.js classification successful (Confidence: Cat ${topCategory.value.toFixed(2)}, Pri ${topPriority.value.toFixed(2)}, Sent ${topSentiment.value.toFixed(2)})`);
       return {
         is_spam: false,
         category: topCategory.label,
         priority: topPriority.label,
         sentiment: topSentiment.label
       };
    }
    
    console.log(`⚠️ Natural.js confidence too low (Cat ${topCategory.value.toFixed(2)}, Pri ${topPriority.value.toFixed(2)}, Sent ${topSentiment.value.toFixed(2)}). Falling back to Gemini...`);
    
    // 2. Fallback to Gemini
    const prompt = `Read this student complaint. First, determine if it is SPAM (gibberish, promotions, excessive profanity, unrelated to college life). If so, set "is_spam": true. If it is a valid grievance, set "is_spam": false and classify it.
    CRITICAL INSTRUCTION: If the complaint text is in a regional language (e.g. Hindi, Telugu, Spanish) or broken English, you MUST translate and refine it into professional English. Set this string to "translated_text" in your JSON. If it is already perfect English, leave "translated_text" as null.
    Return ONLY a raw JSON object with no markdown. Complaint: "${text}".
    Return EXACTLY: {"is_spam": boolean, "category": "one of Hostel Academic Infrastructure IT Cafeteria Sports Finance Security", "priority": "one of Low Medium High", "sentiment": "one of Angry Neutral Calm", "translated_text": "string or null"}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    return parseGeminiResponse(response);
  } catch (error) {
    console.error('Classification error (Fallback failed):', error.message);
    return { is_spam: false, category: 'Infrastructure', priority: 'Low', sentiment: 'Neutral', translated_text: null };
  }
}

function parseGeminiResponse(response) {
    let jsonStr = response;
    const jsonMatch = response.match(/\{[\s\S]*\} /);
    if (!jsonMatch) {
       const jsonMatchAlt = response.match(/\{[\s\S]*\}/);
       if (jsonMatchAlt) jsonStr = jsonMatchAlt[0];
    } else {
       jsonStr = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    const validCategories = ['Hostel', 'Academic', 'Infrastructure', 'IT', 'Cafeteria', 'Sports', 'Finance', 'Security'];
    const validPriorities = ['Low', 'Medium', 'High'];
    const validSentiments = ['Angry', 'Neutral', 'Calm'];

    console.log('✨ Gemini classification successful');

    if (parsed.is_spam === true) {
      console.log('🛡️ Gemini detected Spam/Fraud');
      return { is_spam: true };
    }

    return {
      is_spam: false,
      category: validCategories.includes(parsed.category) ? parsed.category : 'Infrastructure',
      priority: validPriorities.includes(parsed.priority) ? parsed.priority : 'Low',
      sentiment: validSentiments.includes(parsed.sentiment) ? parsed.sentiment : 'Neutral',
      translated_text: parsed.translated_text || null
    };
}

async function suggestReply(text, category, priority) {
  try {
    const prompt = `You are a college admin officer. Student complaint — Category: ${category}, Priority: ${priority}, Text: ${text}. Write a professional empathetic reply in 3 to 4 sentences. Acknowledge the issue. State it will be resolved promptly. Start directly. No placeholders. No sign-off.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini suggest reply error:', error.message);
    return 'We acknowledge your complaint and are looking into it. Our team will work to resolve this issue as soon as possible. Thank you for your patience.';
  }
}

async function generatePredictions(complaintsChunk, departmentContext) {
  try {
    const historicalData = complaintsChunk.map(c => `[${c.created_at}] Category: ${c.category}, Priority: ${c.priority}, Text: "${c.text}"`).join('\n');
    
    // 3. Predictive Analytics
    const prompt = `You are a proactive administration AI for an educational campus. Analyze the following recent complaints for the ${departmentContext} department. 
    1. Identify any recurring trends or "Mega-Issues".
    2. Predict 2-3 specific infrastructure or administrative breakdowns that are statistically likely to occur next month based on this data.
    3. Suggest actionable, immediate preventative maintenance steps.
    
    Keep the tone factual, highly professional, and urgent. Limit the response to 3 short, punchy paragraphs. Do not use markdown headers, just plain text with line breaks.
    
    COMPLAINT HISTORY:
    ${historicalData}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Prediction generation error:', error.message);
    return "Could not generate predictions at this time due to an AI service error.";
  }
}

module.exports = { classifyComplaint, suggestReply, generatePredictions };
