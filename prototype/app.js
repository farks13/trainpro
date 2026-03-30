// === Icons ===
const icons = {
  back: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevron: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  person: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="#0B3B2D" stroke-width="1.5"/><path d="M3 18C3 14.134 6.134 11 10 11C13.866 11 17 14.134 17 18" stroke="#0B3B2D" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  delivery: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#0B3B2D" stroke-width="1.5"/><path d="M3 8L10 12L17 8" stroke="#0B3B2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  payment: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" rx="2" stroke="#0B3B2D" stroke-width="1.5"/><path d="M3 8H17" stroke="#0B3B2D" stroke-width="1.5"/><path d="M7 12H9" stroke="#0B3B2D" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  dietary: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#0B3B2D" stroke-width="1.5"/><path d="M7 10L9 12L13 8" stroke="#0B3B2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  notifications: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3V5M10 15V17M3 10H5M15 10H17M5.05 5.05L6.46 6.46M13.54 13.54L14.95 14.95M14.95 5.05L13.54 6.46M6.46 13.54L5.05 14.95" stroke="#0B3B2D" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  orders: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke="#0B3B2D" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  pin: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5.24 1.5 3 3.74 3 6.5C3 10.25 8 14.5 8 14.5S13 10.25 13 6.5C13 3.74 10.76 1.5 8 1.5Z" stroke="#2E7D32" stroke-width="1.5"/><circle cx="8" cy="6.5" r="1.5" fill="#2E7D32"/></svg>`,
};

// === Navigation state ===
let history = ['account'];

function navigate(screenId) {
  history.push(screenId);
  render(screenId);
}

function goBack() {
  if (history.length > 1) {
    history.pop();
    const prev = history[history.length - 1];
    render(prev, true);
  }
}

function render(screenId, isBack = false) {
  const app = document.getElementById('app');
  app.scrollTop = 0;
  const screen = screens[screenId]();
  app.innerHTML = screen;
  const el = app.querySelector('.screen');
  if (el) {
    el.classList.add('active');
    if (isBack) el.classList.add('back');
  }
  bindEvents();
}

function bindEvents() {
  // Back buttons
  document.querySelectorAll('[data-back]').forEach(el => {
    el.addEventListener('click', goBack);
  });
  // Navigation links
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.nav));
  });
  // Toggles
  document.querySelectorAll('.toggle input').forEach(el => {
    el.addEventListener('change', () => {
      // just visual toggle, already handled by CSS
    });
  });
  // Chips
  document.querySelectorAll('.chip').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('active');
    });
  });
  // Radios
  document.querySelectorAll('[data-radio-group]').forEach(el => {
    el.addEventListener('click', () => {
      const group = el.dataset.radioGroup;
      document.querySelectorAll(`[data-radio-group="${group}"] .radio`).forEach(r => r.classList.remove('active'));
      el.querySelector('.radio').classList.add('active');
    });
  });
}

// === Toggle HTML helper ===
function toggle(checked = false, id = '') {
  return `<label class="toggle"><input type="checkbox" ${checked ? 'checked' : ''} id="${id}"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>`;
}

// === Screen: Account ===
screens = {};

