from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/photography')
def photography():
    return render_template('photography.html')

@app.route('/visual-design')
def visual_design():
    return render_template('visual-design.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)