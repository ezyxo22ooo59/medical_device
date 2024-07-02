from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import logging
import os

app = Flask(__name__, template_folder='.')  # Specify the current directory for templates
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes from any origin
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://wilson:123456789@localhost:5432/medical_device_data'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

logging.basicConfig(level=logging.INFO)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

@app.route('/')
def home():
    return jsonify(message='Hello, world!')

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'name': user.name} for user in users])

@app.route('/user', methods=['POST'])
def add_user():
    if request.is_json:
        name = request.json['name']
        if name:
            new_user = User(name=name)
            try:
                db.session.add(new_user)
                db.session.commit()
                return jsonify(message='User added!'), 201
            except Exception as e:
                db.session.rollback()
                app.logger.error(f"Error adding user: {e}")
                return jsonify(message='Error adding user', error=str(e)), 500
        else:
            return jsonify(message='Name is required'), 400
    else:
        return jsonify(message='Request must be JSON'), 400

@app.route('/users_html')
def users_html():
    try:
        app.logger.info(f"Current working directory: {os.getcwd()}")
        app.logger.info(f"users.html exists: {os.path.exists('users.html')}")

        users = User.query.all()
        return render_template('users.html', users=users)
    except Exception as e:
        app.logger.error(f"Error fetching users: {e}")
        return jsonify(message='Error fetching users', error=str(e)), 500

if __name__ == '__main__':
    db.create_all()  # Ensure all tables are created
    app.run(debug=True, host='0.0.0.0', port=5001)