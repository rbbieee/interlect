-- Create independent tables first
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE Consultant (
    consultant_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    expertise VARCHAR(100) NOT NULL,
    rating DOUBLE DEFAULT 0
);

CREATE TABLE University (
    university_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    rating DOUBLE DEFAULT 0,
    tuition DOUBLE NOT NULL
);

-- Create dependent tables
CREATE TABLE Student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE, -- UNIQUE enforces the 1:1 relationship
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Program (
    program_id INT PRIMARY KEY AUTO_INCREMENT,
    university_id INT,
    name VARCHAR(100) NOT NULL,
    tuition DOUBLE NOT NULL,
    FOREIGN KEY (university_id) REFERENCES University(university_id)
);

CREATE TABLE Preference (
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    category VARCHAR(100) NOT NULL,
    weight DOUBLE,
    value DOUBLE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    university_id INT,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (university_id) REFERENCES University(university_id)
);

CREATE TABLE ChatHistory (
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    consultant_id INT,
    message TEXT NOT NULL,
    timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (consultant_id) REFERENCES Consultant(consultant_id)
);

-- Application and Payment are created last because their dependencies
CREATE TABLE Application (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    program_id INT,
    status VARCHAR(50) NOT NULL,
    applied_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (program_id) REFERENCES Program(program_id)
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    application_id INT UNIQUE, -- UNIQUE enforces the 1:1 relationship
    amount DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (application_id) REFERENCES Application(application_id)
);