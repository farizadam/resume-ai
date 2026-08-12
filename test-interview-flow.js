const API_URL = "http://localhost:3000/api/interview";

// Simulated user responses that cover various resume sections
const mockAnswers = [
  "Hi, I want to build a resume for a Senior Frontend Engineer role.",
  "My name is Alex Johnson, email is alex@example.com, and I live in Seattle, WA.",
  "I have a Bachelor's in Computer Science from the University of Washington, graduated in 2019.",
  "I've been working at TechCorp as a Senior Frontend Developer since Jan 2020 to present. I led the migration of a legacy app to React, improving performance by 40%.",
  "Before that, I was a Web Developer at StartupInc from June 2018 to Dec 2019.",
  "My technical skills include JavaScript, TypeScript, React, Next.js, HTML, CSS, and Tailwind.",
  "I also have an AWS Certified Developer certification from 2021.",
  "No, that's everything."
];

async function runTest() {
  console.log("==========================================");
  console.log("🚀 STARTING INTERVIEW FLOW TEST");
  console.log("==========================================\n");

  let interviewId = null;
  let currentCandidateData = {};

  for (let i = 0; i < mockAnswers.length; i++) {
    const userMessage = mockAnswers[i];
    console.log(`👤 USER: ${userMessage}`);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Save interviewId for subsequent requests
      if (!interviewId) {
        interviewId = data.interviewId;
        console.log(`\n[System: Created Interview ID: ${interviewId}]`);
      }

      console.log(`🤖 AI (${data.currentSection}): ${data.message}\n`);
      
      currentCandidateData = data.candidateData;

      if (data.status === "completed") {
        console.log("✅ Interview marked as complete by AI!\n");
        break;
      }

      // Add a small delay so we don't hammer the AI API (and avoid rate limits)
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error) {
      console.error("❌ Request Failed:", error.message);
      break;
    }
  }

  console.log("==========================================");
  console.log("📄 FINAL EXTRACTED CANDIDATE DATA:");
  console.log("==========================================");
  console.dir(currentCandidateData, { depth: null, colors: true });
}

runTest().catch(console.error);
