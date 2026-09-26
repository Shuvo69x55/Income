/**
 * INCOME NETWORK - MAIN JAVASCRIPT ENGINE (app.js)
 * High-Performance Vanilla JS for Static GitHub Pages Hosting
 * Handles LocalStorage state, authentication, referral tracking, simulation, and admin operations.
 */

// Storage Keys
const STORAGE_KEYS = {
  USERS: 'income_network_users',
  CURRENT_USER: 'income_network_current_user',
  REFERRALS: 'income_network_referrals',
  ACTIVITIES: 'income_network_activities',
  SETTINGS: 'income_network_settings',
  PENDING_REF: 'income_network_pending_ref',
  ADMIN_SESSION: 'income_network_admin_session',
};

// Default System Configuration
const DEFAULT_SETTINGS = {
  siteName: 'Income Network',
  commissionRate: 25, // 25% direct commission
  tier2Rate: 10, // 10% secondary commission
  welcomeBonus: 10.00,
  minPayout: 50.00,
  cookieDays: 90,
  currency: '$',
  githubRepoUrl: '', // Auto-detected or customized by user
};

// Initialize Default Seed Data
function initDefaultData() {
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const seedUsers = [
      {
        id: 'IN-78401',
        fullName: 'Alex Mercer',
        username: 'alex99',
        email: 'alex@example.com',
        password: 'password123',
        referralCode: 'ALEX99',
        referredBy: null,
        balance: 450.00,
        pendingEarnings: 75.00,
        totalEarnings: 525.00,
        totalReferrals: 18,
        tier2Referrals: 6,
        status: 'Active',
        joinedAt: '2026-08-14 10:24',
      },
      {
        id: 'IN-55210',
        fullName: 'Sarah Chen',
        username: 'sarah24',
        email: 'sarah@example.com',
        password: 'password123',
        referralCode: 'SARAH24',
        referredBy: 'ALEX99',
        balance: 310.00,
        pendingEarnings: 50.00,
        totalEarnings: 360.00,
        totalReferrals: 12,
        tier2Referrals: 3,
        status: 'Active',
        joinedAt: '2026-08-20 14:15',
      },
      {
        id: 'IN-90314',
        fullName: 'Marcus Vance',
        username: 'mvance',
        email: 'marcus@example.com',
        password: 'password123',
        referralCode: 'MVANCE',
        referredBy: 'ALEX99',
        balance: 175.00,
        pendingEarnings: 25.00,
        totalEarnings: 200.00,
        totalReferrals: 7,
        tier2Referrals: 2,
        status: 'Active',
        joinedAt: '2026-09-02 09:30',
      },
      {
        id: 'IN-10492',
        fullName: 'Demo Affiliate',
        username: 'demouser',
        email: 'demo@incomenetwork.io',
        password: 'password123',
        referralCode: 'DEMO100',
        referredBy: 'SARAH24',
        balance: 145.00,
        pendingEarnings: 35.00,
        totalEarnings: 180.00,
        totalReferrals: 6,
        tier2Referrals: 2,
        status: 'Active',
        joinedAt: '2026-09-10 11:00',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REFERRALS)) {
    const seedReferrals = [
      { id: 'REF-1', referrerCode: 'DEMO100', referredName: 'David Kim', referredUsername: 'dkim', date: '2026-09-22', tier: 1, commission: 25.00, status: 'Completed' },
      { id: 'REF-2', referrerCode: 'DEMO100', referredName: 'Jessica Bell', referredUsername: 'jess_b', date: '2026-09-20', tier: 1, commission: 25.00, status: 'Completed' },
      { id: 'REF-3', referrerCode: 'DEMO100', referredName: 'Liam O\'Connor', referredUsername: 'liam_o', date: '2026-09-18', tier: 1, commission: 25.00, status: 'Completed' },
      { id: 'REF-4', referrerCode: 'DEMO100', referredName: 'Anna Morales', referredUsername: 'annamor', date: '2026-09-15', tier: 1, commission: 25.00, status: 'Completed' },
      { id: 'REF-5', referrerCode: 'DEMO100', referredName: 'Robert Lang', referredUsername: 'rlang', date: '2026-09-12', tier: 2, commission: 10.00, status: 'Completed' },
      { id: 'REF-6', referrerCode: 'DEMO100', referredName: 'Chloe Bennett', referredUsername: 'chloeb', date: '2026-09-25', tier: 1, commission: 35.00, status: 'Pending' },
    ];
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(seedReferrals));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    const seedActivities = [
      { id: 'ACT-1', user: 'DEMO100', type: 'commission', text: 'Earned $25.00 commission from direct referral @chloeb', date: '12 minutes ago' },
      { id: 'ACT-2', user: 'DEMO100', type: 'signup', text: 'New referral registered: Chloe Bennett (@chloeb)', date: '1 hour ago' },
      { id: 'ACT-3', user: 'DEMO100', type: 'commission', text: 'Earned $10.00 Tier 2 commission from partner invite', date: '2 days ago' },
      { id: 'ACT-4', user: 'DEMO100', type: 'bonus', text: 'Welcome Starter Bonus ($10.00) credited to wallet', date: 'Sep 10, 2026' }
    ];
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(seedActivities));
  }
}

