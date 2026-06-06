-- Insert Users
INSERT INTO User (name, email, password) VALUES
('Robbie  Yudis', 'Robbie@telkom.com', 'bijisatu123'),
('jack owi', 'mulyono@2periode.com', 'priaoslo456');

-- Insert Students
INSERT INTO Student (user_id) VALUES 
(1), 
(2);

-- Insert Consultants
INSERT INTO Consultant (name, expertise, rating) VALUES
('Dr. Wowo', 'Admissions', 4.8),
('Attalah', 'Financial Aid', 4.9);

-- Insert Universities
INSERT INTO University (name, location, rating, tuition) VALUES
('Telkom University', 'USA', 4.5, 35000.00),
('Binus College', 'UK', 4.2, 25000.00);

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
INSERT INTO ChatHistory (user_id, consultant_id, message, timestamp) VALUES
(1, 1, 'Hi, I need help with my application essay.', '2023-09-15 11:00:00'),
(1, 1, 'Sure, please share your draft when you are ready.', '2023-09-15 11:05:00');

-- Insert Applications
INSERT INTO Application (user_id, program_id, status, applied_at) VALUES
(1, 1, 'Submitted', '2023-10-01 10:00:00'),
(2, 2, 'Under Review', '2023-10-02 14:30:00');

-- Insert Payments
INSERT INTO Payment (user_id, application_id, amount, status, payment_date) VALUES
(1, 1, 50.00, 'Completed', '2023-10-01 10:05:00'),
(2, 2, 50.00, 'Pending', NULL);