screens.account = () => `
<div class="screen">
  <div class="header">
    <div class="header-logo"><span>MY<br>FOOD BAG</span></div>
    <div class="header-title">Account</div>
  </div>

  <div class="content">
    <div style="display:flex;align-items:center;gap:16px">
      <div class="avatar"><span>NC</span></div>
      <div>
        <div style="font-size:20px;font-weight:800;line-height:24px;color:var(--text-primary)">Nic Constantino</div>
        <div style="font-size:14px;color:var(--text-secondary);margin-top:2px">nic@gmail.com</div>
      </div>
    </div>
  </div>

  <div class="content-compact">
    <div class="heading-md">Your Subscription</div>
    <div class="card">
      <div class="card-row-lg" style="padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div class="heading-sm">My Food Bag</div>
            <div class="text-sm">3 Nights for 4 people</div>
          </div>
          <span class="badge badge-green">Active</span>
        </div>
      </div>
      <div class="card-row">
        <span class="text-sm">Weekly delivery</span>
        <span class="text-sm text-bold text-dark">$229.99/week</span>
      </div>
      <div class="card-row">
        <span class="text-sm">Next delivery</span>
        <span class="text-sm text-bold text-dark">Saturday 21st May</span>
      </div>
      <div class="card-row">
        <button class="btn btn-outline" data-nav="subscription">Manage subscription</button>
      </div>
    </div>
  </div>

  <div class="content-compact section-gap">
    <div class="heading-md">Settings</div>
    <div class="card">
      <div class="settings-item" data-nav="delivery">
        <div class="settings-item-left">${icons.person}<span>Personal details</span></div>
        ${icons.chevron}
      </div>
      <div class="settings-item" data-nav="delivery">
        <div class="settings-item-left">${icons.delivery}<span>Delivery address</span></div>
        ${icons.chevron}
      </div>
      <div class="settings-item" data-nav="payment">
        <div class="settings-item-left">${icons.payment}<span>Payment methods</span></div>
        ${icons.chevron}
      </div>
      <div class="settings-item" data-nav="dietary">
        <div class="settings-item-left">${icons.dietary}<span>Dietary preferences</span></div>
        ${icons.chevron}
      </div>
      <div class="settings-item" data-nav="notifications">
        <div class="settings-item-left">${icons.notifications}<span>Notifications</span></div>
        ${icons.chevron}
      </div>
      <div class="settings-item" data-nav="orders">
        <div class="settings-item-left">${icons.orders}<span>Order history</span></div>
        ${icons.chevron}
      </div>
    </div>
  </div>

  <div style="padding:24px 20px 32px;display:flex;flex-direction:column;gap:16px">
    <button class="btn btn-danger">Sign out</button>
    <div class="version">Version 3.2.1</div>
  </div>
</div>`;

// === Screen: Subscription ===
screens.subscription = () => `
<div class="screen">
  <div class="header">
    <button class="header-back" data-back>${icons.back}</button>
    <div class="header-title">Subscription</div>
  </div>

  <div class="content">
    <div class="heading-lg">Current Plan</div>
    <div class="card">
      <div class="card-header-dark">
        <div>
          <div class="title">My Food Bag</div>
          <div class="subtitle">3 Nights for 4 people</div>
        </div>
        <span class="badge badge-green">Active</span>
      </div>
      <div class="card-row">
        <span class="text-body">Meal preference</span>
        <span class="text-body text-semibold text-dark">Quick & Easy</span>
      </div>
      <div class="card-row">
        <span class="text-body">Delivery frequency</span>
        <span class="text-body text-semibold text-dark">Weekly</span>
      </div>
      <div class="card-row">
        <span class="text-body">Price per week</span>
        <span class="text-body text-bold text-dark">$229.99</span>
      </div>
      <div class="card-row">
        <span class="text-body">Next delivery</span>
        <span class="text-body text-semibold text-green">Saturday 21st May</span>
      </div>
    </div>
  </div>

  <div class="content-compact" style="gap:12px">
    <button class="btn btn-primary">Change plan</button>
    <button class="btn btn-secondary">Skip next delivery</button>
  </div>

  <div class="content-compact section-gap" style="padding-bottom:32px">
    <div class="heading-md">Recent billing</div>
    <div class="card">
      <div class="card-row">
        <div><div class="text-body text-semibold text-dark">Saturday 14th May</div><div class="text-xs">3 Nights for 4</div></div>
        <span class="text-body text-bold text-dark">$229.99</span>
      </div>
      <div class="card-row">
        <div><div class="text-body text-semibold text-dark">Saturday 7th May</div><div class="text-xs">3 Nights for 4</div></div>
        <span class="text-body text-bold text-dark">$229.99</span>
      </div>
      <div class="card-row">
        <div><div class="text-body text-semibold text-dark">Saturday 30th April</div><div class="text-xs">3 Nights for 4</div></div>
        <span class="text-body text-bold text-dark">$229.99</span>
      </div>
    </div>
    <div class="link">View all billing history</div>
    <div style="height:16px"></div>
    <button class="btn btn-danger">Cancel subscription</button>
  </div>
</div>`;