// Data Store Accessors
function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
  const users = getUsers();
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (stored) {
    try {
      const username = JSON.parse(stored).username;
      const found = users.find(u => u.username === username);
      if (found) return found;
    } catch (e) {}
  }
  const defaultUser = users.find(u => u.username === 'demouser') || users[0];
  if (defaultUser) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ username: defaultUser.username }));
    return defaultUser;
  }
  return null;
}

function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ username: user.username }));
  }
}

function getSettings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS));
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function getReferrals() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REFERRALS) || '[]');
}

function saveReferrals(refs) {
  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(refs));
}

function getActivities() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
}

function addActivity(userCode, type, text) {
  const acts = getActivities();
  acts.unshift({
    id: 'ACT-' + Date.now(),
    user: userCode,
    type,
    text,
    date: 'Just now'
  });
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(acts.slice(0, 50)));
}

// Toast Notification System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'danger' ? 'toast-danger' : type === 'info' ? 'toast-info' : ''}`;
  
  const icon = type === 'danger' ? '⚠️' : type === 'info' ? 'ℹ️' : '✓';
  toast.innerHTML = `
    <span style="font-weight: bold;">${icon}</span>
    <div style="flex: 1;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// Generate Referral URL for current environment / GitHub Pages
function getReferralLink(referralCode) {
  const settings = getSettings();
  if (settings.githubRepoUrl && settings.githubRepoUrl.trim() !== '') {
    const cleanBase = settings.githubRepoUrl.trim().replace(/\/$/, '');
    return `${cleanBase}/?ref=${referralCode}`;
  }
  
  // Use current window origin + repository pathname
  const origin = window.location.origin;
  let path = window.location.pathname;
  // If path ends with a .html file, strip it to point to index
  if (path.endsWith('.html')) {
    path = path.substring(0, path.lastIndexOf('/') + 1);
  } else if (!path.endsWith('/')) {
    path += '/';
  }
  return `${origin}${path}?ref=${referralCode}`;
}

// Clipboard Copy Helper
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Failed to copy', 'danger');
  }
  document.body.removeChild(tempInput);
}

// Global URL Referral Detection
function checkReferralParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');

  if (refCode && refCode.trim() !== '') {
    const cleanCode = refCode.trim().toUpperCase();
    localStorage.setItem(STORAGE_KEYS.PENDING_REF, cleanCode);
    
    // Check if referrer exists
    const users = getUsers();
    const referrer = users.find(u => u.referralCode === cleanCode);
    const referrerName = referrer ? referrer.fullName : cleanCode;

    // Show banner or toast
    showToast(`🎉 Referral Detected: Invited by ${referrerName}! Your $10.00 signup bonus is ready.`, 'info');

    // Auto-fill register input if on register page
    const refInput = document.getElementById('reg-referral');
    if (refInput) {
      refInput.value = cleanCode;
      refInput.setAttribute('readonly', 'true');
      const helper = document.getElementById('ref-helper');
      if (helper) {
        helper.innerHTML = `<span style="color: var(--accent-primary);">✓ Referral partner "${referrerName}" verified. $10 welcome bonus applied!</span>`;
      }
    }
  }
}

// Navigation Bar Sync
function syncNavigation() {
  const user = getCurrentUser();
  const navActions = document.getElementById('nav-actions');

  if (navActions) {
    navActions.innerHTML = `
      <a href="dashboard.html" class="btn btn-primary btn-sm">User Dashboard</a>
      <a href="referral.html" class="btn btn-secondary btn-sm">Referral Hub</a>
    `;
  }

  // Update dynamic user name placeholders across pages
  const userNameHolders = document.querySelectorAll('.dynamic-user-name');
  userNameHolders.forEach(el => {
    if (user) el.textContent = user.fullName;
  });
}

// Logout
function logoutUser() {
  setCurrentUser(null);
  showToast('Logged out successfully.');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 300);
}

// Register Flow
function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  // Pre-fill pending ref code if stored
  const pendingRef = localStorage.getItem(STORAGE_KEYS.PENDING_REF);
  const refInput = document.getElementById('reg-referral');
  if (pendingRef && refInput && !refInput.value) {
    refInput.value = pendingRef;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const referralCodeInput = document.getElementById('reg-referral').value.trim().toUpperCase();

    // Validation
    if (!fullName || !username || !email || !password) {
      showToast('Please fill in all required fields.', 'danger');
      return;
    }

    if (username.length < 3) {
      showToast('Username must be at least 3 characters.', 'danger');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showToast('Username can only contain letters, numbers, and underscores.', 'danger');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'danger');
      return;
    }

    const users = getUsers();
    if (users.some(u => u.username === username)) {
      showToast('Username is already taken. Please choose another.', 'danger');
      return;
    }

    if (users.some(u => u.email === email)) {
      showToast('An account with this email already exists.', 'danger');
      return;
    }

    // Generate unique referral code: UPPERCASE_USERNAME
    let userReferralCode = username.toUpperCase();
    if (users.some(u => u.referralCode === userReferralCode)) {
      userReferralCode = username.toUpperCase() + Math.floor(100 + Math.random() * 900);
    }

    const settings = getSettings();
    const welcomeBonus = settings.welcomeBonus || 10.00;

    // Check if referred by valid affiliate
    let referrerUser = null;
    if (referralCodeInput) {
      referrerUser = users.find(u => u.referralCode === referralCodeInput);
    }

    const newUserId = 'IN-' + Math.floor(10000 + Math.random() * 90000);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newUser = {
      id: newUserId,
      fullName,
      username,
      email,
      password,
      referralCode: userReferralCode,
      referredBy: referrerUser ? referrerUser.referralCode : null,
      balance: welcomeBonus, // $10 Starter credit
      pendingEarnings: 0.00,
      totalEarnings: welcomeBonus,
      totalReferrals: 0,
      tier2Referrals: 0,
      status: 'Active',
      joinedAt: nowStr
    };

    users.push(newUser);

    // If referred, reward referrer & log referral
    if (referrerUser) {
      referrerUser.totalReferrals += 1;
      const refCommission = 25.00; // direct signup commission
      referrerUser.balance += refCommission;
      referrerUser.totalEarnings += refCommission;

      const referrals = getReferrals();
      referrals.unshift({
        id: 'REF-' + Date.now(),
        referrerCode: referrerUser.referralCode,
        referredName: newUser.fullName,
        referredUsername: newUser.username,
        date: nowStr.substring(0, 10),
        tier: 1,
        commission: refCommission,
        status: 'Completed'
      });
      saveReferrals(referrals);

      addActivity(referrerUser.referralCode, 'commission', `Earned $${refCommission.toFixed(2)} from referral @${newUser.username}`);
      addActivity(referrerUser.referralCode, 'signup', `New direct partner joined: ${newUser.fullName} (@${newUser.username})`);
    }

    saveUsers(users);
    localStorage.removeItem(STORAGE_KEYS.PENDING_REF);

    // Set active session
    setCurrentUser(newUser);
    addActivity(newUser.referralCode, 'bonus', `Welcome Starter Credit ($${welcomeBonus.toFixed(2)}) applied.`);

    showToast(`Welcome ${fullName}! Your account has been created.`);
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  });
}

// Login Flow
function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => (u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier));

    if (!user) {
      showToast('No user found with those credentials.', 'danger');
      return;
    }

    if (user.password !== password) {
      showToast('Incorrect password. Please try again.', 'danger');
      return;
    }

    if (user.status === 'Suspended') {
      showToast('This account is suspended. Please contact support.', 'danger');
      return;
    }

    setCurrentUser(user);
    showToast(`Welcome back, ${user.fullName}!`);
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  });

  // Quick Demo Account Login button
  const demoBtn = document.getElementById('demo-login-btn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      const users = getUsers();
      const demoUser = users.find(u => u.username === 'demouser') || users[0];
      if (demoUser) {
        document.getElementById('login-identifier').value = demoUser.email;
        document.getElementById('login-password').value = demoUser.password;
        setCurrentUser(demoUser);
        showToast('Demo credentials auto-filled. Logging in...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      }
    });
  }
}

// Dashboard Page Setup
function setupDashboardPage() {
  let user = getCurrentUser();
  if (!user) {
    const users = getUsers();
    user = users.find(u => u.username === 'demouser') || users[0];
    setCurrentUser(user);
  }
  if (!user) return;

  // Populate User Info
  const nameEl = document.getElementById('dash-user-name');
  const usernameEl = document.getElementById('dash-user-username');
  const idEl = document.getElementById('dash-user-id');
  const statusEl = document.getElementById('dash-user-status');
  const avatarEl = document.getElementById('dash-user-avatar');

  if (nameEl) nameEl.textContent = user.fullName;
  if (usernameEl) usernameEl.textContent = '@' + user.username;
  if (idEl) idEl.textContent = user.id;
  if (statusEl) statusEl.textContent = user.status;
  if (avatarEl) avatarEl.textContent = user.fullName.charAt(0).toUpperCase();

  // Populate Metrics
  const balanceEl = document.getElementById('dash-balance');
  const totalEarnedEl = document.getElementById('dash-total-earned');
  const referralsEl = document.getElementById('dash-total-referrals');
  const pendingEl = document.getElementById('dash-pending-earnings');

  if (balanceEl) balanceEl.textContent = `$${user.balance.toFixed(2)}`;
  if (totalEarnedEl) totalEarnedEl.textContent = `$${user.totalEarnings.toFixed(2)}`;
  if (referralsEl) referralsEl.textContent = user.totalReferrals;
  if (pendingEl) pendingEl.textContent = `$${user.pendingEarnings.toFixed(2)}`;

  // Populate Referral Link
  const refCodeEl = document.getElementById('dash-ref-code');
  const refLinkInput = document.getElementById('dash-ref-link');
  const fullRefLink = getReferralLink(user.referralCode);

  if (refCodeEl) refCodeEl.textContent = user.referralCode;
  if (refLinkInput) refLinkInput.value = fullRefLink;

  // Copy buttons
  const copyBtn = document.getElementById('dash-copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(fullRefLink, 'Referral link copied! Ready to share.');
    });
  }

  const copyCodeBtn = document.getElementById('dash-copy-code-btn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      copyToClipboard(user.referralCode, 'Referral code copied!');
    });
  }

  // Share buttons
  setupSocialShareButtons(fullRefLink, user.referralCode);

  // Render Activity Feed
  renderDashboardActivities(user.referralCode);

  // Setup Simulation Tools
  setupSimulatorTools(user);

  // Payout Modal
  setupPayoutModal(user);
}

// Social Share Helpers
function setupSocialShareButtons(link, code) {
  const text = encodeURIComponent(`Join Income Network with my affiliate code ${code} and claim a $10 starter bonus: ${link}`);
  const encodedUrl = encodeURIComponent(link);

  const twitterBtn = document.getElementById('share-twitter');
  if (twitterBtn) {
    twitterBtn.href = `https://twitter.com/intent/tweet?text=${text}`;
    twitterBtn.target = '_blank';
  }

  const whatsappBtn = document.getElementById('share-whatsapp');
  if (whatsappBtn) {
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${text}`;
    whatsappBtn.target = '_blank';
  }

  const telegramBtn = document.getElementById('share-telegram');
  if (telegramBtn) {
    telegramBtn.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`Join Income Network with code ${code}`)}`;
    telegramBtn.target = '_blank';
  }
}

