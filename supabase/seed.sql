-- Seed data for Verified Campus Knowledge Base
-- Migration: supabase/seed.sql

INSERT INTO public.campus_knowledge 
(university, department, title, category, description, eligibility, contact_info, verification_status, last_verified_date, source)
VALUES
(
    'State Innovation University',
    'Computer Science & Engineering',
    'Apex Annual 36-Hour Campus Hackathon',
    'Hackathons',
    'Flagship campus hackathon focused on AI, sustainability, and cloud infrastructure. Provides AWS credits, mentorship, and incubator fast-tracks.',
    'Open to all enrolled undergraduate and postgraduate students. Teams of 2 to 4.',
    'hackathon@campus.edu | Room 402, CS Tech Wing',
    'VERIFIED',
    '2026-10-15',
    'University Student Affairs Official Notice Board'
),
(
    'State Innovation University',
    'Interdisciplinary / Design',
    'Open Source & Creative Tech Guild',
    'Technical clubs',
    'Weekly hands-on collaborative lab building campus tools, open-source libraries, and creative tech installations.',
    'Any student interested in software, design, or hardware. Beginner-friendly track available.',
    'guild@campus.edu | Discord: #campus-tech-guild',
    'VERIFIED',
    '2026-10-20',
    'Council of Student Organizations Directory'
),
(
    'State Innovation University',
    'School of Business & Innovation',
    'Campus Venture Catalyst & Seed Incubator',
    'Entrepreneurship',
    'Student startup pre-seed accelerator granting $2,500 non-dilutive pilot funding, legal office hours, and VC pitch sessions.',
    'Undergraduate student founders with a prototype or validated customer discovery.',
    'venture@campus.edu | Innovation Hub, Floor 2',
    'VERIFIED',
    '2026-09-30',
    'Dean of Innovation Official Registry'
),
(
    'State Innovation University',
    'AI & Data Sciences Center',
    'Undergraduate AI Lab Research Fellowship',
    'Research opportunities',
    'Direct research apprenticeship under faculty exploring LLM reasoning, multimodal systems, and responsible AI safety.',
    'Minimum 3.2 GPA, proficiency in Python, and completion of introductory algorithms/linear algebra.',
    'ailab-fellowships@campus.edu | Science Center 310',
    'VERIFIED',
    '2026-10-01',
    'Academic Research Bulletin 2026-Q4'
),
(
    'State Innovation University',
    'Student Life & Public Engagement',
    'Community Tech Mentors & STEM Outreach',
    'Volunteering',
    'Volunteer initiative teaching digital literacy, foundational robotics, and coding to local public high school students.',
    'All departments; commitment of 3 hours per alternate Saturday.',
    'outreach@campus.edu | Student Union Suite 110',
    'VERIFIED',
    '2026-10-12',
    'Campus Civic Leadership Board'
),
(
    'National Campus Network',
    'Cross-University Alliance',
    'Inter-Collegiate Algorithmic Trading Sprint',
    'Competitions',
    'Simulated market trading and quantitative financial modeling challenge with cash prizes and Wall St. internship interviews.',
    'Teams of 1-3 students. Basic statistical knowledge recommended.',
    'info@quantspring-campus.org',
    'SUGGESTED',
    '2026-08-15',
    'External Student Opportunity Feed — Verification Required'
);

