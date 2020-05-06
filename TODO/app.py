from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('todos.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/habits')
def habits():
    return render_template('habits.html')


@app.route('/trash')
def trash():
    return render_template('trash.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)