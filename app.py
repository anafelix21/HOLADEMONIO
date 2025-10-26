from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import MySQLdb.cursors

app = Flask(__name__)
app.secret_key = 'secret_key'

# Configuración MySQL AWS RDS
app.config['MYSQL_HOST'] = 'pochitodb.clsvalw1apjf.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'tobyyboby1'
app.config['MYSQL_DB'] = 'pochito_db'

mysql = MySQL(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# ==================== MODELOS ====================
class User(UserMixin):
    def __init__(self, id, username, password, is_admin):
        self.id = id
        self.username = username
        self.password = password
        self.is_admin = is_admin

@login_manager.user_loader
def load_user(user_id):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if user:
        return User(user['id'], user['username'], user['password'], user['is_admin'])
    return None

# ==================== RUTAS ====================
@app.route('/')
def index():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    return render_template('index.html', products=products)

@app.route('/search', methods=['GET'])
def search():
    q = request.args.get('q', '')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products WHERE name LIKE %s", ('%' + q + '%',))
    products = cursor.fetchall()
    return render_template('index.html', products=products, search=q)

# ------------------- LOGIN / REGISTRO -------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if user and bcrypt.check_password_hash(user['password'], password):
            user_obj = User(user['id'], user['username'], user['password'], user['is_admin'])
            login_user(user_obj)
            return redirect(url_for('admin' if user['is_admin'] else 'index'))
        flash("Credenciales inválidas")
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO users (username, password, is_admin) VALUES (%s,%s,%s)", (username, password, 0))
        mysql.connection.commit()
        flash("Usuario registrado con éxito")
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

# ------------------- ADMIN -------------------
@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        return redirect(url_for('index'))
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    return render_template('admin.html', products=products)

@app.route('/admin/add_product', methods=['GET', 'POST'])
@login_required
def add_product():
    if not current_user.is_admin:
        return redirect(url_for('index'))
    cursor = mysql.connection.cursor()
    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        category_id = request.form['category_id']
        cursor.execute("INSERT INTO products (name, price, category_id) VALUES (%s,%s,%s)", (name, price, category_id))
        mysql.connection.commit()
        return redirect(url_for('admin'))
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    return render_template('product_form.html', categories=categories)

# ------------------- CARRITO -------------------
@app.route('/cart')
def cart():
    cart = session.get('cart', [])
    total = sum(item['price'] for item in cart)
    return render_template('cart.html', cart=cart, total=total)

@app.route('/cart/add/<int:product_id>')
def add_to_cart(product_id):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
    product = cursor.fetchone()
    if product:
        cart = session.get('cart', [])
        cart.append({'id': product['id'], 'name': product['name'], 'price': product['price']})
        session['cart'] = cart
    return redirect(url_for('cart'))

@app.route('/cart/clear')
def clear_cart():
    session.pop('cart', None)
    return redirect(url_for('cart'))

@app.route('/test_db')
def test_db():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        return f"Conexión exitosa ✅<br>Tablas: {tables}"
    except Exception as e:
        return f"Error ❌: {str(e)}"

@app.route('/nosotros')
def nosotros():
    return render_template('nosotros.html')

@app.route('/adicionales')
def adicionales():
    return render_template('adicionales.html')

@app.route('/cuchillos')
def cuchillos():
    return render_template('cuchillos.html')

@app.route('/parrillas')
def parrillas():
    return render_template('parrillas.html')

@app.route('/limpieza')
def limpieza():
    return render_template('limpieza.html')

@app.route('/encendido')
def encendido():
    return render_template('encendido.html')


# ==================== RUTAS DE PRODUCTOS ====================
@app.route('/productos')
def productos():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products")
    productos = cursor.fetchall()
    return render_template('productos.html', productos=productos)

@app.route('/productos_res')
def productos_res():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products WHERE category_id = 1")
    productos = cursor.fetchall()
    return render_template('productos_res.html', productos=productos)

@app.route('/productos_pollo')
def productos_pollo():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products WHERE category_id = 2")
    productos = cursor.fetchall()
    return render_template('productos_pollo.html', productos=productos)

@app.route('/productos_cerdo')
def productos_cerdo():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM products WHERE category_id = 3")
    productos = cursor.fetchall()
    return render_template('productos_cerdo.html', productos=productos)

if __name__ == '__main__':
    app.run(debug=True)
