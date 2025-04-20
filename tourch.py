from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
def init_db():
    conn = sqlite3.connect('safeurl.db')
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        marketing_consent BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Helper function to hash passwords
def hash_password(password, salt=None):
    if salt is None:
        salt = os.urandom(32).hex()  # Generate a random salt
    
    # Hash the password with the salt
    password_hash = hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt.encode('utf-8'), 
        100000  # Number of iterations
    ).hex()
    
    return password_hash, salt

# Registration endpoint
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Extract user data
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')
        marketing_consent = data.get('marketingConsent', False)
        
        # Validate required fields
        if not all([first_name, last_name, email, password]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Hash the password
        password_hash, salt = hash_password(password)
        
        # Store in database
        conn = sqlite3.connect('safeurl.db')
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO users (first_name, last_name, email, password_hash, salt, marketing_consent) VALUES (?, ?, ?, ?, ?, ?)',
                (first_name, last_name, email, password_hash, salt, marketing_consent)
            )
            conn.commit()
        except sqlite3.IntegrityError:
            conn.close()
            return jsonify({'success': False, 'message': 'Email already registered'}), 409
        
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'Registration successful',
            'user': {
                'firstName': first_name,
                'lastName': last_name,
                'email': email
            }
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        email = data.get('email')
        password = data.get('password')
        
        # Validate required fields
        if not all([email, password]):
            return jsonify({'success': False, 'message': 'Missing email or password'}), 400
        
        # Retrieve user from database
        conn = sqlite3.connect('safeurl.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, first_name, last_name, password_hash, salt FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        # Verify password
        user_id, first_name, last_name, stored_hash, salt = user
        calculated_hash, _ = hash_password(password, salt)
        
        if calculated_hash != stored_hash:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user_id,
                'firstName': first_name,
                'lastName': last_name,
                'email': email
            }
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# Get all users (for testing purposes)
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect('safeurl.db')
    conn.row_factory = sqlite3.Row  # This enables column access by name
    cursor = conn.cursor()
    cursor.execute('SELECT id, first_name, last_name, email, created_at FROM users')
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({'users': users})

if __name__ == '__main__':
    app.run(debug=True, port=5000)