// === Screen: Delivery Address ===
screens.delivery = () => `
<div class="screen">
  <div class="header">
    <button class="header-back" data-back>${icons.back}</button>
    <div class="header-title">Delivery Address</div>
  </div>

  <div class="content">
    <div class="heading-lg">Current address</div>
    <div class="card">
      <div class="address-row">
        <div class="address-icon">${icons.pin}</div>
        <div class="address-text">
          <div style="font-size:14px;font-weight:600;color:var(--text-primary)">Unit 1, 138 Mount Wellington Highway</div>
          <div class="text-body">Auckland, New Zealand 0600</div>
        </div>
      </div>
      <div style="padding:0 16px">
        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">Delivery instructions</div>
        <div class="text-body" style="margin-top:2px">Please leave at front door</div>
      </div>
      <div style="padding:12px 16px 16px">
        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">Delivery window</div>
        <div class="text-body" style="margin-top:2px">Saturday 5pm - 8pm</div>
      </div>
    </div>
    <button class="btn btn-primary">Edit address</button>
  </div>

  <div class="content-compact section-gap" style="padding-bottom:32px">
    <div class="heading-md">Delivery schedule</div>
    <div class="card">
      <div class="card-row">
        <span class="text-body">Delivery day</span>
        <span class="text-body text-bold text-dark">Saturday</span>
      </div>
      <div class="card-row">
        <span class="text-body">Time window</span>
        <span class="text-body text-bold text-dark">5pm - 8pm</span>
      </div>
      <div class="card-row">
        <span class="text-body">Frequency</span>
        <span class="text-body text-bold text-dark">Weekly</span>
      </div>
    </div>
    <button class="btn btn-secondary">Change delivery schedule</button>
  </div>
</div>`;

// === Screen: Payment Methods ===
screens.payment = () => `
<div class="screen">
  <div class="header">
    <button class="header-back" data-back>${icons.back}</button>
    <div class="header-title">Payment Methods</div>
  </div>

  <div class="content">
    <div class="heading-lg">Saved cards</div>
    <div class="card">
      <div class="payment-row" data-radio-group="card" style="border:2px solid var(--primary);border-radius:var(--radius-card);margin:-1px">
        <div class="radio active"></div>
        <div class="payment-info">
          <div class="payment-name">Visa ending in 6411</div>
          <div class="payment-expires">Expires 08/27</div>
        </div>
        <span class="badge" style="background:var(--primary);color:#fff;font-size:12px">Default</span>
      </div>
      <div class="payment-row" data-radio-group="card">
        <div class="radio"></div>
        <div class="payment-info">
          <div class="payment-name">Mastercard ending in 8832</div>
          <div class="payment-expires">Expires 03/26</div>
        </div>
      </div>
    </div>
    <button class="btn btn-primary">+ Add new card</button>
  </div>

  <div class="content-compact section-gap" style="padding-bottom:32px">
    <div class="heading-md">Other methods</div>
    <div class="card">
      <div class="payment-row" data-radio-group="other">
        <div class="radio"></div>
        <div class="payment-info"><div class="payment-name">Apple Pay</div></div>
      </div>
      <div class="payment-row" data-radio-group="other">
        <div class="radio"></div>
        <div class="payment-info"><div class="payment-name">Google Pay</div></div>
      </div>
    </div>
  </div>
</div>`;

// === Screen: Dietary Preferences ===
screens.dietary = () => `
<div class="screen">
  <div class="header">
    <button class="header-back" data-back>${icons.back}</button>
    <div class="header-title">Dietary Preferences</div>
  </div>

  <div class="content">
    <div>
      <div class="heading-lg">Recipe preferences</div>
      <div class="text-body" style="margin-top:4px">Choose your preferences to personalise recipe recommendations</div>
    </div>

    <div>
      <div class="heading-md" style="margin-bottom:12px">Meal style</div>
      <div class="chip-group">
        <button class="chip active">Quick & Easy</button>
        <button class="chip">Family Favourites</button>
        <button class="chip">New & Adventurous</button>
        <button class="chip active">Healthy Choices</button>
      </div>
    </div>

    <div>
      <div class="heading-md" style="margin-bottom:12px">Dietary requirements</div>
      <div class="card">
        <div class="notif-row">
          <span class="text-body text-dark">Gluten free</span>
          ${toggle(false, 'gluten')}
        </div>
        <div class="notif-row">
          <span class="text-body text-dark">Dairy free</span>
          ${toggle(true, 'dairy')}
        </div>
        <div class="notif-row">
          <span class="text-body text-dark">Low carb</span>
          ${toggle(true, 'lowcarb')}
        </div>
        <div class="notif-row">
          <span class="text-body text-dark">Vegetarian</span>
          ${toggle(false, 'veg')}
        </div>
      </div>
    </div>
  </div>

  <div style="padding:16px 20px 32px">
    <button class="btn btn-primary">Save preferences</button>
  </div>
</div>`;

