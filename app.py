from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chart-data')
def chart_data():
    data = {
        "labels": ["Blockage A", "Blockage B", "Blockage C"],
        "datasets": [{
            "label": "Sewage Blockage Percentage",
            "data": [45, 25, 30],  # Dummy data
            "backgroundColor": "rgba(0, 255, 0, 0.2)",
            "borderColor": "rgba(0, 255, 0, 0.8)",
            "borderWidth": 1
        }]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