// Dashboard Activities Feed
function renderDashboardActivities(userCode) {
  const container = document.getElementById('dash-activity-list');
  if (!container) return;

  const activities = getActivities().filter(a => a.user === userCode || a.user === 'GLOBAL');
  if (activities.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No recent activity yet. Share your referral link to start earning!</p>
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = activities.slice(0, 8).map(act => `
    <tr>
      <td>
        <span class="status-indicator status-active">●</span>
        ${escapeHtml(act.text)}
      </td>
      <td style="color: var(--text-muted);">${escapeHtml(act.type.toUpperCase())}</td>
      <td class="tabular-nums" style="color: var(--text-dim); text-align: right;">${escapeHtml(act.date)}</td>
    </tr>
  `).join('');
}

// Simulator Tools (Lets reviewer test referral clicks and instant signups)
function setupSimulatorTools(currentUser) {
  const simClickBtn = document.getElementById('sim-click-btn');
  const simSignupBtn = document.getElementById('sim-signup-btn');

  if (simClickBtn) {
    simClickBtn.addEventListener('click', () => {
      showToast(`Simulated click recorded on referral link for [${currentUser.referralCode}]. Unique tracking cookie active for 90 days.`);
      addActivity(currentUser.referralCode, 'click', `Unique referral link click recorded from United States (Chrome/Mobile)`);
      renderDashboardActivities(currentUser.referralCode);
    });
  }

  if (simSignupBtn) {
    simSignupBtn.addEventListener('click', () => {
      // Simulate a brand new user signing up under current user
      const users = getUsers();
      const targetUser = users.find(u => u.username === currentUser.username);
      if (!targetUser) return;

      const randomNames = ['Liam Taylor', 'Olivia Scott', 'Noah Miller', 'Emma Garcia', 'Lucas Wright', 'Sophia Adams'];
      const pickedName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomUser = pickedName.toLowerCase().replace(' ', '') + Math.floor(10 + Math.random() * 89);
      const commission = 25.00;

      targetUser.totalReferrals += 1;
      targetUser.balance += commission;
      targetUser.totalEarnings += commission;

      const referrals = getReferrals();
      referrals.unshift({
        id: 'REF-' + Date.now(),
        referrerCode: currentUser.referralCode,
        referredName: pickedName,
        referredUsername: randomUser,
        date: new Date().toISOString().substring(0, 10),
        tier: 1,
        commission: commission,
        status: 'Completed'
      });
      saveReferrals(referrals);

      saveUsers(users);
      addActivity(currentUser.referralCode, 'commission', `🎉 New referral converted! Earned $${commission.toFixed(2)} from @${randomUser}`);
      addActivity(currentUser.referralCode, 'signup', `New partner registered: ${pickedName} (@${randomUser})`);

      showToast(`🎉 Simulation: New referral converted! $${commission.toFixed(2)} added to your wallet balance.`);
      
      // Update UI elements
      setupDashboardPage();
    });
  }
}

// Payout Modal Flow
function setupPayoutModal(user) {
  const openBtn = document.getElementById('dash-withdraw-btn');
  const modal = document.getElementById('payout-modal');
  const closeBtn = document.getElementById('payout-modal-close');
  const form = document.getElementById('payout-form');
  const maxBalanceEl = document.getElementById('payout-max-balance');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      if (maxBalanceEl) maxBalanceEl.textContent = `$${user.balance.toFixed(2)}`;
      const amountInput = document.getElementById('payout-amount');
      if (amountInput) amountInput.value = user.balance.toFixed(2);
      modal.classList.add('open');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('payout-amount').value);
      const method = document.getElementById('payout-method').value;
      const destination = document.getElementById('payout-destination').value.trim();

      const settings = getSettings();
      const minPayout = settings.minPayout || 50.00;

      if (isNaN(amount) || amount < minPayout) {
        showToast(`Minimum withdrawal amount is $${minPayout.toFixed(2)}.`, 'danger');
        return;
      }

      if (amount > user.balance) {
        showToast('Insufficient wallet balance.', 'danger');
        return;
      }

      if (!destination) {
        showToast('Please enter your payout destination account / address.', 'danger');
        return;
      }

      // Process withdrawal
      const users = getUsers();
      const dbUser = users.find(u => u.username === user.username);
      if (dbUser) {
        dbUser.balance -= amount;
        saveUsers(users);
      }

      addActivity(user.referralCode, 'payout', `Withdrawal of $${amount.toFixed(2)} via ${method} (${destination}) submitted for clearance.`);
      modal.classList.remove('open');
      showToast(`Withdrawal request for $${amount.toFixed(2)} submitted successfully!`);
      
      setTimeout(() => {
        setupDashboardPage();
      }, 400);
    });
  }
}

