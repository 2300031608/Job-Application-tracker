CREATE DATABASE IF NOT EXISTS jobtracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jobtracker;

CREATE TABLE IF NOT EXISTS job_applications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_description TEXT,
  location VARCHAR(100),
  job_type VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'APPLIED',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  source VARCHAR(100),
  job_url VARCHAR(200),
  contact_person VARCHAR(100),
  contact_email VARCHAR(200),
  applied_date DATETIME,
  interview_date DATETIME,
  follow_up_date DATETIME,
  notes TEXT,
  salary_range VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

