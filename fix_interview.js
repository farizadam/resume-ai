const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017')
.then(async () => {
  const User = mongoose.connection.db.collection('users');
  const Interview = mongoose.connection.db.collection('interviews');
  const Resume = mongoose.connection.db.collection('resumes');
  
  // Find the 'adam' user
  const adamUser = await User.findOne({ name: 'adam' });
  if (!adamUser) {
    console.log('User adam not found');
    process.exit(1);
  }
  const userId = adamUser._id;
  console.log('Linking to user:', userId, adamUser.name);
  
  const idStr = '6a7cad3a862fa7ba84c0b0ca';
  const id = new mongoose.Types.ObjectId(idStr);
  
  const interview = await Interview.findOne({ _id: id });
  if (!interview) {
    console.log('Interview not found');
    process.exit(1);
  }
  
  await Interview.updateOne({ _id: id }, { "$set": { userId: userId } });
  
  const existingResume = await Resume.findOne({ interviewId: id });
  if (!existingResume) {
    await Resume.insertOne({
      userId: userId,
      interviewId: id,
      title: (interview.candidateData && interview.candidateData.contactInfo && interview.candidateData.contactInfo.name ? interview.candidateData.contactInfo.name + "'s Resume" : 'Untitled Resume'),
      targetRole: (interview.candidateData && interview.candidateData.workExperience && interview.candidateData.workExperience.length > 0 ? interview.candidateData.workExperience[0].position : 'Software Engineer'),
      candidateData: interview.candidateData || {},
      status: 'completed',
      template: 'modern',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Resume successfully created and linked!');
  } else {
    // Update existing resume to belong to Adam
    await Resume.updateOne({ _id: existingResume._id }, { "$set": { userId: userId } });
    console.log('Resume updated to belong to adam!');
  }
  
  process.exit(0);
});