// Referral Page Setup
function setupReferralPage() {
  let user = getCurrentUser();
  if (!user) {
    const users = getUsers();
    user = users.find(u => u.username === 'demouser') || users[0];
    setCurrentUser(user);
  }
  if (!user) return;

  const fullRefLink = getReferralLink(user.referralCode);

  // Populate link inputs & codes
  const linkInputs = document.querySelectorAll('.referral-link-display');
  linkInputs.forEach(input => input.value = fullRefLink);

  const codeDisplays = document.querySelectorAll('.referral-code-display');
  codeDisplays.forEach(el => el.textContent = user.referralCode);

  // Copy link buttons
  const copyButtons = document.querySelectorAll('.copy-ref-link-action');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      copyToClipboard(fullRefLink, 'Affiliate link copied to clipboard!');
    });
  });

  // Calculate tier breakdown
  const allReferrals = getReferrals().filter(r => r.referrerCode === user.referralCode);
  const tier1Count = allReferrals.filter(r => r.tier === 1).length;
  const tier2Count = allReferrals.filter(r => r.tier === 2).length;
  const totalEarnedFromRefs = allReferrals.reduce((sum, r) => sum + r.commission, 0);

  const t1El = document.getElementById('ref-tier1-count');
  const t2El = document.getElementById('ref-tier2-count');
  const totalRefsEl = document.getElementById('ref-total-count');
  const totalCommEl = document.getElementById('ref-total-commission');

  if (t1El) t1El.textContent = tier1Count;
  if (t2El) t2El.textContent = tier2Count;
  if (totalRefsEl) totalRefsEl.textContent = allReferrals.length;
  if (totalCommEl) totalCommEl.textContent = `$${totalEarnedFromRefs.toFixed(2)}`;

  // Populate referral table
  const tbody = document.getElementById('referral-history-tbody');
  if (tbody) {
    if (allReferrals.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <div class="empty-state-icon">👥</div>
            <p>No referrals in your network yet. Share your link to start generating passive income!</p>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = allReferrals.map(ref => `
        <tr>
          <td>
            <strong>${escapeHtml(ref.referredName)}</strong>
            <div style="font-size: 0.775rem; color: var(--text-dim);">@${escapeHtml(ref.referredUsername)}</div>
          </td>
          <td class="tabular-nums">${escapeHtml(ref.date)}</td>
          <td>
            <span style="font-size: 0.8rem; font-weight: 600; color: ${ref.tier === 1 ? 'var(--accent-primary)' : 'var(--accent-cyan)'};">
              Tier ${ref.tier} (${ref.tier === 1 ? 'Direct 25%' : 'Indirect 10%'})
            </span>
          </td>
          <td class="tabular-nums" style="font-weight: 700; color: var(--accent-primary);">
            +$${ref.commission.toFixed(2)}
          </td>
          <td>
            <span class="status-indicator status-${ref.status === 'Completed' ? 'active' : 'pending'}">
              ● ${escapeHtml(ref.status)}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="showToast('Affiliate tracking ID verified. Status: Valid.')">Verify</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Social copy snippets
  setupMarketingSnippets(fullRefLink, user.referralCode);
}

// Marketing Kit Snippets Copy
function setupMarketingSnippets(link, code) {
  const copyTwitterSnippet = document.getElementById('copy-tweet-snippet');
  if (copyTwitterSnippet) {
    copyTwitterSnippet.addEventListener('click', () => {
      const text = `I'm using Income Network to earn daily recurring affiliate income! Sign up with my link to get an instant $10 welcome bonus: ${link} #Affiliate #PassiveIncome`;
      copyToClipboard(text, 'Twitter promo copy copied!');
    });
  }

  const copyEmailSnippet = document.getElementById('copy-email-snippet');
  if (copyEmailSnippet) {
    copyEmailSnippet.addEventListener('click', () => {
      const text = `Hey,\n\nI wanted to share this new affiliate platform with you: Income Network. It offers up to 25% direct recurring commissions, daily payouts, and instant tracking.\n\nYou can use my invite link to claim a $10 starter bonus on signup:\n${link}\n\nLet me know once you're in!`;
      copyToClipboard(text, 'Email invite template copied!');
    });
  }

  const copyBannerSnippet = document.getElementById('copy-banner-snippet');
  if (copyBannerSnippet) {
    copyBannerSnippet.addEventListener('click', () => {
      const codeHtml = `<a href="${link}" target="_blank"><img src="${window.location.origin}/banner-affiliate.png" alt="Join Income Network" /></a>`;
      copyToClipboard(codeHtml, 'HTML banner embed code copied!');
    });
  }
}