// === Screen: Notifications ===
screens.notifications = () => `
<div class="screen">
  <div class="header">
    <button class="header-back" data-back>${icons.back}</button>
    <div class="header-title">Notifications</div>
  </div>

  <div class="content">
    <div>
      <div class="heading-lg">Notification settings</div>
      <div class="text-body" style="margin-top:4px">Choose how you'd like to hear from us</div>
    </div>

    <div>
      <div class="heading-md" style="margin-bottom:12px">Email notifications</div>
      <div class="card">
        <div class="notif-row">
          <div class="notif-info">
            <div class="notif-title">Order confirmations</div>
            <div class="notif-desc">Receive email when your order is confirmed</div>
          </div>
          ${toggle(true, 'order-confirm')}
        </div>
        <div class="notif-row">
          <div class="notif-info">
            <div class="notif-title">Delivery updates</div>
            <div class="notif-desc">Get notified about delivery status changes</div>
          </div>
          ${toggle(true, 'delivery-updates')}
        </div>
        <div class="notif-row">
          <div class="notif-info">
            <div class="notif-title">Weekly menu</div>
            <div class="notif-desc">Preview new recipes each week</div>
          </div>
          ${toggle(false, 'weekly-menu')}
        </div>
      </div>
    </div>

    <div>
      <div class="heading-md" style="margin-bottom:12px">SMS & Push</div>
      <div class="card">
        <div class="notif-row">
          <div class="notif-info">
            <div class="notif-title">SMS offers & promotions</div>
            <div class="notif-desc">Receive special deals via text</div>
          </div>
          ${toggle(false, 'sms-offers')}
        </div>
        <div class="notif-row">
          <div class="notif-info">
            <div class="notif-title">Delivery reminders</div>
            <div class="notif-desc">Get reminded before your delivery arrives</div>
          </div>
          ${toggle(true, 'delivery-remind')}
        </div>
      </div>
    </div>
  </div>
</div>`;

// === Screen: Order History ===
screens.orders = () => `
<div class="screen">
  <div class="header">
    <button class="header-back" data-back>${icons.back}</button>
    <div class="header-title">Order History</div>
  </div>

  <div class="content">
    <div class="heading-lg">Past deliveries</div>

    <div class="card" style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--text-primary)">Saturday 21st May</div>
          <div class="text-xs">3 Nights for 4 people</div>
        </div>
        <span class="badge badge-green">Delivered</span>
      </div>
      <div class="order-images">
        <div class="order-img" style="background:#C5C88A"></div>
        <div class="order-img" style="background:#A8B060"></div>
        <div class="order-img" style="background:#D4D4AA"></div>
      </div>
      <div class="order-footer">
        <span class="order-link">View details</span>
        <span class="order-price">$229.99</span>
      </div>
    </div>

    <div class="card" style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--text-primary)">Saturday 14th May</div>
          <div class="text-xs">3 Nights for 4 people</div>
        </div>
        <span class="badge badge-green">Delivered</span>
      </div>
      <div class="order-images">
        <div class="order-img" style="background:#B8B870"></div>
        <div class="order-img" style="background:#C0C890"></div>
        <div class="order-img" style="background:#D0D4A0"></div>
      </div>
      <div class="order-footer">
        <span class="order-link">View details</span>
        <span class="order-price">$229.99</span>
      </div>
    </div>

    <div class="card" style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--text-primary)">Saturday 7th May</div>
          <div class="text-xs">3 Nights for 4 people</div>
        </div>
        <span class="badge badge-gray">Skipped</span>
      </div>
      <div class="order-footer" style="padding-top:12px">
        <span class="order-link">View details</span>
        <span class="order-price">$0.00</span>
      </div>
    </div>
  </div>
</div>`;

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  render('account');
});
