const { GoogleGenerativeAI } = require('@google/generative-ai');
const natural = require('natural');
const fs = require('fs');
require('dotenv').config();

const categoryClassifier = new natural.BayesClassifier();
const priorityClassifier = new natural.BayesClassifier();
const sentimentClassifier = new natural.BayesClassifier();
const spamClassifier = new natural.BayesClassifier();

// ─────────────────────────────────────────────
// HOSTEL
// ─────────────────────────────────────────────
categoryClassifier.addDocument('fan not working in my room', 'Hostel');
categoryClassifier.addDocument('fan is broken since many days', 'Hostel');
categoryClassifier.addDocument('ceiling fan making noise', 'Hostel');
categoryClassifier.addDocument('room fan stopped working', 'Hostel');
categoryClassifier.addDocument('fan not working since 3 days bro', 'Hostel');
categoryClassifier.addDocument('no electricity in hostel room', 'Hostel');
categoryClassifier.addDocument('power cut in hostel', 'Hostel');
categoryClassifier.addDocument('light not working in room', 'Hostel');
categoryClassifier.addDocument('bulb fused in my room', 'Hostel');
categoryClassifier.addDocument('room light flickering', 'Hostel');
categoryClassifier.addDocument('switch not working in hostel room', 'Hostel');
categoryClassifier.addDocument('room is very dirty', 'Hostel');
categoryClassifier.addDocument('my room was not cleaned', 'Hostel');
categoryClassifier.addDocument('housekeeping not done in room', 'Hostel');
categoryClassifier.addDocument('room cleaning not happening', 'Hostel');
categoryClassifier.addDocument('dust everywhere in room', 'Hostel');
categoryClassifier.addDocument('cockroaches in my hostel room', 'Hostel');
categoryClassifier.addDocument('insects in room', 'Hostel');
categoryClassifier.addDocument('rats in hostel', 'Hostel');
categoryClassifier.addDocument('pests in my room', 'Hostel');
categoryClassifier.addDocument('mosquitoes in hostel room', 'Hostel');
categoryClassifier.addDocument('bed is broken', 'Hostel');
categoryClassifier.addDocument('mattress is damaged', 'Hostel');
categoryClassifier.addDocument('cupboard lock broken', 'Hostel');
categoryClassifier.addDocument('door lock not working in room', 'Hostel');
categoryClassifier.addDocument('window glass is broken', 'Hostel');
categoryClassifier.addDocument('window not closing properly', 'Hostel');
categoryClassifier.addDocument('room door not closing', 'Hostel');
categoryClassifier.addDocument('leakage in my room ceiling', 'Hostel');
categoryClassifier.addDocument('water dripping from ceiling', 'Hostel');
categoryClassifier.addDocument('roof leaking in room', 'Hostel');
categoryClassifier.addDocument('wall cracks in hostel room', 'Hostel');
categoryClassifier.addDocument('floor tiles broken in hostel', 'Hostel');
categoryClassifier.addDocument('room too small for occupants', 'Hostel');
categoryClassifier.addDocument('overcrowded room allocation', 'Hostel');
categoryClassifier.addDocument('triple room when double was paid', 'Hostel');
categoryClassifier.addDocument('chair broken in hostel room', 'Hostel');
categoryClassifier.addDocument('study table damaged', 'Hostel');
categoryClassifier.addDocument('no water in hostel', 'Hostel');
categoryClassifier.addDocument('water supply not available', 'Hostel');
categoryClassifier.addDocument('no water since morning', 'Hostel');
categoryClassifier.addDocument('water not coming in bathroom', 'Hostel');
categoryClassifier.addDocument('bathroom tap not working', 'Hostel');
categoryClassifier.addDocument('tap leaking in bathroom', 'Hostel');
categoryClassifier.addDocument('bathroom very dirty', 'Hostel');
categoryClassifier.addDocument('toilet not clean', 'Hostel');
categoryClassifier.addDocument('toilet blocked', 'Hostel');
categoryClassifier.addDocument('toilet flush not working', 'Hostel');
categoryClassifier.addDocument('sewage smell in bathroom', 'Hostel');
categoryClassifier.addDocument('drainage blocked in bathroom', 'Hostel');
categoryClassifier.addDocument('water logging in bathroom', 'Hostel');
categoryClassifier.addDocument('hot water not available', 'Hostel');
categoryClassifier.addDocument('geyser not working', 'Hostel');
categoryClassifier.addDocument('no hot water for bathing', 'Hostel');
categoryClassifier.addDocument('shower not working', 'Hostel');
categoryClassifier.addDocument('no soap in hostel bathroom', 'Hostel');
categoryClassifier.addDocument('handwash not available in hostel', 'Hostel');
categoryClassifier.addDocument('no sanitary pad disposal in hostel', 'Hostel');
categoryClassifier.addDocument('ladies washroom door broken in hostel', 'Hostel');
categoryClassifier.addDocument('mess food quality is very bad', 'Hostel');
categoryClassifier.addDocument('food not good in mess', 'Hostel');
categoryClassifier.addDocument('found insects in food', 'Hostel');
categoryClassifier.addDocument('hair in food', 'Hostel');
categoryClassifier.addDocument('food is stale in mess', 'Hostel');
categoryClassifier.addDocument('food not hygienic', 'Hostel');
categoryClassifier.addDocument('mess not open on time', 'Hostel');
categoryClassifier.addDocument('mess closed before timing', 'Hostel');
categoryClassifier.addDocument('quantity of food is less', 'Hostel');
categoryClassifier.addDocument('mess menu not followed', 'Hostel');
categoryClassifier.addDocument('breakfast not served properly', 'Hostel');
categoryClassifier.addDocument('dinner quality very poor', 'Hostel');
categoryClassifier.addDocument('lunch not available', 'Hostel');
categoryClassifier.addDocument('mess staff rude behavior', 'Hostel');
categoryClassifier.addDocument('mess is very dirty', 'Hostel');
categoryClassifier.addDocument('dining hall not clean', 'Hostel');
categoryClassifier.addDocument('plates and utensils not clean', 'Hostel');
categoryClassifier.addDocument('no vegetarian option in mess', 'Hostel');
categoryClassifier.addDocument('special dietary need not met in mess', 'Hostel');
categoryClassifier.addDocument('warden not available', 'Hostel');
categoryClassifier.addDocument('warden behaving badly', 'Hostel');
categoryClassifier.addDocument('hostel staff rude', 'Hostel');
categoryClassifier.addDocument('warden not responding to complaints', 'Hostel');
categoryClassifier.addDocument('hostel rules too strict', 'Hostel');
categoryClassifier.addDocument('hostel gate closed early', 'Hostel');
categoryClassifier.addDocument('entry not allowed after time', 'Hostel');
categoryClassifier.addDocument('night curfew problem in hostel', 'Hostel');
categoryClassifier.addDocument('hostel caretaker not helping', 'Hostel');
categoryClassifier.addDocument('visitors not allowed even in emergency', 'Hostel');
categoryClassifier.addDocument('parcel not delivered to hostel room', 'Hostel');
categoryClassifier.addDocument('mail not given to student in hostel', 'Hostel');
categoryClassifier.addDocument('wifi not working in hostel', 'Hostel');
categoryClassifier.addDocument('internet very slow in hostel room', 'Hostel');
categoryClassifier.addDocument('no internet in hostel', 'Hostel');
categoryClassifier.addDocument('common room not maintained', 'Hostel');
categoryClassifier.addDocument('hostel corridor dirty', 'Hostel');
categoryClassifier.addDocument('stairs in hostel broken', 'Hostel');
categoryClassifier.addDocument('hostel lift not working', 'Hostel');
categoryClassifier.addDocument('laundry facility not working', 'Hostel');
categoryClassifier.addDocument('washing machine broken in hostel', 'Hostel');
categoryClassifier.addDocument('ironing room locked', 'Hostel');
categoryClassifier.addDocument('noise at night in hostel', 'Hostel');
categoryClassifier.addDocument('other students disturbing at night', 'Hostel');
categoryClassifier.addDocument('ragging happening in hostel', 'Hostel');
categoryClassifier.addDocument('theft in hostel room', 'Hostel');
categoryClassifier.addDocument('my belongings stolen in hostel', 'Hostel');
categoryClassifier.addDocument('security not present at hostel gate', 'Hostel');
categoryClassifier.addDocument('outsiders entering hostel', 'Hostel');
categoryClassifier.addDocument('roommate conflict no resolution', 'Hostel');
categoryClassifier.addDocument('no counselling available in hostel', 'Hostel');
categoryClassifier.addDocument('discrimination by warden based on region', 'Hostel');
categoryClassifier.addDocument('discrimination by warden based on religion', 'Hostel');
categoryClassifier.addDocument('sexual harassment in hostel', 'Hostel');
categoryClassifier.addDocument('stalking by another hostel resident', 'Hostel');
categoryClassifier.addDocument('room entered without my permission', 'Hostel');
categoryClassifier.addDocument('no female security guard for ladies hostel', 'Hostel');
categoryClassifier.addDocument('ladies hostel gate not monitored at night', 'Hostel');
categoryClassifier.addDocument('generator failure during power cut in hostel', 'Hostel');
categoryClassifier.addDocument('staircase railing broken in hostel', 'Hostel');
categoryClassifier.addDocument('corridor lights broken in hostel', 'Hostel');
categoryClassifier.addDocument('study room noisy in hostel', 'Hostel');
categoryClassifier.addDocument('study room unavailable in hostel', 'Hostel');

