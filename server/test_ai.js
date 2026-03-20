const { classifyComplaint, suggestReply } = require('./services/gemini');

const sampleComplaints = [
  "The fan in hostel block B room 204 has been making a terrible noise and stopped working completely last night. It's too hot to sleep.",
  "I registered for the Advanced Data Structures elective but it's not showing up on my student portal timetable. Exams are next week and I need this fixed ASAP!",
  "The water cooler on the 3rd floor of the main academic building is leaking all over the floor. Someone might slip and fall.",
];

async function runTests() {
  console.log('🤖 --- CAMPUSVOICE AI TEST --- 🤖\n');

  for (let i = 0; i < sampleComplaints.length; i++) {
    const text = sampleComplaints[i];
    console.log(`📝 Complaint ${i + 1}: "${text}"`);
    console.log('⏳ Classifying...');
    
    // Test Classification
    const startTimeClassify = Date.now();
    const classification = await classifyComplaint(text);
    const timeClassify = Date.now() - startTimeClassify;
    
    console.log(`✅ Classification (took ${timeClassify}ms):`);
    console.log(`   - Category:  ${classification.category}`);
    console.log(`   - Priority:  ${classification.priority}`);
    console.log(`   - Sentiment: ${classification.sentiment}`);
    
    console.log('\n⏳ Generating Smart Reply...');
    
    // Test Smart Reply
    const startTimeReply = Date.now();
    const reply = await suggestReply(text, classification.category, classification.priority);
    const timeReply = Date.now() - startTimeReply;
    
    console.log(`✅ AI Suggested Reply (took ${timeReply}ms):`);
    console.log(`   "${reply}"\n`);
    console.log('-'.repeat(50) + '\n');
  }
}

runTests();