// Admin Panel Engine
function setupAdminPage() {
  const adminOverlay = document.getElementById('admin-login-overlay');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');

  const isAdminLogged = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';

  if (!isAdminLogged && adminOverlay) {
    adminOverlay.style.display = 'flex';
  } else if (adminOverlay) {
    adminOverlay.style.display = 'none';
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const pass = document.getElementById('admin-password').value;

      if ((email === 'admin@incomenetwork.io' || email === 'admin') && pass === 'admin123') {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
        if (adminOverlay) adminOverlay.style.display = 'none';
        showToast('Admin authenticated successfully.');
        loadAdminData();
      } else {
        showToast('Invalid admin credentials. Use admin@incomenetwork.io / admin123', 'danger');
      }
    });

    const demoAdminBtn = document.getElementById('demo-admin-fill-btn');
    if (demoAdminBtn) {
      demoAdminBtn.addEventListener('click', () => {
        document.getElementById('admin-email').value = 'admin@incomenetwork.io';
        document.getElementById('admin-password').value = 'admin123';
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
        if (adminOverlay) adminOverlay.style.display = 'none';
        showToast('Authenticated with Demo Admin session.');
        loadAdminData();
      });
    }
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      window.location.reload();
    });
  }

  if (isAdminLogged) {
    loadAdminData();
  }
}

