from flask import Flask, jsonify, request
import pandas as pd
import os

app = Flask(__name__)

# Load the CSV file
CSV_FILE = "urldata.csv"

def load_csv():
    if os.path.exists(CSV_FILE):
        return pd.read_csv(CSV_FILE)
    else:
        return None

@app.route('/')
def home():
    return "Fake Website Detection API is running."

# API to check if a website is fake
@app.route('/check', methods=['POST'])
def check_website():
    try:
        data = request.json
        if not data or "url" not in data:
            return jsonify({"error": "No URL provided"}), 400

        url = data["url"]
        df = load_csv()

        if df is None:
            return jsonify({"error": "CSV file not found"}), 500

        # Search for the URL in the dataset
        row = df[df["url"] == url]

        if not row.empty:
            is_fake = int(row["is_fake"].values[0])
            result = "FAKE" if is_fake == 1 else "SAFE"
            return jsonify({"url": url, "status": result})
        else:
            return jsonify({"url": url, "status": "UNKNOWN"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
