from flask import Flask ,jsonify, request
from flask_cors import CORS
import mysql.connector
import time 

app=Flask(__name__)
CORS(app)

db=mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="innovation"
)

#cursor to iterate thorugh the result 
cursor=db.cursor(dictionary=True)
#this will return the result as a dictionary instead of a tuple 

#get the set_id from the user and fetch the questions and answers 
#for this we will use the @app.route method 
@app.route('/questions/<int:set_id>',methods=['GET'])
def get_questions(set_id):
    query= query = """
    SELECT q.question_id, q.question_text, q.ans
    FROM Questions q
    JOIN QuestionSet qs ON q.question_id = qs.question_id
    WHERE qs.set_id = %s
    """
    cursor.execute(query,(set_id,))
    questions = cursor.fetchall()
    return jsonify(questions)

#for validating the answer entered by the user 
@app.route('/validate',methods=['post'])
def validate_answer():
    data=request.json 
    question_id=data['question_id']
    user_answer=data['answer']
    query = "SELECT ans FROM Questions WHERE question_id = %s"
    cursor.execute(query, (question_id,))
    correct_answer = cursor.fetchone()['ans']
    if user_answer==correct_answer:
        return jsonify({"correct":True})
    else :
        return jsonify({"correct":False,"correct_answer": correct_answer})

if __name__=="__main__":
    app.run(debug=True)