function loadAdminData() {
  const users = getUsers();
  const referrals = getReferrals();
  const settings = getSettings();

  // Top KPIs
  const totalUsers = users.length;
  const totalReferrals = referrals.length;
  const totalPaid = users.reduce((sum, u) => sum + (u.totalEarnings || 0), 0);
  const activeUsers = users.filter(u => u.status === 'Active').length;

  const totalUsersEl = document.getElementById('admin-total-users');
  const totalRefsEl = document.getElementById('admin-total-referrals');
  const totalPaidEl = document.getElementById('admin-total-earnings');
  const activeUsersEl = document.getElementById('admin-active-users');

  if (totalUsersEl) totalUsersEl.textContent = totalUsers;
  if (totalRefsEl) totalRefsEl.textContent = totalReferrals;
  if (totalPaidEl) totalPaidEl.textContent = `$${totalPaid.toFixed(2)}`;
  if (activeUsersEl) activeUsersEl.textContent = activeUsers;

  // Render User Table
  renderAdminUserTable(users);

  // Search & Filter
  const searchInput = document.getElementById('admin-user-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = users.filter(u => 
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.referralCode.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
      renderAdminUserTable(filtered);
    });
  }

  // Leaderboard
  renderAdminLeaderboard(users);

  // Settings Form
  setupAdminSettingsForm(settings);
}