// ─────────────────────────────────────────────
// ACADEMIC
// ─────────────────────────────────────────────
categoryClassifier.addDocument('professor not coming to class', 'Academic');
categoryClassifier.addDocument('teacher absent frequently', 'Academic');
categoryClassifier.addDocument('faculty not teaching properly', 'Academic');
categoryClassifier.addDocument('lecturer just reads from slides', 'Academic');
categoryClassifier.addDocument('professor not explaining concepts', 'Academic');
categoryClassifier.addDocument('teacher behavior is rude in class', 'Academic');
categoryClassifier.addDocument('faculty using bad language', 'Academic');
categoryClassifier.addDocument('professor partial to some students', 'Academic');
categoryClassifier.addDocument('teacher not available for doubts', 'Academic');
categoryClassifier.addDocument('no office hours for faculty', 'Academic');
categoryClassifier.addDocument('faculty ignoring student questions', 'Academic');
categoryClassifier.addDocument('professor arrives late to class', 'Academic');
categoryClassifier.addDocument('class starts late every day', 'Academic');
categoryClassifier.addDocument('class ends before time', 'Academic');
categoryClassifier.addDocument('syllabus not being completed', 'Academic');
categoryClassifier.addDocument('portions not covered before exam', 'Academic');
categoryClassifier.addDocument('course content outdated', 'Academic');
categoryClassifier.addDocument('class cancelled without notice', 'Academic');
categoryClassifier.addDocument('visiting faculty replaced permanent faculty', 'Academic');
categoryClassifier.addDocument('harassment by faculty', 'Academic');
categoryClassifier.addDocument('public shaming by faculty for poor marks', 'Academic');
categoryClassifier.addDocument('caste based discrimination by faculty', 'Academic');
categoryClassifier.addDocument('regional bias in class by teacher', 'Academic');
categoryClassifier.addDocument('gender discrimination by professor', 'Academic');
categoryClassifier.addDocument('my marks are wrong', 'Academic');
categoryClassifier.addDocument('marks not updated in portal', 'Academic');
categoryClassifier.addDocument('internal marks not given correctly', 'Academic');
categoryClassifier.addDocument('attendance marked wrong', 'Academic');
categoryClassifier.addDocument('attendance not updated', 'Academic');
categoryClassifier.addDocument('my attendance is showing less', 'Academic');
categoryClassifier.addDocument('exam result not published', 'Academic');
categoryClassifier.addDocument('revaluation not done', 'Academic');
categoryClassifier.addDocument('answer sheet not shown', 'Academic');
categoryClassifier.addDocument('exam schedule clash', 'Academic');
categoryClassifier.addDocument('two exams on same day', 'Academic');
categoryClassifier.addDocument('exam hall not allotted properly', 'Academic');
categoryClassifier.addDocument('exam paper was very out of syllabus', 'Academic');
categoryClassifier.addDocument('question paper leaked', 'Academic');
categoryClassifier.addDocument('unfair evaluation by faculty', 'Academic');
categoryClassifier.addDocument('assignment marks not updated', 'Academic');
categoryClassifier.addDocument('project marks not given', 'Academic');
categoryClassifier.addDocument('lab record marks pending', 'Academic');
categoryClassifier.addDocument('viva marks not updated', 'Academic');
categoryClassifier.addDocument('hall ticket not issued before exam', 'Academic');
categoryClassifier.addDocument('student barred from exam despite attendance', 'Academic');
categoryClassifier.addDocument('special exam not arranged for medical emergency', 'Academic');
categoryClassifier.addDocument('invigilation was partial', 'Academic');
categoryClassifier.addDocument('suspected paper leak in exam', 'Academic');
categoryClassifier.addDocument('wrong marks uploaded in portal', 'Academic');
categoryClassifier.addDocument('marks not updated for 3 days', 'Academic');
categoryClassifier.addDocument('course registration error', 'Academic');
categoryClassifier.addDocument('semester registration issue', 'Academic');
categoryClassifier.addDocument('elective not allotted as requested', 'Academic');
categoryClassifier.addDocument('timetable clash in subjects', 'Academic');
categoryClassifier.addDocument('bonafide certificate delayed', 'Academic');
categoryClassifier.addDocument('transfer certificate not issued', 'Academic');
categoryClassifier.addDocument('migration certificate pending', 'Academic');
categoryClassifier.addDocument('fee receipt not given', 'Academic');
categoryClassifier.addDocument('scholarship not processed', 'Academic');
categoryClassifier.addDocument('college ID not issued', 'Academic');
categoryClassifier.addDocument('no response from exam cell', 'Academic');
categoryClassifier.addDocument('office staff not helpful', 'Academic');
categoryClassifier.addDocument('dean not responding', 'Academic');
categoryClassifier.addDocument('HOD not available for meeting', 'Academic');
categoryClassifier.addDocument('documents not returned', 'Academic');
categoryClassifier.addDocument('original documents withheld by college', 'Academic');
categoryClassifier.addDocument('library books not available', 'Academic');
categoryClassifier.addDocument('required textbook not in library', 'Academic');
categoryClassifier.addDocument('library closing too early', 'Academic');
categoryClassifier.addDocument('library not open on weekends', 'Academic');
categoryClassifier.addDocument('library computers not working', 'Academic');
categoryClassifier.addDocument('library is very noisy', 'Academic');
categoryClassifier.addDocument('librarian not helpful', 'Academic');
categoryClassifier.addDocument('book not returned properly recorded', 'Academic');
categoryClassifier.addDocument('fine charged wrongly in library', 'Academic');
categoryClassifier.addDocument('digital library access not working', 'Academic');
categoryClassifier.addDocument('journal access not available', 'Academic');
categoryClassifier.addDocument('book reservation system not working', 'Academic');
categoryClassifier.addDocument('lab equipment not working', 'Academic');
categoryClassifier.addDocument('computers in lab very slow', 'Academic');
categoryClassifier.addDocument('lab software not installed', 'Academic');
categoryClassifier.addDocument('lab not open during free hours', 'Academic');
categoryClassifier.addDocument('practical classes not conducted', 'Academic');
categoryClassifier.addDocument('lab manual not provided', 'Academic');
categoryClassifier.addDocument('lab components missing', 'Academic');
categoryClassifier.addDocument('lab staff not available', 'Academic');
categoryClassifier.addDocument('experiment not allowed to redo', 'Academic');
categoryClassifier.addDocument('lab record submission issue', 'Academic');
categoryClassifier.addDocument('placement cell not responsive', 'Academic');
categoryClassifier.addDocument('placement staff partial in shortlisting', 'Academic');
categoryClassifier.addDocument('no internship guidance available', 'Academic');
categoryClassifier.addDocument('company blacklisted but allowed to recruit', 'Academic');
categoryClassifier.addDocument('resume stolen or used without consent', 'Academic');
categoryClassifier.addDocument('batch segregation based on performance', 'Academic');
categoryClassifier.addDocument('no accommodation for mental health in exam', 'Academic');
categoryClassifier.addDocument('disability accommodation denied in exam', 'Academic');
categoryClassifier.addDocument('visually impaired student not given reader', 'Academic');
categoryClassifier.addDocument('hearing impaired student not given captioning', 'Academic');
categoryClassifier.addDocument('exam accommodation for disability denied', 'Academic');
categoryClassifier.addDocument('academic pressure causing distress no support', 'Academic');

