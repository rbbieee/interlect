-- Insert Users
INSERT INTO User (name, email, password) VALUES
('Robbie  Yudis', 'Robbie@telkom.com', 'bijisatu123'),
('jack owi', 'mulyono@2periode.com', 'priaoslo456'),
('Dr. Wowo', 'wowo@interlect.com', 'wowo123'),
('Attalah', 'attalah@interlect.com', 'attalah123');

-- Insert Students
INSERT INTO Student (user_id) VALUES 
(1), 
(2);

-- Insert Consultants
INSERT INTO Consultant (name, expertise, rating, email) VALUES
('Dr. Wowo', 'Admissions', 4.8, 'wowo@interlect.com'),
('Attalah', 'Financial Aid', 4.9, 'attalah@interlect.com');

-- Insert Universities
INSERT INTO University (name, location, rating, tuition, country, type, established, size, students, international_students, ranking, majors, research_opportunities, academic_system, graduation_rate, acceptance_rate, avg_gpa, recommendation_letters, personal_essay, application_fee, image_url, logo_url) VALUES
('Harvard University', 'Cambridge, USA', 4.9, 54000.00, 'USA', 'Private', '1636', '5,077 Acres', '23,000', '25%', '#4 (QS World)', 'Economics, Computer Science, Government, History, Biology', 'Extensive undergraduate research funding, Harvard College Research Program (HCRP).', 'Semester', '98%', '4%', '4.18', '2 teacher letters + 1 counselor letter', 'Required Common App essay + school supplement', '$85', '/img/university-placeholder.jpg', '/harvard.png'),
('Princeton University', 'Princeton, USA', 4.8, 52000.00, 'USA', 'Private', '1746', '600 Acres', '8,500', '12%', '#16 (QS World)', 'Computer Science, Public Policy, Economics, History, Molecular Biology', 'Senior thesis required for all undergraduates, Princeton Research Day.', 'Semester', '97%', '4.4%', '3.95', '2 teacher letters + 1 counselor letter', 'Required Common App + Princeton Supplement', '$70', '/img/university-placeholder.jpg', '/princeton.png'),
('Yale University', 'New Haven, USA', 4.8, 55000.00, 'USA', 'Private', '1701', '373 Acres', '14,500', '22%', '#10 (QS World)', 'History, Economics, Political Science, Computer Science, Molecular Biophysics', 'Dynamic undergraduate research fellowships, Yale College Dean\'s Research Fellowship.', 'Semester', '97%', '4.5%', '4.14', '2 teacher letters + 1 counselor letter', 'Required Common App + Yale Supplement', '$80', '/img/university-placeholder.jpg', '/yale.png'),
('Telkom University', 'Bandung, Indonesia', 4.6, 2500.00, 'Indonesia', 'Private', '2013', '120 Acres', '30,000', '2%', '#1 in Private Indonesian Universities', 'Informatics, Information Systems, Telecommunication Engineering, Visual Communication Design', 'Multiple centers of excellence (IoT, AI, 5G), undergraduate assistantships.', 'Semester', '90%', '35%', '3.2', 'Optional recommendation letters', 'Optional personal essay', 'IDR 400,000 (~$25)', '/img/university-placeholder.jpg', '/img/Logo.png'),
('Binus College', 'Jakarta, Indonesia', 4.5, 3000.00, 'Indonesia', 'Private', '1996', '45 Acres', '42,000', '3%', '#10 in Indonesia', 'Computer Science, Mobile Application & Technology, Business Information Systems, Accounting', 'Binus Joint Research and Innovation, industry-sponsored research.', 'Semester', '89%', '40%', '3.1', 'Optional recommendation letters', 'Optional personal essay', 'IDR 300,000 (~$20)', '/img/university-placeholder.jpg', '/img/Logo.png'),
('Kyoto University', 'Kyoto, Japan', 4.7, 5000.00, 'Japan', 'National', '1897', '138 Acres', '22,000', '11%', '#36 (QS World)', 'Physics, Chemistry, Engineering, Law, Economics', 'Leading academic research laboratories, Kyoto University Research Fellowship.', 'Semester', '95%', '10%', '3.8', '2 letters of recommendation required', 'Required for international students', 'JPY 17,000 (~$120)', '/img/university-placeholder.jpg', '/kyoto.png');

-- Insert Programs
INSERT INTO Program (university_id, name, tuition) VALUES
(1, 'B.S. Computer Science', 35000.00),
(2, 'B.A. Business Administration', 25000.00);

-- Insert Preferences
INSERT INTO Preference (user_id, category, weight, value) VALUES
(1, 'Location', 0.8, 1.0),
(2, 'Budget', 0.9, 20000.00);

-- Insert Reviews
INSERT INTO Review (user_id, university_id, rating, comment, created_at) VALUES
(1, 1, 5, 'Great campus and excellent CS professors!', '2023-11-01 09:00:00');

-- Insert ChatHistory
INSERT INTO ChatHistory (user_id, consultant_id, message, timestamp, sender) VALUES
(1, 1, 'Hi, I need help with my application essay.', '2023-09-15 11:00:00', 'user'),
(1, 1, 'Sure, please share your draft when you are ready.', '2023-09-15 11:05:00', 'consultant');

-- Insert Applications
INSERT INTO Application (user_id, program_id, status, applied_at) VALUES
(1, 1, 'Submitted', '2023-10-01 10:00:00'),
(2, 2, 'Under Review', '2023-10-02 14:30:00');

-- Insert Payments
INSERT INTO Payment (user_id, application_id, amount, status, payment_date) VALUES
(1, 1, 50.00, 'Completed', '2023-10-01 10:05:00'),
(2, 2, 50.00, 'Pending', NULL);