function renderAdminUserTable(usersList) {
  const tbody = document.getElementById('admin-user-tbody');
  if (!tbody) return;

  if (usersList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <p>No matching users found.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = usersList.map(u => `
    <tr>
      <td class="tabular-nums" style="font-weight: 600; color: var(--admin-accent-blue);">${escapeHtml(u.id)}</td>
      <td>
        <div class="table-user-cell">
          <div class="user-mini-avatar">${escapeHtml(u.fullName.charAt(0))}</div>
          <div>
            <div style="font-weight: 600;">${escapeHtml(u.fullName)}</div>
            <div style="font-size: 0.775rem; color: var(--admin-text-dim);">@${escapeHtml(u.username)}</div>
          </div>
        </div>
      </td>
      <td style="color: var(--admin-text-muted);">${escapeHtml(u.email)}</td>
      <td>
        <span class="tabular-nums" style="font-weight: 700; color: var(--admin-accent); font-size: 0.85rem;">
          ${escapeHtml(u.referralCode)}
        </span>
      </td>
      <td class="tabular-nums" style="color: var(--admin-text-muted);">${u.referredBy ? escapeHtml(u.referredBy) : '—'}</td>
      <td class="tabular-nums" style="font-weight: 600;">${u.totalReferrals}</td>
      <td class="tabular-nums" style="font-weight: 700; color: var(--admin-accent);">$${u.balance.toFixed(2)}</td>
      <td>
        <span class="status-indicator status-${u.status === 'Active' ? 'active' : 'pending'}">
          ● ${escapeHtml(u.status)}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-table-action" onclick="window.viewUserModal('${u.id}')">View</button>
          <button class="btn-table-action" onclick="window.toggleUserStatus('${u.id}')">
            ${u.status === 'Active' ? 'Suspend' : 'Activate'}
          </button>
          <button class="btn-table-action" onclick="window.creditUser('${u.id}')">+ Credit</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderAdminLeaderboard(users) {
  const container = document.getElementById('admin-leaderboard');
  if (!container) return;

  const sorted = [...users].sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0));

  container.innerHTML = sorted.slice(0, 5).map((u, i) => `
    <div class="leaderboard-item">
      <div class="leader-rank">#${i + 1}</div>
      <div class="leader-info">
        <div class="leader-name">${escapeHtml(u.fullName)} (@${escapeHtml(u.username)})</div>
        <div class="leader-code">CODE: ${escapeHtml(u.referralCode)} · ${u.totalReferrals} Direct Referrals</div>
      </div>
      <div class="leader-metric">
        <div class="leader-earned">$${(u.totalEarnings || 0).toFixed(2)}</div>
        <div class="leader-count">Wallet: $${u.balance.toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}

function setupAdminSettingsForm(settings) {
  const commRateInput = document.getElementById('setting-comm-rate');
  const bonusInput = document.getElementById('setting-bonus');
  const minPayoutInput = document.getElementById('setting-min-payout');
  const repoUrlInput = document.getElementById('setting-repo-url');
  const saveBtn = document.getElementById('save-settings-btn');
  const resetBtn = document.getElementById('reset-demo-btn');

  if (commRateInput) commRateInput.value = settings.commissionRate || 25;
  if (bonusInput) bonusInput.value = settings.welcomeBonus || 10;
  if (minPayoutInput) minPayoutInput.value = settings.minPayout || 50;
  if (repoUrlInput) repoUrlInput.value = settings.githubRepoUrl || '';

  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const updated = {
        ...settings,
        commissionRate: parseFloat(commRateInput.value) || 25,
        welcomeBonus: parseFloat(bonusInput.value) || 10,
        minPayout: parseFloat(minPayoutInput.value) || 50,
        githubRepoUrl: repoUrlInput.value.trim(),
      };
      saveSettings(updated);
      showToast('Platform settings saved successfully!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data to default demo state?')) {
        localStorage.clear();
        initDefaultData();
        showToast('All demo data has been reset to defaults.');
        setTimeout(() => window.location.reload(), 500);
      }
    });
  }
}