// ─────────────────────────────────────────────
// INFRASTRUCTURE
// ─────────────────────────────────────────────
categoryClassifier.addDocument('projector not working in classroom', 'Infrastructure');
categoryClassifier.addDocument('classroom projector bulb fused', 'Infrastructure');
categoryClassifier.addDocument('no projector in lecture hall', 'Infrastructure');
categoryClassifier.addDocument('AC not working in classroom', 'Infrastructure');
categoryClassifier.addDocument('air conditioner not cooling', 'Infrastructure');
categoryClassifier.addDocument('classroom very hot', 'Infrastructure');
categoryClassifier.addDocument('benches broken in classroom', 'Infrastructure');
categoryClassifier.addDocument('chairs damaged in lecture hall', 'Infrastructure');
categoryClassifier.addDocument('blackboard not clean', 'Infrastructure');
categoryClassifier.addDocument('whiteboard marker not available', 'Infrastructure');
categoryClassifier.addDocument('classroom lights not working', 'Infrastructure');
categoryClassifier.addDocument('fans in classroom not working', 'Infrastructure');
categoryClassifier.addDocument('speaker system not working in hall', 'Infrastructure');
categoryClassifier.addDocument('microphone not working in auditorium', 'Infrastructure');
categoryClassifier.addDocument('smart board not functioning', 'Infrastructure');
categoryClassifier.addDocument('classroom overcrowded beyond capacity', 'Infrastructure');
categoryClassifier.addDocument('building paint peeling walls dirty', 'Infrastructure');
categoryClassifier.addDocument('drinking water not available on campus', 'Infrastructure');
categoryClassifier.addDocument('water cooler not working', 'Infrastructure');
categoryClassifier.addDocument('water purifier broken', 'Infrastructure');
categoryClassifier.addDocument('RO water machine not working', 'Infrastructure');
categoryClassifier.addDocument('dustbins not emptied on campus', 'Infrastructure');
categoryClassifier.addDocument('campus very dirty', 'Infrastructure');
categoryClassifier.addDocument('garbage not collected', 'Infrastructure');
categoryClassifier.addDocument('campus roads have potholes', 'Infrastructure');
categoryClassifier.addDocument('pathway lights not working', 'Infrastructure');
categoryClassifier.addDocument('street lights broken on campus', 'Infrastructure');
categoryClassifier.addDocument('campus lighting poor at night', 'Infrastructure');
categoryClassifier.addDocument('parking area no proper management', 'Infrastructure');
categoryClassifier.addDocument('cycle parking not available', 'Infrastructure');
categoryClassifier.addDocument('bike parking full always', 'Infrastructure');
categoryClassifier.addDocument('toilet on campus very dirty', 'Infrastructure');
categoryClassifier.addDocument('washroom not cleaned regularly', 'Infrastructure');
categoryClassifier.addDocument('no soap in campus washroom', 'Infrastructure');
categoryClassifier.addDocument('hand wash not available', 'Infrastructure');
categoryClassifier.addDocument('toilet paper not available', 'Infrastructure');
categoryClassifier.addDocument('washroom tap not working', 'Infrastructure');
categoryClassifier.addDocument('campus toilet blocked', 'Infrastructure');
categoryClassifier.addDocument('bad smell in campus washroom', 'Infrastructure');
categoryClassifier.addDocument('no dustbin in washroom', 'Infrastructure');
categoryClassifier.addDocument('ladies washroom not clean', 'Infrastructure');
categoryClassifier.addDocument('gents toilet door broken', 'Infrastructure');
categoryClassifier.addDocument('no sanitary pad disposal in campus washroom', 'Infrastructure');
categoryClassifier.addDocument('power cut in academic block', 'Infrastructure');
categoryClassifier.addDocument('no electricity in department', 'Infrastructure');
categoryClassifier.addDocument('generator not working during power cut', 'Infrastructure');
categoryClassifier.addDocument('UPS not functioning in lab', 'Infrastructure');
categoryClassifier.addDocument('college bus not on time', 'Infrastructure');
categoryClassifier.addDocument('bus route changed without notice', 'Infrastructure');
categoryClassifier.addDocument('college transport issue', 'Infrastructure');
categoryClassifier.addDocument('bus driver rash driving', 'Infrastructure');
categoryClassifier.addDocument('bus AC not working', 'Infrastructure');
categoryClassifier.addDocument('bus very overcrowded', 'Infrastructure');
categoryClassifier.addDocument('no bus for certain routes', 'Infrastructure');
categoryClassifier.addDocument('bus schedule not published', 'Infrastructure');
categoryClassifier.addDocument('sports ground not maintained', 'Infrastructure');
categoryClassifier.addDocument('medical room closed', 'Infrastructure');
categoryClassifier.addDocument('college doctor not available', 'Infrastructure');
categoryClassifier.addDocument('first aid kit empty', 'Infrastructure');
categoryClassifier.addDocument('ambulance not available', 'Infrastructure');
categoryClassifier.addDocument('fire extinguisher missing', 'Infrastructure');
categoryClassifier.addDocument('no CCTV in corridor', 'Infrastructure');
categoryClassifier.addDocument('ramp for disabled students not built', 'Infrastructure');
categoryClassifier.addDocument('elevator not working in block', 'Infrastructure');
categoryClassifier.addDocument('construction waste blocking pathway', 'Infrastructure');
categoryClassifier.addDocument('staircase railing broken', 'Infrastructure');
categoryClassifier.addDocument('floor tiles broken in corridor', 'Infrastructure');
categoryClassifier.addDocument('building wall cracked', 'Infrastructure');
categoryClassifier.addDocument('seepage in department ceiling', 'Infrastructure');
categoryClassifier.addDocument('no wheelchair ramp in building', 'Infrastructure');
categoryClassifier.addDocument('no accessible toilet on campus', 'Infrastructure');
categoryClassifier.addDocument('sign language interpreter not available', 'Infrastructure');

