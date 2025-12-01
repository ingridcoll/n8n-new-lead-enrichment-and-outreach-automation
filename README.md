# Inbound Lead Enrichment and AI Personalized Outreach Automation with n8n
### How to Turn a “Contact Us” Form Submission Into a Fully Automated Lead Enrichment System
Technologies used: 
- *HubSpot* as the CRM
- *Crunchbase* and *Bright Data* for scraping
- *JavaScript* for cleaning and transforming data
- *Google Gemini* for personalized email generation
- *Slack* and *Gmail* for communications
- *Google Calendar* to check for availability
- *Asana* for task management

This system turns inbound leads from simple form submissions into fully qualified, enriched, and ready-to-outreach contacts, all without manual intervention. By combining company and lead enrichment, automated scoring, and AI-generated outreach, sales and marketing teams eliminate tedious research, reduce response times, and increase conversion by booking calls with warm leads immediately.

This automation was created by *Ingrid Coll*. See my other projects on GitHub at [github.com/ingridcoll](https://github.com/ingridcoll) or send me a LinkedIn message at [linkedin.com/in/ingridcoll](https://www.linkedin.com/in/ingridcoll/) with any questions or business inquiries!

## In PHASE 1: Company Enrichment...
### A simple company website field is turned into a fully validated, enriched company profile, automatically synced with the CRM.
<img width="1426" height="484" alt="image" src="https://github.com/user-attachments/assets/3b306164-9db0-4b67-ad51-e9bd023d24b1" />

- Automatically extracts and standardizes the company website.
- Stops enrichment if the company already exists in the CRM.
- Launches Crunchbase scraping via Bright Data API.
- Provides verified, structured company information: **name, industry, size, funding, products, and technologies used**.
- Eliminates manual research and ensures no wasted enrichment cycles.
- Enables sales and marketing teams to quickly understand the lead’s company, prioritize opportunities, and make fast decisions.
## In PHASE 2: Lead Enrichment...
### The inbound lead becomes a fully enriched, outreach-ready contact.
<img width="1423" height="436" alt="image" src="https://github.com/user-attachments/assets/9a9e6330-a429-4268-ae95-0109eda700e7" />

- Pulls LinkedIn data including job title, current company, location, experience, education, certifications, and recent activity.
- Cleans and structures arrays and text fields, with fallbacks for missing or malformed data.
- Applies a weighted lead scoring model based on location, role, seniority, product interest, goals, and engagement signals.
- Delivers a complete, accurate lead profile and adds it to the CRM.
- Highlights decision-makers and high-value prospects automatically.
- Notifies the sales team by creating an Asana task and sending a message via Slack.

## In PHASE 3: Personalized Outreach Automation...
### Turns enriched lead and company data into a ready-to-send, highly personalized email for the assigned contact owner.
<img width="1504" height="386" alt="image" src="https://github.com/user-attachments/assets/243ca9df-c29c-46ea-b399-ad853518add7" />

- Automatically fetches the lead and company profile from HubSpot once a contact owner is assigned.
- Uses Google Gemini AI to craft a tailored email based on the lead’s profile, interests, challenges, and company context. It even takes into account the latest LinkedIn activity to reference recently-liked posts!
- Verifies the contact owner’s availability to suggest meeting times.
- Creates a Gmail draft pre-populated with the personalized email and meeting options, ready for quick review and send.
- Provides a fully personalized, high-conversion email without manual drafting.
- Saves the sales team time while increasing engagement quality.
- Ensures outreach is timely, relevant, and aligned with the contact owner’s schedule, boosting the likelihood of booking meetings and advancing leads.

#### Sample Email Output:
*(Names have been modified for anonymity purposes)*

Hey Sarah,

Just wanted to send a quick note ahead of our chat. I noticed you recently shared a post about Hotel Calabria (LinkedIn post link) – that's awesome! It sounds like a fantastic new venture and a great way to combine your hospitality background with your marketing expertise. It's clear you're all about creating systems that boost brand awareness and revenue, which really resonated with us. And congrats on Hotel & Lounge's new partnership with Marriott! That's a great win (LinkedIn post link).

I'm excited to learn more about how Central Money can help Hotel & Lounge with revenue forecasting and modeling so you can keep making more money for the company and properly budget for the future. Looking forward to connecting soon!

Here are my next available meeting times:

- Nov 26, 2025, 5:00 PM - 6:00 PM
- Nov 27, 2025, 9:30 AM - 10:30 AM
- Nov 28, 2025, 9:30 AM - 10:30 AM

If these times do not work, schedule a time with me here: calendly.com/ingrid

Ingrid from Central Money
ingrid@centralmoney.com

## Downloading and Importing this Automation into your n8n Workspace (for free!)
1. Find the .json file in this repository and either select all the text and copy it, or download the file to your local computer by selecting "Download raw file".
2. Log into your n8n instance and create a new blank workflow.
3. If you copied the .json contents, simply paste the workflow into the blank canvas. If you downloaded the .json file, on the top-right of the screen, select the three dots and click on "Import from file...". Upload the .json file from your local computer.
