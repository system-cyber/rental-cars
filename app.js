// --- STATE ---
let state = {
    view: 'home',
    user: null, // null, {role: 'customer', name: 'John'}, {role: 'admin', name: 'Admin'}
    cars: JSON.parse(localStorage.getItem('pablo_cars')) || [
        { id: 'innova', name: 'Toyota Innova', price: '35,000', seats: '7-Seater', category: 'Premium SUV', img: 'assets/toyota-innova-2016-1.jpg' },
        { id: 'baleno', name: 'Maruti Suzuki Baleno', price: '27,000', seats: '5-Seater', category: 'Premium Hatchback', img: 'assets/baleno.png' }
    ]
};

if (!localStorage.getItem('pablo_cars')) {
    localStorage.setItem('pablo_cars', JSON.stringify(state.cars));
}

// --- ROUTER ---
function navigate(view) {
    state.view = view;
    render();
    window.scrollTo(0, 0);
}

// --- RENDER ---
function render() {
    renderNavbar();
    const app = document.getElementById('app');

    switch (state.view) {
        case 'home': app.innerHTML = viewHome(); break;
        case 'fleet': app.innerHTML = viewFleet(); break;
        case 'login': app.innerHTML = viewLogin(); break;
        case 'register': app.innerHTML = viewRegister(); break;
        case 'dashboard': app.innerHTML = viewDashboard(); break;
        case 'admin': app.innerHTML = viewAdmin(); break;
        default: app.innerHTML = viewHome();
    }
}

function renderNavbar() {
    const nav = document.getElementById('nav-links');
    let html = `
        <li><a onclick="navigate('home')">Home</a></li>
        <li><a onclick="navigate('fleet')">Our Fleet</a></li>
    `;

    if (!state.user) {
        html += `<li><a class="btn-primary" onclick="navigate('login')">Login / Register</a></li>`;
    } else if (state.user.role === 'admin') {
        html += `<li><a onclick="navigate('admin')" style="color:var(--primary-color)">Admin Panel</a></li>`;
        html += `<li><a class="btn-outline" onclick="logout()">Logout</a></li>`;
    } else {
        html += `<li><a onclick="navigate('dashboard')" style="color:var(--primary-color)">My Dashboard</a></li>`;
        html += `<li><a class="btn-outline" onclick="logout()">Logout</a></li>`;
    }
    nav.innerHTML = html;
}

// --- AUTH ACTIONS ---
function handleLogin() {
    const email = document.getElementById('email').value.toLowerCase();
    if (email.includes('admin')) {
        state.user = { role: 'admin', name: 'Pablo Admin' };
        showToast('Logged in as Admin');
        navigate('admin');
    } else {
        state.user = { role: 'customer', name: 'John Doe' };
        showToast('Welcome back, John!');
        navigate('dashboard');
    }
}
function logout() {
    state.user = null;
    showToast('Logged out successfully');
    navigate('home');
}

// --- VIEWS ---
function viewHome() {
    return `
    <section class="hero view-section active">
        <div style="max-width: 800px; z-index:1; position:relative;">
            <h1>Drive Your Dreams in Kerala</h1>
            <p>Premium self-drive and private car rentals. From pristine beaches to lush hills, drop & pickup anywhere.</p>
            <button class="btn-primary" style="font-size:1.2rem; padding: 15px 30px;" onclick="navigate('fleet')">Explore Fleet</button>
        </div>
    </section>
    `;
}

function viewFleet() {
    let carsHtml = state.cars.map(car => `
        <div class="car-card">
            <img src="${car.img}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'" class="car-image">
            <div class="car-info">
                <h3>${car.name}</h3>
                <div class="price">₹${car.price} <span style="font-size:1rem; color:var(--text-muted)">/mo</span></div>
                <ul style="margin: 15px 0; color: var(--text-muted); font-size:0.9rem;">
                    <li>✓ ${car.category}</li>
                    <li>✓ ${car.seats}</li>
                </ul>
                <button class="btn-primary" style="width:100%;" onclick="navigate('login')">Book Now</button>
            </div>
        </div>
    `).join('');

    return `
    <section class="container view-section active" style="padding: 40px 0;">
        <h2 style="text-align:center;">Our Premium Fleet</h2>
        <p style="text-align:center; margin-bottom:40px;">Choose from our well-maintained selection of vehicles.</p>
        <div class="grid-3">${carsHtml}</div>
    </section>
    `;
}

function viewLogin() {
    return `
    <section class="container view-section active" style="display:flex; justify-content:center; align-items:center; min-height:60vh;">
        <div class="glass-panel" style="padding: 40px; width: 100%; max-width: 450px;">
            <h2 style="text-align:center;">Welcome Back</h2>
            <p style="text-align:center; margin-bottom: 20px;">(Type 'admin' in email for Admin panel)</p>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="email" class="form-control" placeholder="Enter your email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" placeholder="Enter password">
            </div>
            <button class="btn-primary" style="width:100%; margin: 20px 0;" onclick="handleLogin()">Login</button>
            <p style="text-align:center;">New here? <a style="color:var(--primary-color)" onclick="navigate('register')">Create an account</a></p>
        </div>
    </section>
    `;
}