// ─────────────────────────────────────────────
// IT
// ─────────────────────────────────────────────
categoryClassifier.addDocument('campus wifi not working', 'IT');
categoryClassifier.addDocument('internet very slow on campus', 'IT');
categoryClassifier.addDocument('wifi disconnects frequently', 'IT');
categoryClassifier.addDocument('wifi password not shared to new students', 'IT');
categoryClassifier.addDocument('no wifi coverage in certain buildings', 'IT');
categoryClassifier.addDocument('wifi works only in some floors', 'IT');
categoryClassifier.addDocument('bandwidth very low during peak hours', 'IT');
categoryClassifier.addDocument('wifi blocked on certain websites without reason', 'IT');
categoryClassifier.addDocument('LAN cable not working in lab', 'IT');
categoryClassifier.addDocument('network port not active at workstation', 'IT');
categoryClassifier.addDocument('VPN access not provided', 'IT');
categoryClassifier.addDocument('college intranet not accessible', 'IT');
categoryClassifier.addDocument('network drive not mounting', 'IT');
categoryClassifier.addDocument('shared folder access denied', 'IT');
categoryClassifier.addDocument('required software not installed on lab computers', 'IT');
categoryClassifier.addDocument('software license expired on college computers', 'IT');
categoryClassifier.addDocument('outdated operating system on lab computers', 'IT');
categoryClassifier.addDocument('antivirus not updated causing virus infection', 'IT');
categoryClassifier.addDocument('college ERP portal not working', 'IT');
categoryClassifier.addDocument('ERP portal very slow', 'IT');
categoryClassifier.addDocument('unable to login to student portal', 'IT');
categoryClassifier.addDocument('portal showing wrong data', 'IT');
categoryClassifier.addDocument('portal session expiring too quickly', 'IT');
categoryClassifier.addDocument('fee payment gateway not working on portal', 'IT');
categoryClassifier.addDocument('exam registration portal crashing', 'IT');
categoryClassifier.addDocument('timetable not updated on portal', 'IT');
categoryClassifier.addDocument('college email account not created for new student', 'IT');
categoryClassifier.addDocument('email password reset not working', 'IT');
categoryClassifier.addDocument('official communication not received via college email', 'IT');
categoryClassifier.addDocument('spam flooding college inbox', 'IT');
categoryClassifier.addDocument('email storage quota exceeded', 'IT');
categoryClassifier.addDocument('computer in lab not starting', 'IT');
categoryClassifier.addDocument('monitor broken in lab', 'IT');
categoryClassifier.addDocument('keyboard or mouse not working in lab', 'IT');
categoryClassifier.addDocument('printer in lab not working', 'IT');
categoryClassifier.addDocument('scanner not available', 'IT');
categoryClassifier.addDocument('projector remote missing', 'IT');
categoryClassifier.addDocument('HDMI cable not available in classroom', 'IT');
categoryClassifier.addDocument('charging points not available in library', 'IT');
categoryClassifier.addDocument('power socket broken at workstation', 'IT');
categoryClassifier.addDocument('IT helpdesk not responding', 'IT');
categoryClassifier.addDocument('IT staff unavailable', 'IT');
categoryClassifier.addDocument('complaint raised to IT department no follow up', 'IT');
categoryClassifier.addDocument('remote support not provided', 'IT');
categoryClassifier.addDocument('software installation request pending for weeks', 'IT');
categoryClassifier.addDocument('CCTV camera broken in corridor', 'IT');
categoryClassifier.addDocument('CCTV footage not available when needed', 'IT');
categoryClassifier.addDocument('surveillance blind spots reported', 'IT');
categoryClassifier.addDocument('DVR not recording properly', 'IT');
categoryClassifier.addDocument('biometric attendance machine not working', 'IT');
categoryClassifier.addDocument('fingerprint not registering in biometric', 'IT');
categoryClassifier.addDocument('face recognition system failing', 'IT');
categoryClassifier.addDocument('smart card access door not opening', 'IT');
categoryClassifier.addDocument('ID card swipe not working at gate', 'IT');
categoryClassifier.addDocument('online class link not working', 'IT');
categoryClassifier.addDocument('zoom or teams not accessible on campus network', 'IT');
categoryClassifier.addDocument('college app crashing on mobile', 'IT');
categoryClassifier.addDocument('results not showing on portal', 'IT');
categoryClassifier.addDocument('admit card download not working', 'IT');
categoryClassifier.addDocument('password reset OTP not received', 'IT');

