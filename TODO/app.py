from flask import Flask, render_template, request, jsonify, make_response

app = Flask(__name__)



@app.route('/')
def index():
    return render_template('todos.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        entry = request.get_json()
        print(entry)

    return render_template('login.html')


@app.route('/habits', methods=['GET', 'POST'])
def habits():
    return render_template('habits.html')


@app.route('/trash')
def trash():
    return render_template('trash.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)