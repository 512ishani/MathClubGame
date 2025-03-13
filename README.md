# MathClubGame
# MathClubInnovationGame

Tech stack used -
1) mysql for database
2) flask for backend
3) react for frontend
   
---------------------------------------------------------------------------------

SQL schema 

create database innovation 

use innovation 


-- Create Themes Table
CREATE TABLE Themes (
    theme_id INT PRIMARY KEY,
    theme_name VARCHAR(255) NOT NULL
);

-- Create Questions Table
CREATE TABLE Questions (
    question_id INT PRIMARY KEY,
    question_text TEXT NOT NULL,
    ans TEXT NOT NULL
);

-- Create QuestionSet Table
CREATE TABLE QuestionSet (
    theme_id INT NOT NULL,
    set_id INT NOT NULL,
    question_id INT NOT NULL,
    PRIMARY KEY (theme_id, set_id, question_id),
    FOREIGN KEY (theme_id) REFERENCES Themes(theme_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);

---------------------------------------------------------------------------------

Install the dependancies in vscode 

pip install mysql-connector-python

pip install flask

pip install flask-cors

------------------------------------------------------------------------------------

In case you are facing some problems with the python installation in pyhton - run the following command 

winget install Python.Python.3.11

winget install Python.Python.3.11

-------------------------------------------------------------------------------------

Run the following commands to create a new react app

npm install -g create-react-app@latest

npm install axios

npx create-react-app .

npm start 