// ─────────────────────────────────────────────
// CAFETERIA
// ─────────────────────────────────────────────
categoryClassifier.addDocument('canteen food quality bad', 'Cafeteria');
categoryClassifier.addDocument('canteen prices too high', 'Cafeteria');
categoryClassifier.addDocument('canteen not open on time', 'Cafeteria');
categoryClassifier.addDocument('cafeteria very dirty', 'Cafeteria');
categoryClassifier.addDocument('food stale in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('raw or undercooked food served in canteen', 'Cafeteria');
categoryClassifier.addDocument('food smells bad in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('repetitive menu in canteen no variety', 'Cafeteria');
categoryClassifier.addDocument('no nutritious options in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('junk food only available in canteen', 'Cafeteria');
categoryClassifier.addDocument('special dietary need not met in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('no diabetic or low calorie options', 'Cafeteria');
categoryClassifier.addDocument('no vegetarian option in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('serving area dirty in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('serving staff not wearing gloves in canteen', 'Cafeteria');
categoryClassifier.addDocument('utensils not properly washed in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('flies and insects near food in canteen', 'Cafeteria');
categoryClassifier.addDocument('drainage in cafeteria blocked', 'Cafeteria');
categoryClassifier.addDocument('tables not wiped in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('floor wet and slippery in canteen', 'Cafeteria');
categoryClassifier.addDocument('overpriced items in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('price not displayed on menu board', 'Cafeteria');
categoryClassifier.addDocument('charged more than displayed price in canteen', 'Cafeteria');
categoryClassifier.addDocument('no bill given in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('digital payment not accepted in canteen', 'Cafeteria');
categoryClassifier.addDocument('change not given properly in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('extra items added to bill without ordering', 'Cafeteria');
categoryClassifier.addDocument('long queues at canteen counter', 'Cafeteria');
categoryClassifier.addDocument('slow service during lunch in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('cafeteria closes before official time', 'Cafeteria');
categoryClassifier.addDocument('canteen not open on weekends', 'Cafeteria');
categoryClassifier.addDocument('counter staff rude in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('menu items unavailable frequently in canteen', 'Cafeteria');
categoryClassifier.addDocument('water not available at cafeteria tables', 'Cafeteria');
categoryClassifier.addDocument('seating insufficient in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('seating area not clean in canteen', 'Cafeteria');
categoryClassifier.addDocument('no dustbins near seating in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('AC not working in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('fans not working in canteen', 'Cafeteria');
categoryClassifier.addDocument('no separate queue for girls in canteen', 'Cafeteria');
categoryClassifier.addDocument('vending machine broken', 'Cafeteria');
categoryClassifier.addDocument('vending machine overpriced', 'Cafeteria');
categoryClassifier.addDocument('food items taken from canteen expired', 'Cafeteria');
categoryClassifier.addDocument('no receipt given in cafeteria', 'Cafeteria');
categoryClassifier.addDocument('serving staff wearing dirty uniform', 'Cafeteria');
categoryClassifier.addDocument('hair found in canteen food', 'Cafeteria');
categoryClassifier.addDocument('cockroaches in cafeteria kitchen', 'Cafeteria');
categoryClassifier.addDocument('rats seen near canteen food area', 'Cafeteria');
categoryClassifier.addDocument('food quantity reduced without price change', 'Cafeteria');
categoryClassifier.addDocument('canteen owner rude to students', 'Cafeteria');

// ─────────────────────────────────────────────
// SPORTS
// ─────────────────────────────────────────────
categoryClassifier.addDocument('sports ground not maintained', 'Sports');
categoryClassifier.addDocument('grass overgrown on sports ground', 'Sports');
categoryClassifier.addDocument('cricket pitch broken', 'Sports');
categoryClassifier.addDocument('football ground has potholes', 'Sports');
categoryClassifier.addDocument('basketball court surface cracked', 'Sports');
categoryClassifier.addDocument('volleyball net missing', 'Sports');
categoryClassifier.addDocument('badminton court lights not working', 'Sports');
categoryClassifier.addDocument('tennis court not maintained', 'Sports');
categoryClassifier.addDocument('athletics track broken', 'Sports');
categoryClassifier.addDocument('cricket pitch waterlogged', 'Sports');
categoryClassifier.addDocument('sports equipment not available', 'Sports');
categoryClassifier.addDocument('sports room always locked', 'Sports');
categoryClassifier.addDocument('equipment old and damaged in sports room', 'Sports');
categoryClassifier.addDocument('no replacement equipment when damaged', 'Sports');
categoryClassifier.addDocument('ball pump missing', 'Sports');
categoryClassifier.addDocument('cricket stumps missing', 'Sports');
categoryClassifier.addDocument('volleyball net torn', 'Sports');
categoryClassifier.addDocument('no storage for personal sports gear', 'Sports');
categoryClassifier.addDocument('no system to book sports facility', 'Sports');
categoryClassifier.addDocument('sports facility always occupied by same group', 'Sports');
categoryClassifier.addDocument('no fair rotation policy for sports', 'Sports');
categoryClassifier.addDocument('students from certain departments denied sports access', 'Sports');
categoryClassifier.addDocument('coach or trainer not available', 'Sports');
categoryClassifier.addDocument('no scheduled practice slots for teams', 'Sports');
categoryClassifier.addDocument('gym equipment broken', 'Sports');
categoryClassifier.addDocument('gym not cleaned regularly', 'Sports');
categoryClassifier.addDocument('gym closed without notice', 'Sports');
categoryClassifier.addDocument('gym timings too restrictive', 'Sports');
categoryClassifier.addDocument('no trainer or instructor in gym', 'Sports');
categoryClassifier.addDocument('overcrowded gym no queue management', 'Sports');
categoryClassifier.addDocument('gym mirrors broken', 'Sports');
categoryClassifier.addDocument('no proper ventilation in gym', 'Sports');
categoryClassifier.addDocument('swimming pool not cleaned regularly', 'Sports');
categoryClassifier.addDocument('pool chemicals unbalanced causing skin issues', 'Sports');
categoryClassifier.addDocument('swimming pool closed without notice', 'Sports');
categoryClassifier.addDocument('no lifeguard present at swimming pool', 'Sports');
categoryClassifier.addDocument('no swimming instructor', 'Sports');
categoryClassifier.addDocument('pool timings not convenient', 'Sports');
categoryClassifier.addDocument('changing room dirty near pool', 'Sports');
categoryClassifier.addDocument('no support for inter college tournaments', 'Sports');
categoryClassifier.addDocument('no travel allowance for sports events', 'Sports');
categoryClassifier.addDocument('college team selection process unfair', 'Sports');
categoryClassifier.addDocument('sports achievements not recognized', 'Sports');
categoryClassifier.addDocument('no certificates given for sports participation', 'Sports');
categoryClassifier.addDocument('sports quota seats not given correctly', 'Sports');
categoryClassifier.addDocument('football ground lights not working', 'Sports');
categoryClassifier.addDocument('indoor sports hall not available', 'Sports');
categoryClassifier.addDocument('table tennis table broken', 'Sports');
categoryClassifier.addDocument('chess board and pieces missing', 'Sports');
categoryClassifier.addDocument('carrom board damaged', 'Sports');
categoryClassifier.addDocument('sports day event not organized', 'Sports');
categoryClassifier.addDocument('inter department sports not conducted', 'Sports');
categoryClassifier.addDocument('no first aid available at sports ground', 'Sports');

// ─────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────
categoryClassifier.addDocument('excess fee charged', 'Finance');
categoryClassifier.addDocument('wrong fee amount in challan', 'Finance');
categoryClassifier.addDocument('fee payment portal not working', 'Finance');
categoryClassifier.addDocument('fee receipt not generated after payment', 'Finance');
categoryClassifier.addDocument('duplicate fee deducted', 'Finance');
categoryClassifier.addDocument('fee deadline not communicated in advance', 'Finance');
categoryClassifier.addDocument('late fee charged even when portal was down', 'Finance');
categoryClassifier.addDocument('scholarship not applied after submitting documents', 'Finance');
categoryClassifier.addDocument('scholarship amount not credited to account', 'Finance');
categoryClassifier.addDocument('wrong scholarship amount disbursed', 'Finance');
categoryClassifier.addDocument('scholarship status not updated on portal', 'Finance');
categoryClassifier.addDocument('documents submitted but no acknowledgment from finance', 'Finance');
categoryClassifier.addDocument('scholarship cancelled without valid reason', 'Finance');
categoryClassifier.addDocument('SC ST OBC scholarship delayed', 'Finance');
categoryClassifier.addDocument('government scholarship not forwarded by college', 'Finance');
categoryClassifier.addDocument('caution deposit not refunded after course completion', 'Finance');
categoryClassifier.addDocument('fee refund not processed after withdrawal', 'Finance');
categoryClassifier.addDocument('refund amount incorrect', 'Finance');
categoryClassifier.addDocument('refund delay beyond 3 months', 'Finance');
categoryClassifier.addDocument('no communication on refund status', 'Finance');
categoryClassifier.addDocument('fee receipt not given', 'Finance');
categoryClassifier.addDocument('original receipt lost by office duplicate denied', 'Finance');
categoryClassifier.addDocument('no breakdown of fee structure provided', 'Finance');
categoryClassifier.addDocument('hidden charges not disclosed at admission', 'Finance');
categoryClassifier.addDocument('hostel fee charged for months student was not residing', 'Finance');
categoryClassifier.addDocument('stipend for project not released', 'Finance');
categoryClassifier.addDocument('stipend for internship not released', 'Finance');
categoryClassifier.addDocument('financial aid application rejected without reason', 'Finance');
categoryClassifier.addDocument('emergency financial assistance not available', 'Finance');
categoryClassifier.addDocument('no information about available financial aid schemes', 'Finance');
categoryClassifier.addDocument('accounts staff unavailable', 'Finance');
categoryClassifier.addDocument('accounts staff rude', 'Finance');
categoryClassifier.addDocument('accounts office closed during working hours', 'Finance');
categoryClassifier.addDocument('no proper queue management in accounts office', 'Finance');
categoryClassifier.addDocument('grievance submitted to accounts office no response', 'Finance');
categoryClassifier.addDocument('wrong bank account details updated causing payment failure', 'Finance');
categoryClassifier.addDocument('fee hike without prior notice', 'Finance');
categoryClassifier.addDocument('no installment option for fee payment', 'Finance');
categoryClassifier.addDocument('examination fee charged multiple times', 'Finance');
categoryClassifier.addDocument('bus fee charged but bus service not provided', 'Finance');
categoryClassifier.addDocument('lab fee charged but equipment not available', 'Finance');
categoryClassifier.addDocument('library fine charged incorrectly', 'Finance');
categoryClassifier.addDocument('sports fee charged but sports facility not accessible', 'Finance');
categoryClassifier.addDocument('no fee concession given despite eligibility', 'Finance');
categoryClassifier.addDocument('merit scholarship not given despite qualifying marks', 'Finance');
categoryClassifier.addDocument('national merit scholarship documents not forwarded', 'Finance');
categoryClassifier.addDocument('fee payment receipt shows wrong student name', 'Finance');
categoryClassifier.addDocument('UPI payment deducted but not reflected in portal', 'Finance');
categoryClassifier.addDocument('net banking payment failed but amount debited', 'Finance');

// ─────────────────────────────────────────────
// SECURITY
// ─────────────────────────────────────────────
categoryClassifier.addDocument('outsiders entering campus without ID check', 'Security');
categoryClassifier.addDocument('students harassed at gate for no reason', 'Security');
categoryClassifier.addDocument('late entry denied even with valid reason', 'Security');
categoryClassifier.addDocument('visitor pass system not followed', 'Security');
categoryClassifier.addDocument('gate closed before official time', 'Security');
categoryClassifier.addDocument('bike entry refused without clear rule', 'Security');
categoryClassifier.addDocument('security staff sleeping at post', 'Security');
categoryClassifier.addDocument('theft reported but no action taken', 'Security');
categoryClassifier.addDocument('CCTV footage not provided to student after theft', 'Security');
categoryClassifier.addDocument('complaint to security ignored', 'Security');
categoryClassifier.addDocument('security not patrolling at night', 'Security');
categoryClassifier.addDocument('valuables stolen from classroom', 'Security');
categoryClassifier.addDocument('valuables stolen from lab', 'Security');
categoryClassifier.addDocument('no investigation after theft', 'Security');
categoryClassifier.addDocument('security staff behaving inappropriately with female students', 'Security');
categoryClassifier.addDocument('security staff using abusive language', 'Security');
categoryClassifier.addDocument('security threatening students', 'Security');
categoryClassifier.addDocument('security staff accepting bribes at gate', 'Security');
categoryClassifier.addDocument('security did not respond during fight on campus', 'Security');
categoryClassifier.addDocument('no emergency contact number at gate', 'Security');
categoryClassifier.addDocument('security unavailable during medical emergency', 'Security');
categoryClassifier.addDocument('no protocol followed during fire alarm', 'Security');
categoryClassifier.addDocument('no female security guard for ladies area', 'Security');
categoryClassifier.addDocument('ladies area gate not monitored at night', 'Security');
categoryClassifier.addDocument('no emergency panic button in isolated area', 'Security');
categoryClassifier.addDocument('no safety light in isolated area of campus', 'Security');
categoryClassifier.addDocument('no escort service for late night campus access', 'Security');
categoryClassifier.addDocument('ragging reported to security but ignored', 'Security');
categoryClassifier.addDocument('security witnessed misconduct and did not act', 'Security');
categoryClassifier.addDocument('security partial to senior students', 'Security');
categoryClassifier.addDocument('security partial to certain groups', 'Security');
categoryClassifier.addDocument('vehicle theft in college parking', 'Security');
categoryClassifier.addDocument('bike stolen from college parking', 'Security');
categoryClassifier.addDocument('no security camera in parking area', 'Security');
categoryClassifier.addDocument('security guard absent from post', 'Security');
categoryClassifier.addDocument('unauthorized person found inside college building', 'Security');
categoryClassifier.addDocument('drug use reported on campus security not acting', 'Security');
categoryClassifier.addDocument('eve teasing on campus security ignored', 'Security');
categoryClassifier.addDocument('stalking on campus reported to security no action', 'Security');
categoryClassifier.addDocument('physical assault on campus security did not help', 'Security');
categoryClassifier.addDocument('security denied entry to student without reason', 'Security');
categoryClassifier.addDocument('night watchman not present', 'Security');
categoryClassifier.addDocument('college boundary wall broken anyone can enter', 'Security');
categoryClassifier.addDocument('gate register not maintained properly', 'Security');
categoryClassifier.addDocument('security did not check visitor ID', 'Security');
categoryClassifier.addDocument('fire safety drill not conducted', 'Security');
categoryClassifier.addDocument('emergency exit blocked', 'Security');
categoryClassifier.addDocument('fire exit door locked', 'Security');
categoryClassifier.addDocument('no safety signage on campus', 'Security');


// ─────────────────────────────────────────────
// PRIORITY CLASSIFIER
// ─────────────────────────────────────────────
priorityClassifier.addDocument('not working since many days', 'High');
priorityClassifier.addDocument('urgent please fix immediately', 'High');
priorityClassifier.addDocument('emergency situation', 'High');
priorityClassifier.addDocument('no water since 2 days', 'High');
priorityClassifier.addDocument('no electricity since yesterday', 'High');
priorityClassifier.addDocument('exam tomorrow and this is broken', 'High');
priorityClassifier.addDocument('health issue because of this', 'High');
priorityClassifier.addDocument('feeling unsafe', 'High');
priorityClassifier.addDocument('security threat', 'High');
priorityClassifier.addDocument('ragging happening', 'High');
priorityClassifier.addDocument('theft occurred', 'High');
priorityClassifier.addDocument('medical emergency', 'High');
priorityClassifier.addDocument('doctor not available urgent', 'High');
priorityClassifier.addDocument('fire risk', 'High');
priorityClassifier.addDocument('extremely serious issue', 'High');
priorityClassifier.addDocument('this is a critical problem', 'High');
priorityClassifier.addDocument('nobody is responding since days', 'High');
priorityClassifier.addDocument('complained multiple times no action', 'High');
priorityClassifier.addDocument('exam marks wrong need correction urgently', 'High');
priorityClassifier.addDocument('hall ticket not issued exam tomorrow', 'High');
priorityClassifier.addDocument('no food available in mess', 'High');
priorityClassifier.addDocument('sewage overflow', 'High');
priorityClassifier.addDocument('water logging in room', 'High');
priorityClassifier.addDocument('roof about to collapse', 'High');
priorityClassifier.addDocument('mental health issue due to this', 'High');
priorityClassifier.addDocument('physical assault happened', 'High');
priorityClassifier.addDocument('sexual harassment reported', 'High');
priorityClassifier.addDocument('stalking happening', 'High');
priorityClassifier.addDocument('threat received from senior', 'High');
priorityClassifier.addDocument('drug use happening on campus', 'High');
priorityClassifier.addDocument('fire extinguisher missing emergency', 'High');
priorityClassifier.addDocument('emergency exit blocked dangerous', 'High');
priorityClassifier.addDocument('no lifeguard at pool risk', 'High');
priorityClassifier.addDocument('food poisoning symptoms after mess', 'High');
priorityClassifier.addDocument('duplicate fee deducted multiple times', 'High');
priorityClassifier.addDocument('scholarship cancelled urgently need help', 'High');
priorityClassifier.addDocument('outsiders inside hostel at night', 'High');
priorityClassifier.addDocument('eve teasing happening on campus', 'High');

priorityClassifier.addDocument('not working since yesterday', 'Medium');
priorityClassifier.addDocument('issue since 2 days', 'Medium');
priorityClassifier.addDocument('please fix this soon', 'Medium');
priorityClassifier.addDocument('affecting my studies', 'Medium');
priorityClassifier.addDocument('class getting disrupted', 'Medium');
priorityClassifier.addDocument('inconvenience every day', 'Medium');
priorityClassifier.addDocument('happening frequently', 'Medium');
priorityClassifier.addDocument('this keeps repeating', 'Medium');
priorityClassifier.addDocument('need resolution within this week', 'Medium');
priorityClassifier.addDocument('attendance issue need to fix', 'Medium');
priorityClassifier.addDocument('marks not updated for 3 days', 'Medium');
priorityClassifier.addDocument('wifi slow since few days', 'Medium');
priorityClassifier.addDocument('food quality bad regularly', 'Medium');
priorityClassifier.addDocument('bathroom dirty for 2 days', 'Medium');
priorityClassifier.addDocument('lab computer not working today', 'Medium');
priorityClassifier.addDocument('fee issue needs resolution this week', 'Medium');
priorityClassifier.addDocument('scholarship status not updated for a week', 'Medium');
priorityClassifier.addDocument('sports room locked for 2 days', 'Medium');
priorityClassifier.addDocument('canteen overcharging regularly', 'Medium');
priorityClassifier.addDocument('IT portal slow every day', 'Medium');
priorityClassifier.addDocument('security ignoring complaints repeatedly', 'Medium');

priorityClassifier.addDocument('minor issue', 'Low');
priorityClassifier.addDocument('small problem', 'Low');
priorityClassifier.addDocument('not very urgent', 'Low');
priorityClassifier.addDocument('when possible please fix', 'Low');
priorityClassifier.addDocument('suggestion for improvement', 'Low');
priorityClassifier.addDocument('just noticed this', 'Low');
priorityClassifier.addDocument('can be fixed anytime', 'Low');
priorityClassifier.addDocument('slight inconvenience', 'Low');
priorityClassifier.addDocument('not a big issue but wanted to report', 'Low');
priorityClassifier.addDocument('feedback for betterment', 'Low');
priorityClassifier.addDocument('whiteboard marker missing', 'Low');
priorityClassifier.addDocument('dustbin full in corridor', 'Low');
priorityClassifier.addDocument('broken bench in last row', 'Low');
priorityClassifier.addDocument('vending machine slightly overpriced', 'Low');
priorityClassifier.addDocument('gym mirror cracked small', 'Low');
priorityClassifier.addDocument('sports schedule not published', 'Low');
priorityClassifier.addDocument('canteen menu board faded', 'Low');
priorityClassifier.addDocument('charging point not working at one desk', 'Low');


// ─────────────────────────────────────────────
// SENTIMENT CLASSIFIER
// ─────────────────────────────────────────────
sentimentClassifier.addDocument('this is absolutely unacceptable', 'Angry');
sentimentClassifier.addDocument('nobody cares about students', 'Angry');
sentimentClassifier.addDocument('I am very frustrated', 'Angry');
sentimentClassifier.addDocument('this is disgusting', 'Angry');
sentimentClassifier.addDocument('I am fed up with this', 'Angry');
sentimentClassifier.addDocument('worst management ever', 'Angry');
sentimentClassifier.addDocument('shameful situation', 'Angry');
sentimentClassifier.addDocument('no one is listening', 'Angry');
sentimentClassifier.addDocument('I have complained so many times', 'Angry');
sentimentClassifier.addDocument('still no action taken', 'Angry');
sentimentClassifier.addDocument('this college does not care', 'Angry');
sentimentClassifier.addDocument('pathetic condition', 'Angry');
sentimentClassifier.addDocument('terrible state of things', 'Angry');
sentimentClassifier.addDocument('I am very angry about this', 'Angry');
sentimentClassifier.addDocument('this is not acceptable at all', 'Angry');
sentimentClassifier.addDocument('very disappointed with management', 'Angry');
sentimentClassifier.addDocument('nobody takes action here', 'Angry');
sentimentClassifier.addDocument('I will escalate this further', 'Angry');
sentimentClassifier.addDocument('hopeless situation', 'Angry');
sentimentClassifier.addDocument('bro this is so frustrating', 'Angry');
sentimentClassifier.addDocument('yaar kuch nahi hota yahan', 'Angry');
sentimentClassifier.addDocument('I feel unsafe here', 'Angry');
sentimentClassifier.addDocument('this is harassment', 'Angry');
sentimentClassifier.addDocument('I am being treated unfairly', 'Angry');
sentimentClassifier.addDocument('this discrimination is unacceptable', 'Angry');
sentimentClassifier.addDocument('I demand immediate action', 'Angry');
sentimentClassifier.addDocument('this is outrageous', 'Angry');
sentimentClassifier.addDocument('I have lost faith in the system', 'Angry');
sentimentClassifier.addDocument('nobody helps here', 'Angry');
sentimentClassifier.addDocument('management is completely useless', 'Angry');
sentimentClassifier.addDocument('I will complain to higher authorities', 'Angry');
sentimentClassifier.addDocument('this is cheating students', 'Angry');
sentimentClassifier.addDocument('wasting our money', 'Angry');

sentimentClassifier.addDocument('please look into this issue', 'Neutral');
sentimentClassifier.addDocument('kindly fix this problem', 'Neutral');
sentimentClassifier.addDocument('requesting you to resolve', 'Neutral');
sentimentClassifier.addDocument('this needs attention', 'Neutral');
sentimentClassifier.addDocument('I am reporting this issue', 'Neutral');
sentimentClassifier.addDocument('wanted to bring this to notice', 'Neutral');
sentimentClassifier.addDocument('please take necessary action', 'Neutral');
sentimentClassifier.addDocument('this is a problem that needs fixing', 'Neutral');
sentimentClassifier.addDocument('hoping for quick resolution', 'Neutral');
sentimentClassifier.addDocument('please address this at earliest', 'Neutral');
sentimentClassifier.addDocument('this has been happening', 'Neutral');
sentimentClassifier.addDocument('I noticed this issue today', 'Neutral');
sentimentClassifier.addDocument('submitting this complaint formally', 'Neutral');
sentimentClassifier.addDocument('kindly look into this matter', 'Neutral');
sentimentClassifier.addDocument('request you to please check', 'Neutral');
sentimentClassifier.addDocument('this issue requires attention', 'Neutral');
sentimentClassifier.addDocument('I am informing about this problem', 'Neutral');
sentimentClassifier.addDocument('please resolve at the earliest', 'Neutral');

sentimentClassifier.addDocument('I understand you are busy but please help', 'Calm');
sentimentClassifier.addDocument('I humbly request you to fix', 'Calm');
sentimentClassifier.addDocument('thank you for your attention', 'Calm');
sentimentClassifier.addDocument('I appreciate your efforts', 'Calm');
sentimentClassifier.addDocument('please help whenever possible', 'Calm');
sentimentClassifier.addDocument('I politely request resolution', 'Calm');
sentimentClassifier.addDocument('I believe this can be fixed soon', 'Calm');
sentimentClassifier.addDocument('grateful if this is resolved', 'Calm');
sentimentClassifier.addDocument('this is a small request', 'Calm');
sentimentClassifier.addDocument('no urgency but please look into it', 'Calm');
sentimentClassifier.addDocument('I trust the management will resolve this', 'Calm');
sentimentClassifier.addDocument('just bringing this to your kind notice', 'Calm');
sentimentClassifier.addDocument('I hope this gets resolved', 'Calm');
sentimentClassifier.addDocument('with due respect I want to report', 'Calm');
sentimentClassifier.addDocument('I am sure the team will look into this', 'Calm');
sentimentClassifier.addDocument('kindly consider this request', 'Calm');
sentimentClassifier.addDocument('I have faith this will be fixed', 'Calm');

// ─────────────────────────────────────────────
// SPAM CLASSIFIER (Bonus)
// ─────────────────────────────────────────────
const spamDocs = [
  'asdfghjkl zxcvbnm qwerty', 'test test test 1234', 'buy cheap cryptocurrency here',
  'click this link for free iphone', 'lorem ipsum dolor sit amet', 'fuck this stupid college',
  'subscribe to my channel', 'casino online', 'get rich quick scheme', 'viagra pills discount'
];
spamDocs.forEach(doc => spamClassifier.addDocument(doc, 'Spam'));

// We MUST train the Spam classifier with legit docs so it doesn't flag everything as Spam
const legitDocs = [
  // A representative sample of legit complaints
  'fan not working in my room', 'no water in hostel', 'toilet flush not working',
  'professor not coming to class', 'marks not updated in portal', 'course registration error',
  'projector not working in classroom', 'campus wifi not working', 'canteen food quality bad',
  'sports ground not maintained', 'excess fee charged', 'outsiders entering campus without ID check',
  'water cooler on the 3rd floor leaking', 'someone might slip and fall', 'fan is broken since many days'
];
legitDocs.forEach(doc => spamClassifier.addDocument(doc, 'Legit'));

// ─────────────────────────────────────────────
// TRAIN ALL CLASSIFIERS
// ─────────────────────────────────────────────
categoryClassifier.train();
priorityClassifier.train();
sentimentClassifier.train();
spamClassifier.train();

// ─────────────────────────────────────────────
// CONFIDENCE THRESHOLD
// ─────────────────────────────────────────────
const CONFIDENCE_THRESHOLD = 0.45;

function getClassificationWithConfidence(bayes, text) {
  const classifications = bayes.getClassifications(text);
  if (!classifications || classifications.length === 0) {
    return { label: null, confidence: 0 };
  }
  const top = classifications[0];
  const total = classifications.reduce((sum, c) => sum + c.value, 0);
  const confidence = total > 0 ? top.value / total : 0;
  return { label: top.label, confidence };
}


// ─────────────────────────────────────────────
// GEMINI INIT
// ─────────────────────────────────────────────
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


// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

async function classifyComplaint(text, imagePath = null, mimeType = null) {
  const lowerText = text.toLowerCase();

  try {
    // 0. Image checks override everything
    if (imagePath && mimeType) {
       console.log('📸 Processing Multimodal Complaint with Image Evidence...');
       const imagePart = fileToGenerativePart(imagePath, mimeType);
       const prompt = `Read this student complaint. Look at the uploaded image evidence. Does the image visually match the grievance described? If the image is a selfie, a meme, or entirely unrelated, set "is_spam": true. If it is a valid grievance, set "is_spam": false.
       Translate to professional English if needed or leave "translated_text": null.
       Return exactly: {"is_spam": boolean, "category": "Hostel|Academic|Infrastructure|IT|Cafeteria|Sports|Finance|Security", "priority": "Low|Medium|High", "sentiment": "Angry|Neutral|Calm", "translated_text": "string|null"}`;

       const result = await model.generateContent([prompt, imagePart]);
       return parseGeminiResponse(result.response.text());
    }

    // 1. Spam checks locally
    const spamResult = getClassificationWithConfidence(spamClassifier, lowerText);
    if (spamResult.label === 'Spam' && spamResult.confidence > 0.6) {
      console.log(`🛡️ Fraud/Spam blocked locally. (Confidence: ${spamResult.confidence.toFixed(2)})`);
      return { is_spam: true };
    }

    // 2. Hybrid NLP Categorization
    const categoryResult = getClassificationWithConfidence(categoryClassifier, lowerText);
    const priorityResult = getClassificationWithConfidence(priorityClassifier, lowerText);
    const sentimentResult = getClassificationWithConfidence(sentimentClassifier, lowerText);

    const naturalFailed =
      categoryResult.confidence < CONFIDENCE_THRESHOLD ||
      priorityResult.confidence < CONFIDENCE_THRESHOLD ||
      sentimentResult.confidence < CONFIDENCE_THRESHOLD;

    // Fast-path: Return local results if confident
    if (!naturalFailed) {
      console.log(`🤖 Natural.js classification successful (Cat: ${categoryResult.confidence.toFixed(2)}, Pri: ${priorityResult.confidence.toFixed(2)}, Sent: ${sentimentResult.confidence.toFixed(2)})`);
      return {
        is_spam: false,
        category: categoryResult.label || 'Infrastructure',
        priority: priorityResult.label || 'Low',
        sentiment: sentimentResult.label || 'Neutral',
        translated_text: null
      };
    }

    console.log(`⚠️ Natural.js confidence too low (Cat: ${categoryResult.confidence.toFixed(2)}, Pri: ${priorityResult.confidence.toFixed(2)}, Sent: ${sentimentResult.confidence.toFixed(2)}). Falling back to Gemini API...`);

    // 3. Fallback path: Gemini
    const prompt = `Read this student complaint and return ONLY a raw JSON object. No markdown. No explanation.
Complaint: "${text}"
If it is SPAM/Gibberish, set "is_spam": true.
CRITICAL: If the text is regional language or broken Hindi/English, translate/refine to professional English in "translated_text", else null.
Return exactly: {"is_spam": boolean, "category": "Hostel" or "Academic" or "Infrastructure" or "IT" or "Cafeteria" or "Sports" or "Finance" or "Security", "priority": "Low" or "Medium" or "High", "sentiment": "Angry" or "Neutral" or "Calm", "translated_text": string or null}`;

    const result = await model.generateContent(prompt);
    return parseGeminiResponse(result.response.text());

  } catch (error) {
    console.error('Classification error:', error.message);
    return { is_spam: false, category: 'Infrastructure', priority: 'Medium', sentiment: 'Neutral', translated_text: null };
  }
}

function parseGeminiResponse(response) {
    let jsonStr = response.trim();
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

    if (parsed.is_spam === true) { return { is_spam: true }; }

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
