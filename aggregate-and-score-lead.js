//Score each lead (0-100 points) depending on location (15 points), job role (20 points) and seniority (10 points), product interest (30 points), urgency (10 points), pain points (10 points) and engagement quality (5 points)

//Extract answers from "Contact Us" form or defaults to an empty string
const productInterest = $("Webhook: Contact Form New Submission").first()?.json?.body["Which product area are you most interested in? "] || "";
const challengeText = $("Webhook: Contact Form New Submission").first()?.json?.body["Tell us about your primary challenge or goal:"].toLowerCase() || "";

//Extract data from LinkedIn scraping results or defaults to an empty string/array
const jobTitle = String($input.first()?.json?.current_company?.title).toLowerCase() || "";
const yearsExperienceText = String($input.first()?.json?.experience?.[0]?.duration).toLowerCase() || "";
const countryCode = String($input.first()?.json?.country_code).toLowerCase() || "";
const linkedinActivityData = $input.first()?.json?.activity;

//Extract activity data from LinkedIn and store in array
const latestLinkedinActivity = (Array.isArray(linkedinActivityData) ? linkedinActivityData : [])
  .map(activity => {
    return {
      interaction: activity?.interaction || "",
      postTitle: activity?.title || "",
      postLink: activity?.link || ""
    };
  });

//Initialize score counters
let leadScore = 0;
let locationScore = 0;
let jobRoleScore = 0;
let experienceScore = 0;
let productScore = 0;
let challengeScore = 0;
let urgencyFlag = false;
let painPointsFlag = false;
let detailedDescriptionFlag = false;

//To store the reasoning for each score criteria
const scoreReasons = [];

//Convert years of experience text to total months
let totalMonths = 0;
let years = 0;
let months = 0;

//Look for numbers before "year"
const yearIndex = yearsExperienceText.indexOf("year");
if (yearIndex > 0) {
  //Look backwards for the number before "year"
  const yearPart = yearsExperienceText.substring(0, yearIndex).trim();
  //Extract the last number before "year"
  let digits = "";
  for (let i = yearPart.length - 1; i >= 0; i--) {
    const char = yearPart[i];
    if (/\d/.test(char)) {
      digits = char + digits;
    } else if (digits) {
    //Stop when it hits a non-digit after finding digits
      break;
    }
  }
  if (digits) {
    years = parseInt(digits, 10);
  }
}

//Look for numbers before "month"
const monthIndex = yearsExperienceText.indexOf("month");
if (monthIndex > 0) {
  //Look backwards for the number before "month"
  const monthPart = yearsExperienceText.substring(0, monthIndex).trim();
  //Extract the last number before "month"
  let digits = "";
  for (let i = monthPart.length - 1; i >= 0; i--) {
    const char = monthPart[i];
    if (/\d/.test(char)) {
      digits = char + digits;
    } else if (digits) {
    //Stop when it hits a non-digit after finding digits
      break;
    }
  }
  if (digits) {
    months = parseInt(digits, 10);
  }
}

totalMonths = (years * 12) + months;

//Location Scoring (15 points max)
if (countryCode === "us") {
  leadScore += 15;
  scoreReasons.push("United States location");
} 
//Other English-speaking countries
else if (["ca", "gb", "au", "nz"].includes(countryCode)) {
  leadScore += 10;
  scoreReasons.push(`${countryCode.toUpperCase()} location (English-speaking)`);
}
//Any other specified country
else if (countryCode) {
  leadScore += 5;
  scoreReasons.push("International location");
}

locationScore = leadScore;

//Job Role & Seniority (30 points max)
//Job Role (20 points)
const executiveTerms = ["ceo", "chief", "president", "founder"];
const financeExecTerms = ["cfo", "vp finance", "finance director"];
const directorTerms = ["vp", "director", "head of"];
const managerTerms = ["manager", "controller", "accountant"];

if (executiveTerms.some(term => jobTitle.includes(term))) {
  leadScore += 20;
  scoreReasons.push("C-Level/Founder");
} else if (financeExecTerms.some(term => jobTitle.includes(term))) {
  leadScore += 20;
  scoreReasons.push("Finance Executive");
} else if (directorTerms.some(term => jobTitle.includes(term))) {
  leadScore += 15;
  scoreReasons.push("VP/Director level");
} else if (managerTerms.some(term => jobTitle.includes(term))) {
  leadScore += 10;
  scoreReasons.push("Finance Manager");
} else if (jobTitle && jobTitle !== "") {
  leadScore += 5;
  scoreReasons.push("Has job title specified");
}

jobRoleScore = leadScore - locationScore;

//Seniority (10 points)
if (totalMonths >= 120) {//10+ years
  leadScore += 10;
  scoreReasons.push("10+ years experience");
} else if (totalMonths >= 60) {//5-10 years
  leadScore += 7;
  scoreReasons.push("5-10 years experience");
} else if (totalMonths >= 24) {//2-5 years
  leadScore += 5;
  scoreReasons.push("2-5 years experience");
}