// Global modal & action helpers for admin table
window.viewUserModal = function(userId) {
  const users = getUsers();
  const u = users.find(user => user.id === userId);
  if (!u) return;

  const modal = document.getElementById('admin-user-modal');
  const body = document.getElementById('admin-modal-body');
  if (modal && body) {
    body.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${escapeHtml(u.fullName)}</h4>
        <div style="color: var(--text-muted); font-size: 0.85rem;">User ID: ${escapeHtml(u.id)} · Username: @${escapeHtml(u.username)}</div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
        <div style="background: var(--bg-card); padding: 0.85rem; border-radius: 8px;">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Wallet Balance</div>
          <div class="tabular-nums" style="font-size: 1.25rem; font-weight: 700; color: var(--accent-primary);">$${u.balance.toFixed(2)}</div>
        </div>
        <div style="background: var(--bg-card); padding: 0.85rem; border-radius: 8px;">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Total Referrals</div>
          <div class="tabular-nums" style="font-size: 1.25rem; font-weight: 700;">${u.totalReferrals}</div>
        </div>
      </div>
      <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-muted);">
        <div><strong>Email:</strong> ${escapeHtml(u.email)}</div>
        <div><strong>Referral Code:</strong> <span class="tabular-nums" style="color: var(--accent-primary); font-weight: 700;">${escapeHtml(u.referralCode)}</span></div>
        <div><strong>Referred By:</strong> ${u.referredBy ? escapeHtml(u.referredBy) : 'Direct Organic Signup'}</div>
        <div><strong>Account Status:</strong> ${escapeHtml(u.status)}</div>
        <div><strong>Registered Date:</strong> ${escapeHtml(u.joinedAt || 'N/A')}</div>
        <div><strong>Affiliate Link:</strong> <code style="font-size: 0.75rem; word-break: break-all;">${escapeHtml(getReferralLink(u.referralCode))}</code></div>
      </div>
    `;
    modal.classList.add('open');
  }
};

window.toggleUserStatus = function(userId) {
  const users = getUsers();
  const u = users.find(user => user.id === userId);
  if (!u) return;

  u.status = u.status === 'Active' ? 'Suspended' : 'Active';
  saveUsers(users);
  showToast(`User @${u.username} status changed to ${u.status}`);
  loadAdminData();
};

window.creditUser = function(userId) {
  const amountStr = prompt('Enter commission credit amount in USD (e.g. 50.00):', '25.00');
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    showToast('Invalid amount entered.', 'danger');
    return;
  }

  const users = getUsers();
  const u = users.find(user => user.id === userId);
  if (!u) return;

  u.balance += amount;
  u.totalEarnings = (u.totalEarnings || 0) + amount;
  saveUsers(users);
  addActivity(u.referralCode, 'commission', `Admin manual bonus credit of $${amount.toFixed(2)} added to balance.`);
  showToast(`Successfully credited $${amount.toFixed(2)} to @${u.username}`);
  loadAdminData();
};

// Interactive Homepage Calculator
function setupHomepageCalculator() {
  const slider = document.getElementById('calc-referral-slider');
  const sliderVal = document.getElementById('calc-slider-val');
  const dailyEl = document.getElementById('calc-daily-earning');
  const monthlyEl = document.getElementById('calc-monthly-earning');
  const yearlyEl = document.getElementById('calc-yearly-earning');

  if (!slider) return;

  function update() {
    const refsPerMonth = parseInt(slider.value, 10);
    if (sliderVal) sliderVal.textContent = `${refsPerMonth} referrals`;

    // Calculation: $25 avg commission per referral + 10% tier 2 multiplier
    const avgCommission = 25.00;
    const monthlyTotal = refsPerMonth * avgCommission * 1.15;
    const dailyTotal = monthlyTotal / 30;
    const yearlyTotal = monthlyTotal * 12;

    if (dailyEl) dailyEl.textContent = `$${dailyTotal.toFixed(0)}`;
    if (monthlyEl) monthlyEl.textContent = `$${monthlyTotal.toFixed(0)}`;
    if (yearlyEl) yearlyEl.textContent = `$${yearlyTotal.toFixed(0)}`;
  }

  slider.addEventListener('input', update);
  update();
}

// FAQ Accordion Setup
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

// Success Stories Carousel
function setupStoriesCarousel() {
  const track = document.getElementById('stories-carousel-track');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('stories-prev-btn');
  const nextBtn = document.getElementById('stories-next-btn');
  const dots = document.querySelectorAll('.carousel-dot');
  const currentNumEl = document.getElementById('carousel-current-num');
  const viewport = document.getElementById('stories-carousel-viewport');

  if (slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  function goToSlide(index) {
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });

    if (currentNumEl) {
      currentNumEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.slide, 10);
      if (!isNaN(idx)) {
        goToSlide(idx);
        resetAutoplay();
      }
    });
  });

  // Touch Swipe Handling for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (viewport) {
    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    }, { passive: true });

    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
      }
    });

    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    startAutoplay();
  }

  startAutoplay();
}

// Utility: Escape HTML to avoid XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Run on Page Load
document.addEventListener('DOMContentLoaded', () => {
  initDefaultData();
  checkReferralParam();
  syncNavigation();
  setupHomepageCalculator();
  setupFaqAccordion();
  setupStoriesCarousel();
  setupRegisterForm();
  setupLoginForm();
  setupDashboardPage();
  setupReferralPage();
  setupAdminPage();

  // Close modals on escape key or backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    }
  });
});