function viewRegister() {
    return `
    <section class="container view-section active" style="display:flex; justify-content:center; align-items:center; min-height:60vh;">
        <div class="glass-panel" style="padding: 40px; width: 100%; max-width: 450px;">
            <h2 style="text-align:center;">Create Account</h2>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" class="form-control" placeholder="John Doe">
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" class="form-control" placeholder="Enter your email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" placeholder="Create password">
            </div>
            <button class="btn-primary" style="width:100%; margin: 20px 0;" onclick="navigate('login')">Sign Up</button>
            <p style="text-align:center;">Already have an account? <a style="color:var(--primary-color)" onclick="navigate('login')">Login</a></p>
        </div>
    </section>
    `;
}

function viewDashboard() {
    if (!state.user || state.user.role !== 'customer') { navigate('login'); return ''; }
    return `
    <section class="container view-section active dashboard-layout">
        <div class="sidebar glass-panel" style="padding:20px;">
            <h3>My Account</h3>
            <button class="active">🚗 My Bookings</button>
            <button>💬 Support Tickets</button>
            <button>👤 Profile Settings</button>
        </div>
        <div class="glass-panel" style="padding:30px;">
            <h2>Active Bookings</h2>
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; display:flex; justify-content:space-between; align-items:center; margin-top:20px; border: 1px solid var(--surface-border);">
                <div>
                    <h3 style="margin-bottom:5px;">Maruti Suzuki Fronx</h3>
                    <p>May 1, 2026 - May 30, 2026</p>
                </div>
                <span class="badge" style="background: rgba(16,185,129,0.2); color:#34d399; padding: 10px 20px;">Active</span>
            </div>
        </div>
    </section>
    `;
}

function viewAdmin() {
    if (!state.user || state.user.role !== 'admin') { navigate('login'); return ''; }

    let carsRows = state.cars.map(c => `
        <tr>
            <td><img src="${c.img}" style="width:60px; border-radius:8px;"></td>
            <td>${c.name}</td>
            <td>₹${c.price}</td>
            <td><button class="btn-outline" style="padding: 5px 10px;" onclick="deleteCar('${c.id}')">Delete</button></td>
        </tr>
    `).join('');

    return `
    <section class="container view-section active dashboard-layout">
        <div class="sidebar glass-panel" style="padding:20px;" id="admin-sidebar">
            <h3>Admin Panel</h3>
            <button class="active" onclick="switchAdminTab('cars', this)">🚗 Manage Fleet</button>
            <button onclick="switchAdminTab('messages', this)">💬 Customer Messages</button>
            <button onclick="switchAdminTab('ai', this)">✨ AI Studio</button>
        </div>
        
        <div class="glass-panel" style="padding:30px; position:relative;">
            
            <div id="tab-cars" class="tab-content active">
                <h2>Manage Fleet</h2>
                <table class="table" style="margin-top:20px;">
                    <thead><tr><th>Image</th><th>Car</th><th>Price</th><th>Action</th></tr></thead>
                    <tbody>${carsRows}</tbody>
                </table>
            </div>

            <div id="tab-messages" class="tab-content">
                <h2>Customer Messages</h2>
                <div style="background:rgba(0,0,0,0.3); border-radius:12px; padding:20px; margin-top:20px;">
                    <p style="color:var(--primary-color); font-weight:bold;">John Doe</p>
                    <p style="margin: 10px 0;">"Hi, I want to extend my Fronx rental by 5 days."</p>
                    <div style="display:flex; gap:10px; margin-top:15px;">
                        <input type="text" class="form-control" placeholder="Reply...">
                        <button class="btn-primary">Send</button>
                    </div>
                </div>
            </div>

            <div id="tab-ai" class="tab-content">
                <h2>✨ AI Marketing Studio</h2>
                <div class="form-group" style="margin-top:20px;">
                    <label>Generate SEO Tags & Quotes</label>
                    <select class="form-control" id="ai-select">
                        <option value="Innova">Toyota Innova</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="runAI(this)">Generate Magic</button>
                <div style="margin-top:20px; display:flex; flex-direction:column; gap:15px;">
                    <textarea class="form-control" id="ai-out1" rows="3" placeholder="AI output will appear here..." readonly></textarea>
                </div>
            </div>

        </div>
    </section>
    `;
}

// --- HELPERS & LOGIC ---
function switchAdminTab(tab, btn) {
    document.querySelectorAll('#admin-sidebar button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
}

function runAI(btn) {
    btn.innerText = "Generating...";
    setTimeout(() => {
        document.getElementById('ai-out1').value = "Experience Kerala like never before! 🌴 Rent the amazing Toyota Innova for supreme comfort and reliability. Book now! #KeralaDrive";
        btn.innerText = "Generate Magic";
        showToast("AI Content Generated!");
    }, 1000);
}

function deleteCar(id) {
    state.cars = state.cars.filter(c => c.id !== id);
    localStorage.setItem('pablo_cars', JSON.stringify(state.cars));
    render();
    showToast("Car deleted");
}

function toggleChat() { document.getElementById('chatWindow').classList.toggle('active'); }

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input.value) return;
    const chatBody = document.getElementById('chatBody');
    chatBody.innerHTML += \`<div class="chat-msg sent">\${input.value}</div>\`;
    input.value = '';
    setTimeout(() => {
        chatBody.innerHTML += \`<div class="chat-msg received">Thanks! Our team will reply shortly.</div>\`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// INIT
render();