experienceScore = leadScore - locationScore - jobRoleScore;

//Product Interest Scoring (30 points max)
const productScores = {
  "Bank Data Consolidation & Feeds": 25,
  "Cash Flow Monitoring & Analytics": 20,
  "Revenue Forecasting & Modeling": 20,
  "Automated Financial Workflows": 15,
  "ERP/Accounting Software Integrations (e.g., NetSuite, QuickBooks)": 15,
  "I\m not sure yet, please advise": 5
};

if (productInterest in productScores) {
  leadScore += productScores[productInterest];
  scoreReasons.push(`Interest: ${productInterest}`);
}

productScore = leadScore - locationScore - jobRoleScore - experienceScore;

//Challenge Text Analysis (25 points max)
if (challengeText) {
  //Urgency signals (10 points)
  const urgencyTerms = ["urgent", "asap", "immediately", "critical", "pressing"];
  if (urgencyTerms.some(term => challengeText.includes(term))) {
    leadScore += 10;
    scoreReasons.push("Urgent need expressed");
    urgencyFlag = true;
  }

  //Specific pain points (10 points)
  const pain_points = ["consolidate", "multiple bank", "cash flow", "forecast", "manual process", "automate", "integrat", "real-time", "reporting", "efficiency"];
  if (pain_points.some(pain => challengeText.includes(pain))) {
    leadScore += 10;
    scoreReasons.push("Specific pain points mentioned");
    painPointsFlag = true;
  }

  //Length bonus (5 points)
  if (challengeText.length > 50) {
    leadScore += 5;
    scoreReasons.push("Detailed challenge description");
    detailedDescriptionFlag = true;
  }
}

//Determine Contact Tier
let contactTier;
if (leadScore >= 70) {
  contactTier = "DECISION_MAKER";
  scoreReasons.push("Senior role with specific financial automation needs");
} else if (leadScore >= 50) {
  contactTier = "HIGH_VALUE";
  scoreReasons.push("Strong interest in core financial services with clear pain points");
} else if (leadScore >= 30) {
  contactTier = "WARM_LEAD";
  scoreReasons.push("Moderate interest with some specific needs");
} else if (leadScore >= 15) {
  contactTier = "COLD_LEAD";
  scoreReasons.push("General interest but limited specifics");
} else {
  contactTier = "UNQUALIFIED";
  scoreReasons.push("Insufficient information or interest");
}

return {
  //Extract data from form submission
  "firstName": $("Webhook: Contact Form New Submission").first()?.json?.body["First Name"] || "",
  "lastName": $("Webhook: Contact Form New Submission").first()?.json?.body["Last Name"] || "",
  "phoneNumber": $("Webhook: Contact Form New Submission").first()?.json?.body["Phone Number"] || "",
  "linkedinURL": $("Webhook: Contact Form New Submission").first()?.json?.body["Your LinkedIn URL"] || "",
  "workEmail": $("Webhook: Contact Form New Submission").first()?.json?.body["Work Email"] || "",
  "companyWebsite": $("Webhook: Contact Form New Submission").first()?.json?.body["Your Company Website"] || "",
  "productInterest": $("Webhook: Contact Form New Submission").first()?.json?.body["Which product area are you most interested in? "] || "",
  "challengeText": $("Webhook: Contact Form New Submission").first()?.json?.body["Tell us about your primary challenge or goal:"] || "",
  //Extract data from LinkedIn scraping results
  "currentCompany": $input.first()?.json?.current_company?.name || "",
  "jobTitle": String($input.first()?.json?.current_company?.title),
  "totalYearsAtCompany": (totalMonths / 12).toFixed(2),
  "countryCode": countryCode,
  "city": $input.first()?.json?.city || "",
  "about": $input.first()?.json?.about || "",
  "latestCertification": ($input.first()?.json?.certifications?.subtitle) ? $input.first()?.json?.certifications[0]?.subtitle : "",
  "educationDetails": $input.first()?.json?.educations_details || "",
  "latestLinkedinActivity": JSON.stringify(latestLinkedinActivity),
  //Display lead-scoring data
  "totalLeadScore": leadScore,
  "contactTier": contactTier,
  "locationScore": locationScore,
  "jobRoleScore": jobRoleScore,
  "experienceScore": experienceScore,
  "productScore": productScore,
  "challengeScore": challengeScore,
  "urgencyFlag": urgencyFlag,
  "painPointsFlag": painPointsFlag,
  "detailedDescriptionFlag": detailedDescriptionFlag,
  "scoreReasons": String(scoreReasons),
  "leadEnrichedTimestamp": $input.first()?.json?.timestamp || ""
}
