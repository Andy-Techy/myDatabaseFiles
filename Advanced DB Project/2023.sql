CREATE DATABASE GoldMineOps;
GO

USE GoldMineOps;
GO

CREATE TABLE mining_sites
(
site_id INT IDENTITY(1,1) PRIMARY KEY,
location VARCHAR (255),
geological_data TEXT,
permits VARCHAR (255),
impact_assessment TEXT
);
GO

/*renaming a column name
EXEC sp_rename 'mining_sites.location','locality', 'COLUMN';
GO

SELECT *
FROM mining_sites;
GO*/

INSERT INTO mining_sites (locality, geological_data, permits, impact_assessment)
VALUES 
	('iduapriem', 'abundant gold-bearing ore bodies within sedimentary rock layers', 'B', 'underway'),
	('Dunkwa', 'rich in quartz veins containing gold deposits', 'A', 'submitted'),
    ('Tarkwa', 'abundant alluvial gold deposits in riverbeds', 'D', 'in progress'),
    ('Obuasi', 'Complex geological structure with basalt layers', 'C', 'approved'),
    ('Damang', 'surface mining of oxide and transition ores', 'E', 'completed')
	;
GO

/*SELECT *
FROM mining_sites;
GO*/

--equipment table
CREATE TABLE equipment
(
equiment_id INT IDENTITY (1,1) PRIMARY KEY,
site_id INT FOREIGN KEY REFERENCES mining_sites(site_id),
type VARCHAR (50),
capacity FLOAT,
maintenance_schedule TEXT,
operator_assignment VARCHAR(100)
);
GO

/*EXEC sp_rename 'equipment.equiment_id','equipment_id', 'COLUMN';
GO*/


/*NVARCHAR(MAX) has the same functionality as text*/

--inserting values into equipment table
INSERT INTO equipment (site_id, type, capacity, maintenance_schedule, operator_assignment)
VALUES
    (1, 'Excavator', 50.5, 'weekly maintenance required.', 'Mimi Brown'),
    (2, 'Dump Truck', 30.2, 'monthly maintenance recommended.', 'Hayford Belinda'),
    (3, 'Crusher', 75.0, 'daily maintenance essential.', 'Sey Lennox'),
    (1, 'Bulldozer', 42.7, 'bi-weekly maintenance scheduled.', 'Frank Agyekum'),
    (4, 'Loader', 38.9, 'maintenance every 100 hours.', 'Mrs Elkins')
	;
GO

SELECT *
FROM equipment;
GO

--employees table
CREATE TABLE employees 
(
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(50),
    certifications TEXT,
    training_records TEXT
);
GO

--inserting values into the employees table
INSERT INTO employees (name, position, certifications, training_records)
VALUES
    ('Mimi Brown', 'sales representative', 'salesforce certified sales cloud consultant', 'sales Techniques Workshop'),
    ('Sey Lennox', 'data analyst', 'Microsoft Certified Data Analyst Associate', 'SQL for Data Analysis Course'),
	 ('Mrs Elkins', 'software engineer', 'Microsoft Certified Azure Developer', 'Azure Fundamentals Training'),
    ('Belinda Hayford', 'marketing manager', 'Google Ads Certified', 'marketing strategy workshop'),
    ('Agyekum Frank', 'HR Specialist', 'PHR (Professional in Human Resources)', 'HR compliance training')
	;
	GO

/*SELECT *
FROM employees;
GO*/

-- mining activities table
CREATE TABLE mining_activities (
    activity_id INT IDENTITY(1,1) PRIMARY KEY,
    site_id INT FOREIGN KEY REFERENCES mining_sites(site_id),
    employee_id INT FOREIGN KEY REFERENCES employees(employee_id),
    equipment_id INT FOREIGN KEY REFERENCES equipment(equipment_id),
    activity_date DATE,
    ore_extraction_volume FLOAT,
    work_hours FLOAT,
    safety_inspection_result TEXT
	);
GO


INSERT INTO mining_activities (site_id, employee_id, equipment_id, activity_date, ore_extraction_volume, work_hours, safety_inspection_result)
VALUES
    (1, 2, 3, 'Jan 15, 2023', 1500.5, 8.5, 'passed'),
    (3, 5, 2, 'Feb 08, 2023', 2200.3, 7.75, 'failed'),
    (2, 1, 4, 'Mar 29, 2023', 1800.2, 9.0, 'passed'),
    (4, 3, 1, 'Apr 01, 2023', 1300.7, 6.25, 'successful'),
    (5, 4, 5, 'May 13, 2023', 2500.1, 10.5, 'passed')
	;
GO