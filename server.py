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

@app.route('/collections/nightmarket')
def nightmarket():
    return render_template('nightmarket.html')

@app.route('/collections/taiwan')
def taiwan():
    return render_template('taiwan.html')

@app.route('/collections/dc')
def dc():
    return render_template('dc.html')

@app.route('/collections/france')
def france():
    return render_template('france.html')

@app.route('/collections/architecture')
def architecture():
    return render_template('architecture.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)