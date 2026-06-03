const MOCK_USERS = {
  "farmer@smartcoop.com": {
    password: "password",
    user: {
      id: "user-1",
      name: "John Anderson",
      email: "farmer@smartcoop.com",
      role: "farmer",
      farmName: "Anderson Poultry Farm",
      avatar: "JA"
    }
  },
  "admin@smartcoop.com": {
    password: "admin",
    user: {
      id: "admin-1",
      name: "Admin User",
      email: "admin@smartcoop.com",
      role: "admin",
      farmName: "SmartCoop Admin",
      avatar: "AU"
    }
  }
};

const SMARTCOOP_USER_KEY = "smartcoop_user";
const SMARTCOOP_USERS_KEY = "smartcoop_registered_users";

const mockData = {
  coops: [
    {
      id: "coop-1",
      name: "Backyard Coop",
      length: 4,
      width: 3,
      chickenType: "Layers",
      climate: "Tropical",
      numberOfChickens: 25,
      currentChickenCount: 25,
      estimatedCapacity: 30,
      pricePerChicken: 150,
      status: "active"
    },
    {
      id: "coop-2",
      name: "Main Coop",
      length: 6,
      width: 4,
      chickenType: "Broilers",
      climate: "Tropical",
      numberOfChickens: 50,
      currentChickenCount: 50,
      estimatedCapacity: 60,
      pricePerChicken: 120,
      status: "active"
    }
  ],
  alerts: [
    {
      title: "Vaccination Due",
      description: "Newcastle disease vaccination for Backyard Coop",
      priority: "high",
      date: "2026-04-08",
      time: "09:00"
    },
    {
      title: "Feed Stock Low",
      description: "Only 2 days of feed remaining for Main Coop",
      priority: "medium",
      date: "2026-04-06",
      time: "14:00"
    },
    {
      title: "Health Check",
      description: "Monthly health inspection for all coops",
      priority: "medium",
      date: "2026-04-10",
      time: "10:00"
    }
  ]
};

function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem(SMARTCOOP_USERS_KEY) || "{}");
}

function saveRegisteredUsers(users) {
  localStorage.setItem(SMARTCOOP_USERS_KEY, JSON.stringify(users));
}

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

function setLoading(button, loading, text) {
  if (!button) return;

  button.disabled = loading;
  button.classList.toggle("loading", loading);
  button.textContent = loading ? "Please wait..." : text;
}

function showSignupError(message) {
  const errorBox = document.getElementById("signupError");

  if (!errorBox) {
    alert(message);
    return;
  }

  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideSignupError() {
  const errorBox = document.getElementById("signupError");

  if (!errorBox) return;

  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function loginUser(email, password) {
  const registeredUsers = getRegisteredUsers();
  const allUsers = { ...MOCK_USERS, ...registeredUsers };
  const found = allUsers[email.toLowerCase()];

  if (found && found.password === password) {
    localStorage.setItem(SMARTCOOP_USER_KEY, JSON.stringify(found.user));
    localStorage.setItem("user", JSON.stringify(found.user));
    return true;
  }

  return false;
}

function registerUser(data) {
  const registeredUsers = getRegisteredUsers();
  const email = data.email.toLowerCase();

  if (MOCK_USERS[email] || registeredUsers[email]) {
    return {
      success: false,
      message: "Email is already registered."
    };
  }

  const initials = data.name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const newUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    role: "farmer",
    farmName: data.farmName || "SmartCoop Farm",
    avatar: initials || "U"
  };

  registeredUsers[email] = {
    password: data.password,
    user: newUser
  };

  saveRegisteredUsers(registeredUsers);
  localStorage.setItem(SMARTCOOP_USER_KEY, JSON.stringify(newUser));
  localStorage.setItem("user", JSON.stringify(newUser));

  return {
    success: true,
    message: "Account created successfully!"
  };
}

function setupLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("loginError");
    const button = document.getElementById("loginBtn");

    if (errorBox) {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
    }

    setLoading(button, true, "Sign in");

    setTimeout(() => {
      const success = loginUser(email, password);
      setLoading(button, false, "Sign in");

      if (success) {
        showToast("Welcome back!");
        setTimeout(() => {
          window.location.href = "user.html";
        }, 500);
      } else {
        if (errorBox) {
          errorBox.textContent = "Invalid email or password";
          errorBox.classList.remove("hidden");
        }

        showToast("Login failed. Please check your credentials.");
      }
    }, 500);
  });
}

function setupSignupPage() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    hideSignupError();

    const button = document.getElementById("signupBtn");

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("signupEmail").value.trim(),
      phoneNumber: document.getElementById("phoneNumber")
        ? document.getElementById("phoneNumber").value.trim()
        : "",
      farmName: document.getElementById("farmName")
        ? document.getElementById("farmName").value.trim()
        : "SmartCoop Farm",
      password: document.getElementById("signupPassword").value,
      confirmPassword: document.getElementById("confirmPassword").value
    };

    if (!data.name) {
      showSignupError("Full name is required.");
      return;
    }

    if (!data.email) {
      showSignupError("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      showSignupError("Please enter a valid email address.");
      return;
    }

    if (!data.phoneNumber) {
      showSignupError("Phone number is required.");
      return;
    }

    if (!data.password) {
      showSignupError("Password is required.");
      return;
    }

    if (data.password.length < 6) {
      showSignupError("Password must be at least 6 characters.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      showSignupError("Passwords do not match.");
      return;
    }

    setLoading(button, true, "Create Account");

    setTimeout(() => {
      const result = registerUser(data);
      setLoading(button, false, "Create Account");

      if (!result.success) {
        showSignupError(result.message);
        return;
      }

      showToast(result.message);

      setTimeout(() => {
        window.location.href = "user.html";
      }, 500);
    }, 500);
  });
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.type = input.type === "password" ? "text" : "password";
}

function socialLogin(provider) {
  const demoUser = {
    id: `social-${Date.now()}`,
    name: `${provider} User`,
    email: `${provider.toLowerCase()}@smartcoop.com`,
    role: "farmer",
    farmName: "SmartCoop Farm",
    avatar: provider[0].toUpperCase()
  };

  localStorage.setItem(SMARTCOOP_USER_KEY, JSON.stringify(demoUser));
  localStorage.setItem("user", JSON.stringify(demoUser));

  window.location.href = "user.html";
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function loadDashboard() {
  const storedUser =
    localStorage.getItem(SMARTCOOP_USER_KEY) ||
    localStorage.getItem("user");

  if (!storedUser) {
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(storedUser);
  const firstName = user.name ? user.name.split(" ")[0] : "User";

  const coops = mockData.coops || [];
  const alerts = mockData.alerts || [];

  const activeCoops = coops.filter(coop => coop.status === "active").length;
  const totalChickens = coops.reduce((sum, coop) => sum + coop.currentChickenCount, 0);
  const totalCost = coops.reduce(
    (sum, coop) => sum + coop.numberOfChickens * coop.pricePerChicken,
    0
  );

  setText("greeting", `${getGreeting()}, ${firstName}! 👋`);
  setText("totalChickens", totalChickens);
  setText("activeCoops", activeCoops);
  setText("activeCoopsText", `Across ${activeCoops} active coops`);
  setText("monthlyCost", `₱${totalCost.toLocaleString()}`);
  setText("alertBadge", alerts.length);
  setText("alertBadgePanel", alerts.length);

  setText("topUsername", user.name || "User");
  setText("userAvatarTop", user.avatar || firstName[0].toUpperCase());
  setText("dropdownName", user.name || "User");
  setText("dropdownEmail", user.email || "user@smartcoop.com");
  setText("dropdownFarm", user.farmName || "SmartCoop Farm");

  const activeProject = coops.find(coop => coop.status === "active");
  const projectContainer = document.getElementById("projectContainer");

  if (projectContainer && activeProject) {
    projectContainer.innerHTML = `
      <div class="project-card">
        <div class="project-header">
          <div>
            <h3>${activeProject.name}</h3>
            <p>${activeProject.chickenType} • ${activeProject.climate} Climate</p>
          </div>
          <span class="status-badge">Active</span>
        </div>

        <div class="project-grid">
          <div class="project-item">
            <small>Dimensions</small>
            <strong>${activeProject.length}m × ${activeProject.width}m</strong>
          </div>

          <div class="project-item">
            <small>Chickens</small>
            <strong>${activeProject.numberOfChickens}</strong>
          </div>

          <div class="project-item">
            <small>Capacity Usage</small>
            <strong>85%</strong>
          </div>

          <div class="project-item">
            <small>Investment</small>
            <strong>₱${(activeProject.numberOfChickens * activeProject.pricePerChicken).toLocaleString()}</strong>
          </div>
        </div>

        <div class="project-actions">
          <button type="button" class="model-btn" onclick="openCoopModal()">View 3D Model</button>
          <button type="button" class="cost-btn">View Costs</button>
        </div>
      </div>
    `;
  }

  const alertsContainer = document.getElementById("alertsContainer");

  if (alertsContainer) {
    alertsContainer.innerHTML = alerts.map(alert => `
      <div class="alert-card">
        <span class="alert-dot ${alert.priority}"></span>
        <div>
          <strong>${alert.title}</strong>
          <p>${alert.description}</p>
          <small>${alert.date} at ${alert.time}</small>
        </div>
      </div>
    `).join("");
  }

  if (window.lucide) lucide.createIcons();
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("SMARTCOOP_USER_KEY"); // kung meron ka nito

  window.location.href = "index.html";
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  const mobileNav = document.getElementById("mobileNav");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (mobileNav) mobileNav.classList.add("hidden");
  if (mobileMenuBtn) mobileMenuBtn.textContent = "☰";
}

function toggleMobileMenu() {
  const mobileNav = document.getElementById("mobileNav");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (!mobileNav) return;

  mobileNav.classList.toggle("hidden");

  if (mobileMenuBtn) {
    mobileMenuBtn.textContent =
      mobileNav.classList.contains("hidden") ? "☰" : "×";
  }
}

function goSignup() {
  window.location.href = "signup.html";
}

function goLogin() {
  window.location.href = "login.html";
}

function setupLandingPage() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const emailInput = document.getElementById("newsletterEmail");

    if (emailInput && emailInput.value.trim()) {
      showToast("Successfully subscribed to newsletter!");
      emailInput.value = "";
    }
  });
}
function openCoopModal() {
  const modal = document.getElementById("coopModal");
  if (modal) modal.classList.remove("hidden");
}

function closeCoopModal() {
  const modal = document.getElementById("coopModal");
  if (modal) modal.classList.add("hidden");
}
function setupCoopPlannerPage() {
  const form = document.getElementById("coopPlannerForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const length = Number(document.getElementById("coopLength").value);
    const width = Number(document.getElementById("coopWidth").value);
    const chickens = Number(document.getElementById("chickenCount").value);
    const price = Number(document.getElementById("priceChicken").value);

    const area = length * width;
    const estimatedCapacity = Math.floor(area * 2.5);
    const usage = Math.round((chickens / estimatedCapacity) * 100);
    const investment = chickens * price;

    document.getElementById("estimatedCapacity").textContent = `${estimatedCapacity} chickens`;
    document.getElementById("spaceArea").textContent = `${area} m²`;
    document.getElementById("capacityUsage").textContent = `${usage}%`;
    document.getElementById("totalInvestment").textContent = `₱${investment.toLocaleString()}`;

    const note = document.getElementById("plannerNote");

    if (usage > 100) {
      note.textContent = "Warning: Your coop is over capacity. Increase space or reduce chickens.";
      note.style.background = "#fef2f2";
      note.style.color = "#dc2626";
    } else if (usage >= 80) {
      note.textContent = "Good plan: Coop capacity is optimized.";
      note.style.background = "#ecfdf5";
      note.style.color = "#047857";
    } else {
      note.textContent = "There is still extra space available for more chickens.";
      note.style.background = "#eff6ff";
      note.style.color = "#1d4ed8";
    }
  });
}
function loadUserInfo() {
  const storedUser =
    localStorage.getItem(SMARTCOOP_USER_KEY) ||
    localStorage.getItem("user");

  if (!storedUser) {
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(storedUser);
  const firstName = user.name.split(" ")[0];

setText("topUsername", user.name || "User");
setText("userAvatarTop", user.avatar || firstName[0].toUpperCase());
setText("dropdownName", user.name || "User");
setText("dropdownEmail", user.email || "user@smartcoop.com");
setText("dropdownFarm", user.farmName || "SmartCoop Farm");
}
function getPlans() {
  return JSON.parse(localStorage.getItem("coopPlans") || "[]");
}
function toggleProfileMenu() {
  const dropdown = document.getElementById("profileDropdown");
  if (dropdown) dropdown.classList.toggle("hidden");
}

function savePlans(plans) {
  localStorage.setItem("coopPlans", JSON.stringify(plans));
}

function populateSizeDropdown() {
    const sizeSelect = document.getElementById('coopSize');
    if (!sizeSelect) return; 
    
    sizeSelect.innerHTML = '<option value="" disabled selected>Select Size</option>';

    for (let i = 1; i <= 10; i++) {
        let option = document.createElement('option');
        option.value = i + "," + i;
        option.text = i + " x " + i + " meters";
        sizeSelect.appendChild(option);
    }
}
function generatePlan() {
  console.log("Generating plan...");
  
  const sizeValue = document.getElementById("coopSize").value;
  console.log("Selected Size:", sizeValue); //
  
  if (!sizeValue) {
    alert("Please select a coop size!");
    return;
  }

  const [length, width] = sizeValue.split(',').map(Number);
  console.log("Dimensions:", length, width); //

  const chickens = Number(document.getElementById("chickens").value);
  console.log("Chickens:", chickens); // 


  if (length <= 0 || width <= 0 || chickens <= 0) {
    alert("Please enter valid dimensions and number of chickens.");
    return;
  }
  const price = Number(document.getElementById("price").value);
  const type = document.getElementById("type").value;
  const climate = document.getElementById("climate").value;

  if (length <= 0 || width <= 0 || chickens <= 0) {
    alert("Please enter valid dimensions and number of chickens.");
    return;
  }

  const area = length * width;
  const spacePerChicken = area / chickens;
  const optimalSpace = type.includes("Layers") ? 0.3 : 0.25;
  const maxCapacity = Math.floor(area / optimalSpace);
  if (chickens > maxCapacity) {
    alert(`Babala: Ang ${length}x${width} na coop ay para sa ${maxCapacity} manok lang. Sobra ang dami ng manok mo!`);
    return; // 
  }
  const capacityPercentage = Math.min((spacePerChicken / optimalSpace) * 100, 150);

  const construction = area * 1200;
  const feeders = Math.ceil(chickens / 10) * 350;
  const waterers = Math.ceil(chickens / 15) * 280;
  const perches = Math.ceil(chickens / 8) * 180;
  const nestBoxes = type.includes("Layers") ? Math.ceil(chickens / 5) * 420 : 0;
  const lighting = area * 85;
  const ventilation = area * 150;
  const chickenCost = chickens * price;

  const total =
    construction +
    feeders +
    waterers +
    perches +
    nestBoxes +
    lighting +
    ventilation +
    chickenCost;


    const previewBox = document.querySelector(".preview-box");
  if (previewBox) {
    previewBox.innerHTML = `
      <img src="img/1x1.png" alt="3D Coop Plan" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;">
      <div class="preview-info" id="previewInfo">
        ${length}m × ${width}m<br>
        <small>${area.toFixed(2)}m² area</small>
      </div>
    `;
  }

  document.getElementById("previewInfo").innerHTML =
    `${length}m × ${width}m<br><small>${area}m² area</small>`;

  document.getElementById("capacityResult").textContent = chickens;
  const capacityStatus = document.getElementById("capacityStatus");
  
  if (spacePerChicken < optimalSpace) {
    capacityStatus.textContent = "Overcrowded";
    capacityStatus.style.color = "#dc2626"; // Red
  } else if (spacePerChicken >= optimalSpace && spacePerChicken <= (optimalSpace + 0.2)) {
    capacityStatus.textContent = "Optimal Capacity";
    capacityStatus.style.color = "#047857"; // Green
  } else {
    capacityStatus.textContent = "Can fit more";
    capacityStatus.style.color = "#1d4ed8"; // Blue
  }
  document.getElementById("spaceUsageResult").textContent =
    `${capacityPercentage.toFixed(0)}%`;
  document.getElementById("spacePerChicken").textContent =
    `${spacePerChicken.toFixed(2)}m² per chicken`;
  document.getElementById("totalAreaText").textContent =
    `${area}m² total area`;

    const ventilationStatus = document.getElementById("ventilationResult");
    const climateDescP = document.getElementById("climateText");
  if (ventilationStatus) {
    if (usagePercentage <= 75) {
      ventilationStatus.textContent = "Excellent";
      ventilationStatus.style.color = "#047857"; // Green
    } else if (usagePercentage > 75 && usagePercentage <= 100) {
      ventilationStatus.textContent = "Good";
      ventilationStatus.style.color = "#1d4ed8"; // Blue
    } else {
      ventilationStatus.textContent = "Poor";
      ventilationStatus.style.color = "#dc2626"; // Red
    }
  }
  if (climateDescP) {
  
    climateDescP.textContent = `Optimized for ${climate} climate`;
}
  document.getElementById("climateText").textContent =
    `${climate} optimized`;

  document.getElementById("usageBarFill").style.width =
    `${Math.min(capacityPercentage, 100)}%`;

  document.getElementById("costTableBody").innerHTML = `
    <tr>
      <td>Coop Construction (${area}m²)</td>
      <td>₱${construction.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Feeders (${Math.ceil(chickens / 10)} units)</td>
      <td>₱${feeders.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Waterers (${Math.ceil(chickens / 15)} units)</td>
      <td>₱${waterers.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Perches</td>
      <td>₱${perches.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Nest Boxes</td>
      <td>₱${nestBoxes.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Lighting System</td>
      <td>₱${lighting.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Ventilation System</td>
      <td>₱${ventilation.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Chickens (${chickens})</td>
      <td>₱${chickenCost.toLocaleString()}</td>
    </tr>
  `;

  document.getElementById("totalCost").textContent =
    `₱${total.toLocaleString()}`;

  document.getElementById("costSection").classList.remove("hidden");
  document.getElementById("plannerActions").classList.remove("hidden");

  currentPlan = {
    id: Date.now(),
    name,
    length,
    width,
    chickens,
    type,
    climate,
    price,
    total,
    status: "active"
  };
}
function loadPlans() {
  const container = document.getElementById("savedPlans");
  if (!container) return;

  const plans = getPlans();

  container.innerHTML = plans.map(plan => `
    <div class="saved-card">
      <div class="saved-header">
        <h3>${plan.name}</h3>
        <span class="status-badge">active</span>
      </div>

      <p>${plan.type}</p>

      <div class="saved-body">
        <div>
          <p>Size</p>
          <strong>${plan.length}m × ${plan.width}m</strong>
        </div>

        <div>
          <p>Chickens</p>
          <strong>${plan.chickens}</strong>
        </div>
      </div>

      <div class="saved-actions">
        <button onclick="viewPlan(${plan.id})">👁 View</button>
        <button class="delete-btn" onclick="deletePlan(${plan.id})">🗑</button>
      </div>
    </div>
  `).join("");
}
function deletePlan(id) {
  let plans = getPlans();
  plans = plans.filter(p => p.id !== id);
  savePlans(plans);
  loadPlans();
}

function viewPlan(id) {
  const plans = getPlans();
  const plan = plans.find(p => p.id === id);

  if (!plan) return;

  alert(
    `${plan.name}\n${plan.length}m x ${plan.width}m\nChickens: ${plan.chickens}`
  );
}
function getBreedRecommendation() {
  const goal = document.getElementById("primaryGoal").value;
  const climate = document.getElementById("breedClimate").value;
  const space = document.getElementById("spaceAvailable").value;
  const location = document.getElementById("locationType").value;
  const experience = document.getElementById("experienceLevel").value;
  const result = document.getElementById("breedResult");

  if (!goal || !climate || !space || !location || !experience) {
    alert("Please complete all requirements first.");
    return;
  }

  let breed = "Rhode Island Red";
  let description = "A hardy, beginner-friendly breed with strong egg production and good climate adaptability.";

  if (goal === "eggs") {
    breed = "Leghorn";
    description = "Excellent for high egg production, active, efficient, and ideal for farmers focused on laying performance.";
  } else if (goal === "meat") {
    breed = "Cornish Cross";
    description = "Best for fast meat production with efficient growth and high feed conversion.";
  } else if (goal === "dual") {
    breed = "Rhode Island Red";
    description = "Great dual-purpose breed for both eggs and meat, with strong resistance and easy management.";
  }

  result.innerHTML = `
    <div class="recommendation-card">
      <h2>Recommended Breed</h2>
      <h1>${breed}</h1>
      <p>${description}</p>

      <div class="recommendation-tags">
        <span>${goal}</span>
        <span>${climate}</span>
        <span>${space}</span>
        <span>${experience}</span>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}
const healthDiseases = [
  {
    name: "Infectious Bronchitis",
    symptoms: ["sneezing", "coughing", "wateryEyes", "nasalDischarge", "reducedAppetite"],
    severity: "medium",
    advice: "Isolate affected birds immediately. Improve ventilation in the coop. Ensure clean water supply. Consult a veterinarian if symptoms continue.",
    prevention: "Vaccination, good biosecurity, and proper ventilation."
  },
  {
    name: "Coccidiosis",
    symptoms: ["diarrhea", "lethargy", "reducedAppetite", "droppedWings"],
    severity: "high",
    advice: "Start anticoccidial medication immediately. Provide electrolytes in water. Clean and disinfect coop thoroughly.",
    prevention: "Clean bedding, dry conditions, and anticoccidial feed."
  },
  {
    name: "Fowl Pox",
    symptoms: ["skinLesions", "featherLoss", "reducedAppetite", "lethargy"],
    severity: "medium",
    advice: "Support birds with good nutrition. Improve mosquito control. Most birds recover in 2-3 weeks.",
    prevention: "Vaccination, mosquito control, and biosecurity."
  },
  {
    name: "Parasitic Infestation",
    symptoms: ["featherLoss", "paleComb", "lethargy", "reducedAppetite", "eggProblems"],
    severity: "low",
    advice: "Deworm all birds with appropriate medication. Check for mites and lice. Clean and treat coop.",
    prevention: "Regular deworming, clean environment, and dust baths."
  }
];

function analyzeSymptoms() {
  const checked = [...document.querySelectorAll(".health-form input[type='checkbox']:checked")]
    .map(input => input.value);

  if (checked.length === 0) {
    alert("Please select at least one symptom.");
    return;
  }

  let bestMatch = healthDiseases[0];
  let bestScore = 0;

  healthDiseases.forEach(disease => {
    const matches = disease.symptoms.filter(symptom => checked.includes(symptom)).length;
    const score = Math.round((matches / disease.symptoms.length) * 100);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = disease;
    }
  });

  const result = document.getElementById("healthResult");

  result.innerHTML = `
    <div class="health-result-card ${bestMatch.severity}">
      <h2>${bestMatch.name}</h2>
      <span class="health-badge ${bestMatch.severity}">
        ${bestMatch.severity === "high" ? "High Priority" : bestMatch.severity === "medium" ? "Medium Priority" : "Low Priority"}
      </span>

      <p><strong>Confidence Score:</strong> ${bestScore}%</p>

      <div class="health-advice">
        <h3>Recommended Actions</h3>
        <p>${bestMatch.advice}</p>
      </div>

      <div class="health-advice">
        <h3>Prevention Tips</h3>
        <p>${bestMatch.prevention}</p>
      </div>

      <div class="health-actions">
        <button onclick="saveHealthRecord('${bestMatch.name}', '${bestMatch.severity}', ${bestScore})">Save Record</button>
        <button onclick="resetHealthChecker()">Check Another</button>
      </div>
    </div>
  `;
}

function saveHealthRecord(diagnosis, severity, confidence) {
  const checked = [...document.querySelectorAll(".health-form input[type='checkbox']:checked")]
    .map(input => input.parentElement.textContent.trim());

  const records = JSON.parse(localStorage.getItem("healthRecords") || "[]");

  records.unshift({
    id: Date.now(),
    diagnosis,
    severity,
    confidence,
    symptoms: checked,
    date: new Date().toISOString().slice(0, 10)
  });

  localStorage.setItem("healthRecords", JSON.stringify(records));
  loadHealthHistory();
  alert("Health record saved successfully!");
}

function loadHealthHistory() {
  const container = document.getElementById("healthHistory");
  if (!container) return;

  let records = JSON.parse(localStorage.getItem("healthRecords") || "[]");

  if (records.length === 0) {
    records = [
      {
        diagnosis: "Infectious Bronchitis",
        severity: "medium",
        confidence: 78,
        symptoms: ["Sneezing", "Watery eyes", "Reduced appetite"],
        date: "2026-03-28"
      }
    ];
  }

  container.innerHTML = records.slice(0, 5).map(record => `
    <div class="health-record">
      <h3>${record.diagnosis} <span class="health-badge ${record.severity}">${record.severity}</span></h3>
      <p>Symptoms: ${record.symptoms.join(", ")}</p>
      <p>${record.date} • Confidence: ${record.confidence}%</p>
    </div>
  `).join("");
}

function resetHealthChecker() {
  document.querySelectorAll(".health-form input[type='checkbox']").forEach(input => {
    input.checked = false;
  });

  document.getElementById("healthResult").innerHTML = `
    <div class="empty-health">
      <i data-lucide="heart"></i>
      <h2>AI-Powered Health Analysis</h2>
      <p>Select the symptoms you observe in your chickens and our AI will analyze them to identify potential health issues and provide care recommendations</p>
      <div class="health-disclaimer">
        <strong>Disclaimer:</strong> This tool provides guidance only and does not replace professional veterinary consultation. For serious conditions, always consult a licensed veterinarian.
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}
const aiResponses = {
  start: `Starting a backyard poultry farm is exciting!

1. Plan your space
2. Choose beginner-friendly breeds like Rhode Island Red
3. Build a safe coop with ventilation
4. Prepare feeders, waterers, bedding, and feed
5. Start small with 4-6 chickens
6. Check local rules and regulations`,

  breed: `For egg production, the best breeds are:

1. Leghorn - 280-320 eggs/year
2. Rhode Island Red - 250-300 eggs/year
3. ISA Brown - 300-350 eggs/year
4. Sussex - good dual-purpose breed`,

  capacity: `To calculate coop capacity:

Indoor space:
- 2-3 sq ft per chicken minimum
- More space is better for health

Example:
4m × 3m = 12m²
12m² is about 129 sq ft
129 ÷ 3 = around 43 chickens max`,

  costs: `Ways to reduce poultry farming costs:

- Buy feed in bulk
- Let chickens forage
- Use recycled coop materials
- Prevent diseases early
- Use natural lighting
- Sell excess eggs`,

  diseases: `Common chicken diseases:

- Coccidiosis
- Newcastle Disease
- Fowl Pox
- Infectious Bronchitis
- Parasites

Prevention:
Clean coop, vaccination, good ventilation, and regular health checks.`,

  cleaning: `Cleaning schedule:

Daily:
- Refresh water
- Remove droppings

Weekly:
- Replace dirty bedding
- Clean feeders

Monthly:
- Deep clean coop
- Disinfect equipment`,

  feed: `Best feed for layers:

- 16-18% protein layer feed
- Oyster shell for calcium
- Grit for digestion
- Clean water daily

Avoid chocolate, avocado, moldy food, and salty food.`,

  healthy: `Signs of a healthy chicken:

- Bright eyes
- Red comb and wattles
- Active behavior
- Good appetite
- Smooth feathers
- Normal droppings
- Regular egg laying`
};

function loadAIChat() {
  const chat = document.getElementById("chatMessages");
  if (!chat) return;

  chat.innerHTML = `
    <div class="chat-row">
      <div class="bot-avatar"><i data-lucide="bot"></i></div>
      <div>
        <div class="chat-bubble">
Hello! I'm your SmartCoop AI Assistant

I can help you with:
- Starting a poultry farm
- Breed recommendations
- Coop planning and capacity
- Health and disease management
- Feed and nutrition advice
- Cost optimization
- Best practices and tips

Click a suggested question below or ask me anything about poultry farming!
        </div>
        <div class="chat-time">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function getAIReply(message) {
  const text = message.toLowerCase();

  if (text.includes("start") || text.includes("backyard")) return aiResponses.start;
  if (text.includes("breed") || text.includes("egg production")) return aiResponses.breed;
  if (text.includes("capacity") || text.includes("calculate")) return aiResponses.capacity;
  if (text.includes("cost") || text.includes("reduce")) return aiResponses.costs;
  if (text.includes("disease") || text.includes("prevention")) return aiResponses.diseases;
  if (text.includes("clean")) return aiResponses.cleaning;
  if (text.includes("feed") || text.includes("layers")) return aiResponses.feed;
  if (text.includes("healthy") || text.includes("sign")) return aiResponses.healthy;

  return `Great question about "${message}".

For poultry farming, always check:
- Space and ventilation
- Clean water and feed
- Breed suitability
- Disease prevention
- Coop hygiene

Can you give me more details so I can suggest a better answer?`;
}

function askSuggested(question) {
  const input = document.getElementById("aiInput");
  if (!input) return;

  input.value = question;
  sendAIMessage();
}

function sendAIMessage() {
  const input = document.getElementById("aiInput");
  const chat = document.getElementById("chatMessages");

  if (!input || !chat || !input.value.trim()) return;

  const question = input.value.trim();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  chat.innerHTML += `
    <div class="chat-row user">
      <div>
        <div class="chat-bubble">${question}</div>
        <div class="chat-time">${time}</div>
      </div>
    </div>
  `;

  input.value = "";

  setTimeout(() => {
    chat.innerHTML += `
      <div class="chat-row">
        <div class="bot-avatar"><i data-lucide="bot"></i></div>
        <div>
          <div class="chat-bubble">${getAIReply(question)}</div>
          <div class="chat-time">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>
    `;

    chat.scrollTop = chat.scrollHeight;
    if (window.lucide) lucide.createIcons();
  }, 500);
}
function getReminderIcon(category) {
  if (category === "vaccination") return "💉";
  if (category === "feeding") return "🍽️";
  if (category === "health") return "💗";
  if (category === "weather") return "🌤️";
  return "📌";
}

function getDefaultAlerts() {
  return [
    {
      id: 1,
      title: "Vaccination Due",
      description: "Newcastle disease vaccination for Backyard Coop",
      category: "vaccination",
      priority: "high",
      date: "2026-04-08",
      time: "09:00",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Feed Stock Low",
      description: "Only 2 days of feed remaining for Main Coop",
      category: "feeding",
      priority: "medium",
      date: "2026-04-06",
      time: "14:00",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Health Check",
      description: "Monthly health inspection for all coops",
      category: "health",
      priority: "medium",
      date: "2026-04-10",
      time: "10:00",
      status: "upcoming"
    }
  ];
}

function getAlertsData() {
  const saved = JSON.parse(localStorage.getItem("smartcoop_alerts") || "null");
  return saved || getDefaultAlerts();
}

function saveAlertsData(alerts) {
  localStorage.setItem("smartcoop_alerts", JSON.stringify(alerts));
}

function loadAlertsPage() {
  const list = document.getElementById("alertsList");
  if (!list) return;

  const alerts = getAlertsData();

  setText("upcomingCount", alerts.filter(a => a.status === "upcoming").length);
  setText("alertBadge", alerts.filter(a => a.status === "upcoming").length);

  list.innerHTML = alerts.map(alert => `
    <div class="reminder-item">
      <div class="reminder-icon">${getReminderIcon(alert.category)}</div>

      <div class="reminder-main">
        <div class="reminder-top">
          <div>
            <h3>${alert.title}</h3>
            <p>${alert.description}</p>
          </div>

          <div>
            <span class="priority-tag ${alert.priority}">${alert.priority}</span>
            <span class="category-tag">${alert.category}</span>
          </div>
        </div>

        <div class="reminder-meta">
          <span>📅 ${alert.date}</span>
          <span>🕘 ${alert.time}</span>
        </div>

        <div class="reminder-actions">
          <button class="complete-btn" onclick="completeReminder(${alert.id})"><i data-lucide="check"></i><span>Mark Complete</span></button>
          <button class="delete-btn" onclick="deleteReminder(${alert.id})"><i data-lucide="trash-2"></i><span>Delete</span></button>
        </div>
      </div>
    </div>
  `).join("");
  if (window.lucide) lucide.createIcons();
}

function openReminderModal() {
  document.getElementById("reminderModal").classList.remove("hidden");
}

function closeReminderModal() {
  document.getElementById("reminderModal").classList.add("hidden");
}

function addReminder() {
  const title = document.getElementById("reminderTitle").value.trim();
  const description = document.getElementById("reminderDesc").value.trim();
  const category = document.getElementById("reminderCategory").value;
  const priority = document.getElementById("reminderPriority").value;
  const date = document.getElementById("reminderDate").value;
  const time = document.getElementById("reminderTime").value;

  if (!title || !date || !time) {
    alert("Please fill in title, date, and time.");
    return;
  }

  const alerts = getAlertsData();

  alerts.unshift({
    id: Date.now(),
    title,
    description,
    category,
    priority,
    date,
    time,
    status: "upcoming"
  });

  saveAlertsData(alerts);
  closeReminderModal();
  loadAlertsPage();
}

function completeReminder(id) {
  const alerts = getAlertsData().map(alert =>
    alert.id === id ? { ...alert, status: "completed" } : alert
  );

  saveAlertsData(alerts);
  loadAlertsPage();
}

function deleteReminder(id) {
  const alerts = getAlertsData().filter(alert => alert.id !== id);
  saveAlertsData(alerts);
  loadAlertsPage();
}

// Variable kung anong tab ang kasalukuyang nakabukas (Default: expenses)
let activeRecordTab = 'expenses'; 
let editId = null;
// --- BAGONG EDIT FUNCTION ---
function editRecord(id) {
  editId = id; // I-set ang ID na ie-edit natin
  openRecordModal(); // Buksan ang modal (Salamat sa logic sa itaas, automatic na may laman na ang form fields nito!)
}
// Kukuha ng data mula sa localStorage para hindi mabura kapag nag-refresh ka habang nagte-testing
let data = JSON.parse(localStorage.getItem('farmData')) || { 
  expenses: [], 
  eggs: [], 
  mortality: [], 
  chicken: [], 
  meat: [] 
};

// Helper function para sa pagpapakita ng text sa mga elements
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

// Function kapag pinindot ang mga tab buttons sa itaas
function switchRecordTab(tab) {
  activeRecordTab = tab;
  
  const tabs = document.querySelectorAll('.record-tabs button');
  tabs.forEach(btn => btn.classList.remove('active'));
  
  const clickedBtn = Array.from(tabs).find(btn => btn.getAttribute('onclick').includes(tab));
  if (clickedBtn) clickedBtn.classList.add('active');

  loadRecordsPage();
}

// Function para i-refresh at i-load ang tamang table base sa active tab
function loadRecordsPage() {
  if (activeRecordTab === 'expenses') {
    loadExpenseRecords(data);
  } else if (activeRecordTab === 'eggs') {
    loadEggRecords(data);
  } else if (activeRecordTab === 'mortality') {
    loadMortalityRecords(data);
  } else if (activeRecordTab === 'chicken') { 
    loadChickenRecords(data);
  } else if (activeRecordTab === 'meat') {    
    loadMeatRecords(data);
  }

  // Kung gumagamit ka ng Lucide icons, pilitin nitong i-render ang mga icons sa table buttons
  if (window.lucide) lucide.createIcons();
}

// --- 1. EXPENSES TAB ---
function loadExpenseRecords(data) {
  setText("recordPanelTitle", "Expense Records");
  setText("recordPanelSubtitle", "Track all farm-related expenses");
  document.getElementById("recordAddBtn").innerHTML = `<i data-lucide="plus"></i> Add Expense`;

  const searchInput = document.getElementById("recordSearchInput");
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const filterInput = document.getElementById("recordCategoryFilter");
  const category = filterInput ? filterInput.value : "all";

  if (filterInput) filterInput.style.display = "block";
  document.getElementById("recordTableHead").innerHTML = `
    <tr><th>Date</th><th>Coop</th><th>Category</th><th>Description</th><th>Amount</th><th>Actions</th></tr>
  `;

  const filtered = (data.expenses || []).filter(e =>
    (e.description || "").toLowerCase().includes(search) &&
    (category === "all" || e.category === category)
  );

  setText("runningTotal", `₱${filtered.reduce((s, e) => s + e.amount, 0).toLocaleString()}`);

  document.getElementById("recordTableBody").innerHTML = filtered.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.coop}</td>
      <td><span class="badge">${e.category}</span></td>
      <td>${e.description}</td>
      <td>₱${e.amount.toLocaleString()}</td>
      <td>
        <div class="table-actions">
          <button onclick="editRecord(${e.id})"><i data-lucide="edit"></i></button>
          <button class="delete" onclick="deleteRecord(${e.id})"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join("");
}

// --- 2. EGGS TAB ---
function loadEggRecords(data) {
  setText("recordPanelTitle", "Egg Collection Logs");
  setText("recordPanelSubtitle", "Track daily egg production");
  document.getElementById("recordAddBtn").innerHTML = `<i data-lucide="plus"></i> Add Egg Record`;
  if (document.getElementById("recordCategoryFilter")) document.getElementById("recordCategoryFilter").style.display = "none";

  document.getElementById("recordTableHead").innerHTML = `
    <tr><th>Date</th><th>Coop</th><th>Number of Eggs</th><th>Notes</th><th>Actions</th></tr>
  `;

  const dataRows = data.eggs || [];
  setText("runningTotal", `Total Eggs: ${dataRows.reduce((s, e) => s + e.eggs, 0).toLocaleString()}`);

  document.getElementById("recordTableBody").innerHTML = dataRows.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.coop}</td>
      <td>${e.eggs.toLocaleString()}</td>
      <td>${e.notes || "-"}</td>
      <td>
        <div class="table-actions">
          <button onclick="editRecord(${e.id})"><i data-lucide="edit"></i></button>
          <button class="delete" onclick="deleteRecord(${e.id})"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join("");
}

// --- 3. MORTALITY TAB ---
function loadMortalityRecords(data) {
  setText("recordPanelTitle", "Mortality Records");
  setText("recordPanelSubtitle", "Track chicken health and mortality");
  document.getElementById("recordAddBtn").innerHTML = `<i data-lucide="plus"></i> Add Mortality Record`;
  if (document.getElementById("recordCategoryFilter")) document.getElementById("recordCategoryFilter").style.display = "none";

  document.getElementById("recordTableHead").innerHTML = `
    <tr><th>Date</th><th>Coop</th><th>Deaths</th><th>Cause</th><th>Notes</th><th>Actions</th></tr>
  `;

  const dataRows = data.mortality || [];
  setText("runningTotal", `Total Deaths: ${dataRows.reduce((s, e) => s + e.deaths, 0)}`);

  document.getElementById("recordTableBody").innerHTML = dataRows.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.coop}</td>
      <td>${e.deaths}</td>
      <td><span class="badge">${e.cause}</span></td>
      <td>${e.notes || "-"}</td>
      <td>
        <div class="table-actions">
          <button onclick="editRecord(${e.id})"><i data-lucide="edit"></i></button>
          <button class="delete" onclick="deleteRecord(${e.id})"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join("");
}

// --- 4. CHICKEN TAB ---
function loadChickenRecords(data) {
  setText("recordPanelTitle", "Chicken Inventory Records");
  setText("recordPanelSubtitle", "Manage active chicken batches, stocks, and breeds");
  document.getElementById("recordAddBtn").innerHTML = `<i data-lucide="plus"></i> Add Chicken`;
  if (document.getElementById("recordCategoryFilter")) document.getElementById("recordCategoryFilter").style.display = "none";

  document.getElementById("recordTableHead").innerHTML = `
    <tr><th>Date</th><th>Coop</th><th>No. of Chicken/s</th><th>Stage</th><th>Days</th><th>Actions</th></tr>
  `;

  const dataRows = data.chicken || [];
  setText("runningTotal", `Total Active Chickens: ${dataRows.reduce((s, e) => s + e.quantity, 0).toLocaleString()} heads`);

  document.getElementById("recordTableBody").innerHTML = dataRows.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.coop}</td>
      <td>${e.quantity.toLocaleString()}</td>
      <td><span class="badge">${e.stage}</span></td>
      <td>${e.days} days</td>
      <td>
        <div class="table-actions">
          <button onclick="editRecord(${e.id})"><i data-lucide="edit"></i></button>
          <button class="delete" onclick="deleteRecord(${e.id})"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join("");
}

// --- 5. MEAT TAB ---
function loadMeatRecords(data) {
  setText("recordPanelTitle", "Meat Production Logs");
  setText("recordPanelSubtitle", "Track broiler harvests and total weight production");
  document.getElementById("recordAddBtn").innerHTML = `<i data-lucide="plus"></i> Add Meat Log`;
  if (document.getElementById("recordCategoryFilter")) document.getElementById("recordCategoryFilter").style.display = "none";

  document.getElementById("recordTableHead").innerHTML = `
    <tr><th>Harvest Date</th><th>Coop / Batch</th><th>Birds Harvested</th><th>Total Weight</th><th>Actions</th></tr>
  `;

  const dataRows = data.meat || [];
  setText("runningTotal", `Total Harvested: ${dataRows.reduce((s, e) => s + e.weight, 0).toLocaleString()} kg`);

  document.getElementById("recordTableBody").innerHTML = dataRows.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.coopOrBatch}</td>
      <td>${e.birdsCount || "-"} birds</td>
      <td><strong>${e.weight} kg</strong></td>
      <td>
        <div class="table-actions">
          <button onclick="editRecord(${e.id})"><i data-lucide="edit"></i></button>
          <button class="delete" onclick="deleteRecord(${e.id})"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join("");
}

// --- UPDATE SA OPEN MODAL (May dagdag na logic para mag-populate ng data kapag nag-e-edit) ---
function openRecordModal() {
  const modal = document.getElementById("recordModal");
  const modalTitle = document.getElementById("recordModalTitle");
  const formFields = document.getElementById("recordFormFields");

  modal.classList.remove("hidden");

  // Reusable Dropdown HTML para sa Coop 1-4
  const coopDropdownHTML = `
    <select id="commonCoop" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
      <option value="Coop 1">Coop 1</option>
      <option value="Coop 2">Coop 2</option>
      <option value="Coop 3">Coop 3</option>
      <option value="Coop 4">Coop 4</option>
    </select>
  `;

  // 1. I-render ang blangkong form base sa active tab
  if (activeRecordTab === 'expenses') {
    modalTitle.innerText = editId ? "Edit Expense" : "Add Expense";
    formFields.innerHTML = `
      <div class="form-group" style="margin-bottom:12px;"><label>Date</label><input type="date" id="expenseDate" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Coop</label>${coopDropdownHTML.replace('id="commonCoop"', 'id="expenseCoop"')}</div>
      <div class="form-group" style="margin-bottom:12px;"><label>Category</label><input type="text" id="expenseCategory" placeholder="e.g., Feeds" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Description</label><input type="text" id="expenseDesc" placeholder="Bought 2 sacks" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Amount</label><input type="number" id="expenseAmount" placeholder="0" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
    `;
  } 
  else if (activeRecordTab === 'eggs') {
    modalTitle.innerText = editId ? "Edit Egg Collection" : "Log Egg Collection";
    formFields.innerHTML = `
      <div class="form-group" style="margin-bottom:12px;"><label>Date</label><input type="date" id="eggDate" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Coop</label>${coopDropdownHTML.replace('id="commonCoop"', 'id="eggCoop"')}</div>
      <div class="form-group" style="margin-bottom:12px;"><label>Number of Eggs</label><input type="number" id="eggCount" placeholder="0" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Notes</label><input type="text" id="eggNotes" placeholder="Good quality" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
    `;
  } 
  else if (activeRecordTab === 'mortality') {
    modalTitle.innerText = editId ? "Edit Mortality Log" : "Log Mortality";
    formFields.innerHTML = `
      <div class="form-group" style="margin-bottom:12px;"><label>Date</label><input type="date" id="mortalityDate" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Coop</label>${coopDropdownHTML.replace('id="commonCoop"', 'id="mortalityCoop"')}</div>
      <div class="form-group" style="margin-bottom:12px;"><label>Deaths</label><input type="number" id="mortalityDeaths" placeholder="0" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Cause</label><input type="text" id="mortalityCause" placeholder="e.g., Heat stress" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Notes</label><input type="text" id="mortalityNotes" placeholder="Optional..." style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
    `;
  } 
  else if (activeRecordTab === 'chicken') {
    modalTitle.innerText = editId ? "Edit Chicken Batch" : "Add Chicken Batch";
    formFields.innerHTML = `
      <div class="form-group" style="margin-bottom:12px;"><label>Date</label><input type="date" id="chickenDate" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Coop</label>${coopDropdownHTML.replace('id="commonCoop"', 'id="chickenCoop"')}</div>
      <div class="form-group" style="margin-bottom:12px;"><label>No. of Chicken/s</label><input type="number" id="chickenQty" placeholder="0" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;">
        <label>Stage</label>
        <select id="chickenStage" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
          <option value="Chicks">Chicks</option>
          <option value="Grower">Grower</option>
          <option value="Layer">Layer</option>
          <option value="Broiler">Broiler</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:12px;"><label>Days</label><input type="number" id="chickenDays" placeholder="0" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
    `;
  } 
  else if (activeRecordTab === 'meat') {
    modalTitle.innerText = editId ? "Edit Meat Log" : "Add Meat Production Log";
    formFields.innerHTML = `
      <div class="form-group" style="margin-bottom:12px;"><label>Harvest Date</label><input type="date" id="meatDate" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Coop / Batch Reference</label>${coopDropdownHTML.replace('id="commonCoop"', 'id="meatCoop"')}</div>
      <div class="form-group" style="margin-bottom:12px;"><label>Birds Harvested (Count)</label><input type="number" id="meatBirdsCount" placeholder="0" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
      <div class="form-group" style="margin-bottom:12px;"><label>Total Weight (kg)</label><input type="number" step="0.01" id="meatWeight" placeholder="0.00" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>
    `;
  }

  // 2. Kung EDIT mode, hahanapin natin ang lumang data at awtomatikong isusulat sa mga inputs
  if (editId) {
    const currentList = data[activeRecordTab] || [];
    const recordToEdit = currentList.find(r => r.id === editId);

    if (recordToEdit) {
      if (activeRecordTab === 'expenses') {
        document.getElementById("expenseDate").value = recordToEdit.date;
        document.getElementById("expenseCoop").value = recordToEdit.coop;
        document.getElementById("expenseCategory").value = recordToEdit.category;
        document.getElementById("expenseDesc").value = recordToEdit.description;
        document.getElementById("expenseAmount").value = recordToEdit.amount;
      } else if (activeRecordTab === 'eggs') {
        document.getElementById("eggDate").value = recordToEdit.date;
        document.getElementById("eggCoop").value = recordToEdit.coop;
        document.getElementById("eggCount").value = recordToEdit.eggs;
        document.getElementById("eggNotes").value = recordToEdit.notes;
      } else if (activeRecordTab === 'mortality') {
        document.getElementById("mortalityDate").value = recordToEdit.date;
        document.getElementById("mortalityCoop").value = recordToEdit.coop;
        document.getElementById("mortalityDeaths").value = recordToEdit.deaths;
        document.getElementById("mortalityCause").value = recordToEdit.cause;
        document.getElementById("mortalityNotes").value = recordToEdit.notes;
      } else if (activeRecordTab === 'chicken') {
        document.getElementById("chickenDate").value = recordToEdit.date;
        document.getElementById("chickenCoop").value = recordToEdit.coop;
        document.getElementById("chickenQty").value = recordToEdit.quantity;
        document.getElementById("chickenStage").value = recordToEdit.stage;
        document.getElementById("chickenDays").value = recordToEdit.days;
      } else if (activeRecordTab === 'meat') {
        document.getElementById("meatDate").value = recordToEdit.date;
        document.getElementById("meatCoop").value = recordToEdit.coopOrBatch;
        document.getElementById("meatBirdsCount").value = recordToEdit.birdsCount;
        document.getElementById("meatWeight").value = recordToEdit.weight;
      }
    }
  }
}

// --- UPDATE SA CLOSE MODAL (Iri-reset si editId para bumalik sa Add mode sa susunod) ---
function closeRecordModal() {
  document.getElementById("recordModal").classList.add("hidden");
  editId = null; 
}

// --- UPDATE SA SAVE RECORD (Mag-aadd kung bago, mag-a-update naman kung ie-edit) ---
function saveRecord() {
  let recordData = {};

  // Kunin ang mga values galing sa form depende sa kung anong active tab
  if (activeRecordTab === 'expenses') {
    recordData = {
      date: document.getElementById("expenseDate").value,
      coop: document.getElementById("expenseCoop").value,
      category: document.getElementById("expenseCategory").value,
      description: document.getElementById("expenseDesc").value,
      amount: parseFloat(document.getElementById("expenseAmount").value) || 0
    };
  } 
  else if (activeRecordTab === 'eggs') {
    recordData = {
      date: document.getElementById("eggDate").value,
      coop: document.getElementById("eggCoop").value,
      eggs: parseInt(document.getElementById("eggCount").value) || 0,
      notes: document.getElementById("eggNotes").value
    };
  } 
  else if (activeRecordTab === 'mortality') {
    recordData = {
      date: document.getElementById("mortalityDate").value,
      coop: document.getElementById("mortalityCoop").value,
      deaths: parseInt(document.getElementById("mortalityDeaths").value) || 0,
      cause: document.getElementById("mortalityCause").value,
      notes: document.getElementById("mortalityNotes").value
    };
  } 
  else if (activeRecordTab === 'chicken') {
    recordData = {
      date: document.getElementById("chickenDate").value,
      coop: document.getElementById("chickenCoop").value,
      quantity: parseInt(document.getElementById("chickenQty").value) || 0,
      stage: document.getElementById("chickenStage").value,
      days: parseInt(document.getElementById("chickenDays").value) || 0
    };
  } 
  else if (activeRecordTab === 'meat') {
    recordData = {
      date: document.getElementById("meatDate").value,
      coopOrBatch: document.getElementById("meatCoop").value,
      birdsCount: parseInt(document.getElementById("meatBirdsCount").value) || 0,
      weight: parseFloat(document.getElementById("meatWeight").value) || 0
    };
  }

  // LOGIC PARA SA EDIT VS ADD NEW
  if (editId) {
    // KUNG EDIT: Hahanapin ang kaparehas na ID sa array at o-overwrite-an ang laman nito
    const index = data[activeRecordTab].findIndex(r => r.id === editId);
    if (index !== -1) {
      data[activeRecordTab][index] = { id: editId, ...recordData };
    }
  } else {
    // KUNG ADD NEW: Gagawa ng bagong natatanging ID gamit ang Date.now() at ipu-push sa listahan
    recordData.id = Date.now();
    if (!data[activeRecordTab]) data[activeRecordTab] = [];
    data[activeRecordTab].push(recordData);
  }

  // Isave ang binagong array sa LocalStorage
  localStorage.setItem('farmData', JSON.stringify(data));

  closeRecordModal();
  loadRecordsPage(); 
}

// --- DELETE RECORD (Para makapagbura ka kapag mali ang test values mo) ---
function deleteRecord(id) {
  if (confirm("Are you sure you want to delete this record?")) {
    if (activeRecordTab === 'expenses') data.expenses = data.expenses.filter(e => e.id !== id);
    else if (activeRecordTab === 'eggs') data.eggs = data.eggs.filter(e => e.id !== id);
    else if (activeRecordTab === 'mortality') data.mortality = data.mortality.filter(e => e.id !== id);
    else if (activeRecordTab === 'chicken') data.chicken = data.chicken.filter(e => e.id !== id);
    else if (activeRecordTab === 'meat') data.meat = data.meat.filter(e => e.id !== id);

    localStorage.setItem('farmData', JSON.stringify(data));
    loadRecordsPage();
  }
}

// Unang load ng system
document.addEventListener("DOMContentLoaded", () => {
  loadRecordsPage();
});
function loadReportsPage() {
  if (!document.getElementById("eggTrendChart")) return;

  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

  new Chart(document.getElementById("eggTrendChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Eggs Collected",
        data: [1700, 1780, 1850, 1870, 1890, 100],
        borderColor: "#10b981",
        backgroundColor: "transparent",
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });

  new Chart(document.getElementById("expenseChart"), {
    type: "pie",
    data: {
      labels: ["Feed", "Medicine", "Utilities", "Labor"],
      datasets: [{
        data: [71, 6, 4, 18],
        backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "right" } }
    }
  });

  new Chart(document.getElementById("feedChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [{
        label: "Feed (kg)",
        data: [420, 440, 455, 445, 455, 460],
        backgroundColor: "#3b82f6"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });

  new Chart(document.getElementById("costChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Total Cost (₱)",
        data: [14500, 15000, 15300, 15100, 15800, 19800],
        borderColor: "#f59e0b",
        backgroundColor: "transparent",
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

function exportReport(type) {
  alert(`Exporting report as ${type.toUpperCase()}...`);
}

function viewCoopReport(name) {
  alert(`${name} - Detailed Performance`);
}
function showSettingsTab(tabId, button) {
  document.querySelectorAll(".settings-tab").forEach(tab => {
    tab.classList.add("hidden");
  });

  const selectedTab = document.getElementById(tabId);
  if (selectedTab) selectedTab.classList.remove("hidden");

  document.querySelectorAll(".settings-tabs button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (button) button.classList.add("active");
}

function saveProfile() {
  const name = document.getElementById("settingsName")?.value || "";
  const email = document.getElementById("settingsEmail")?.value || "";
  const phone = document.getElementById("settingsPhone")?.value || "";

  const user = JSON.parse(localStorage.getItem(SMARTCOOP_USER_KEY) || localStorage.getItem("user") || "{}");

  user.name = name;
  user.email = email;
  user.phoneNumber = phone;
  user.avatar = name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  localStorage.setItem(SMARTCOOP_USER_KEY, JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));

  loadUserInfo();
  alert("Profile updated successfully!");
}

function saveFarmInfo() {
  const farmName = document.getElementById("settingsFarmName")?.value || "";
  const farmLocation = document.getElementById("settingsFarmLocation")?.value || "";
  const farmSize = document.getElementById("settingsFarmSize")?.value || "";

  const user = JSON.parse(localStorage.getItem(SMARTCOOP_USER_KEY) || localStorage.getItem("user") || "{}");

  user.farmName = farmName;
  user.farmLocation = farmLocation;
  user.farmSize = farmSize;

  localStorage.setItem(SMARTCOOP_USER_KEY, JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));

  loadUserInfo();
  alert("Farm information saved!");
}

function saveNotifications() {
  const notifications = {
    emailAlerts: document.getElementById("emailAlerts")?.checked || false,
    smsAlerts: document.getElementById("smsAlerts")?.checked || false,
    pushNotifications: document.getElementById("pushNotifications")?.checked || false,
    weeklyReports: document.getElementById("weeklyReports")?.checked || false,
    healthAlerts: document.getElementById("healthAlerts")?.checked || false,
    feedingReminders: document.getElementById("feedingReminders")?.checked || false
  };

  localStorage.setItem("smartcoop_notifications", JSON.stringify(notifications));
  alert("Notification preferences saved!");
}

function updatePassword() {
  const current = document.getElementById("currentPassword")?.value || "";
  const newPassword = document.getElementById("newPassword")?.value || "";
  const confirmPassword = document.getElementById("confirmPassword")?.value || "";

  if (!current || !newPassword || !confirmPassword) {
    alert("Please fill in all password fields.");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  localStorage.setItem("smartcoop_password", newPassword);

  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  alert("Password updated successfully!");
}

function loadSettingsPage() {
  const user = JSON.parse(localStorage.getItem(SMARTCOOP_USER_KEY) || localStorage.getItem("user") || "{}");

  if (document.getElementById("settingsName")) {
    document.getElementById("settingsName").value = user.name || "";
  }

  if (document.getElementById("settingsEmail")) {
    document.getElementById("settingsEmail").value = user.email || "";
  }

  if (document.getElementById("settingsPhone")) {
    document.getElementById("settingsPhone").value = user.phoneNumber || "";
  }

  if (document.getElementById("settingsFarmName")) {
    document.getElementById("settingsFarmName").value = user.farmName || "SmartCoop Farm";
  }

  if (document.getElementById("settingsFarmLocation")) {
    document.getElementById("settingsFarmLocation").value = user.farmLocation || "";
  }

  if (document.getElementById("settingsFarmSize")) {
    document.getElementById("settingsFarmSize").value = user.farmSize || "";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar nav a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("loginError");

  let user = null;


  if (email === "admin@smartcoop.com" && password === "admin") {
    user = {
      name: "Admin",
      email,
      role: "admin",
      status: "Active"
    };
  }

 
  else if (email === "farmer@smartcoop.com" && password === "password") {
    user = {
      name: "John Anderson",
      email,
      role: "user",
      status: "Active"
    };
  }

  if (!user) {
    errorBox.textContent = "Invalid email or password";
    errorBox.classList.remove("hidden");
    return;
  }

  // SAVE USER
  localStorage.setItem("user", JSON.stringify(user));


  let users = JSON.parse(localStorage.getItem("users") || "[]");

  const exists = users.find(u => u.email === user.email);
  if (!exists) {
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // REDIRECT
  if (user.role === "admin") {
    window.location.href = "admin-dashboard.html";
  } else {
    window.location.href = "user.html";
  }
});


function checkAdmin() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "admin") {
    alert("Access denied");
    window.location.href = "user.html";
  }
}



function deleteAdminUser(email) {
  if (!confirm("Delete this user?")) return;

  let users = getAdminUsers();
  users = users.filter(user => user.email !== email);

  saveAdminUsers(users);
  loadAdminDashboard();
  loadAdminUsersTable();
}

  if (window.lucide) lucide.createIcons();

function deleteAdminUser(email) {
  if (!confirm("Delete this user?")) return;

  let users = getAdminUsers();
  users = users.filter(user => user.email !== email);

  saveAdminUsers(users);
  loadAdminDashboard();
  loadAdminUsersTable();
}


function addUser() {
  const name = prompt("Enter name:");
  const email = prompt("Enter email:");

  if (!name || !email) return;

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  users.push({
    name,
    email,
    role: "user",
    status: "Active"
  });

  localStorage.setItem("users", JSON.stringify(users));

  loadAdminDashboard();
}
function checkAdmin() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "admin") {
    alert("Access denied");
    window.location.href = "user.html";
  }
}

function getAdminUsers() {
  const saved = JSON.parse(localStorage.getItem("admin_users") || "null");

  return saved || [
    { name: "John Doe", email: "johndoe@email.com", role: "Admin", status: "Active" },
    { name: "Juan Dela Cruz", email: "juan@email.com", role: "User", status: "Active" },
    { name: "David Lee", email: "david@email.com", role: "User", status: "Inactive" },
    { name: "Sarah Jones", email: "sarah@email.com", role: "User", status: "Active" }
  ];
}

function saveAdminUsers(users) {
  localStorage.setItem("admin_users", JSON.stringify(users));
}

function loadAdminDashboard() {
  const users = getAdminUsers();

  setText("adminTotalUsers", users.length);
  setText("adminActiveUsers", users.filter(user => user.status === "Active").length);

  loadAdminUsersTable();
  loadAdminCharts();

  if (window.lucide) lucide.createIcons();
}

function loadAdminUsersTable() {
  const table = document.getElementById("adminUsersTable");
  if (!table) return;

  const search = document.getElementById("adminSearchUser")?.value.toLowerCase() || "";
  const users = getAdminUsers().filter(user =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  );

  table.innerHTML = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <span class="admin-status ${user.status === "Inactive" ? "inactive" : ""}">
          ${user.status}
        </span>
      </td>
      <td>
        <button class="admin-edit-btn" onclick="editAdminUser('${user.email}')">
          <i data-lucide="edit"></i>
        </button>
      </td>
    </tr>
  `).join("");

  if (window.lucide) lucide.createIcons();
}

function addAdminUser() {
  const name = prompt("Enter user name:");
  if (!name) return;

  const email = prompt("Enter user email:");
  if (!email) return;

  const users = getAdminUsers();

  users.push({
    name,
    email,
    role: "User",
    status: "Active"
  });

  saveAdminUsers(users);
  loadAdminDashboard();
}

function editAdminUser(email) {
  const users = getAdminUsers();
  const user = users.find(u => u.email === email);
  if (!user) return;

  document.getElementById("editOriginalEmail").value = user.email;
  document.getElementById("editUserName").value = user.name;
  document.getElementById("editUserEmail").value = user.email;
  document.getElementById("editUserRole").value = user.role;
  document.getElementById("editUserStatus").value = user.status;

  document.getElementById("editUserModal").classList.remove("hidden");
}

function closeEditUserModal() {
  document.getElementById("editUserModal").classList.add("hidden");
}

function saveEditedUser() {
  const originalEmail = document.getElementById("editOriginalEmail").value;

  let users = getAdminUsers();

  users = users.map(user => {
    if (user.email === originalEmail) {
      return {
        name: document.getElementById("editUserName").value,
        email: document.getElementById("editUserEmail").value,
        role: document.getElementById("editUserRole").value,
        status: document.getElementById("editUserStatus").value
      };
    }

    return user;
  });

  saveAdminUsers(users);
  closeEditUserModal();
  loadAdminDashboard();
  loadAdminUsersTable();
}

function loadAdminCharts() {
  const userActivity = document.getElementById("adminUserActivityChart");
  const revenue = document.getElementById("adminRevenueChart");

  if (!userActivity || !revenue || !window.Chart) return;

  new Chart(userActivity, {
    type: "line",
    data: {
      labels: ["May 1", "May 8", "May 15", "May 22", "May 31"],
      datasets: [{
        label: "Users",
        data: [100, 200, 400, 600, 800],
        borderColor: "#2e7d32",
        backgroundColor: "#2e7d32",
        tension: 0.25,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  new Chart(revenue, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        label: "Revenue",
        data: [100000, 150000, 180000, 220000, 280000],
        borderColor: "#2e7d32",
        backgroundColor: "#2e7d32",
        tension: 0.25,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}
function loadAdminUsersTable() {
  const table = document.getElementById("adminUsersTable");
  if (!table) return;

  const search = document.getElementById("adminSearchUser")?.value.toLowerCase() || "";
  const statusFilter = document.getElementById("adminStatusFilter")?.value || "All";
  const roleFilter = document.getElementById("adminRoleFilter")?.value || "All";

  const users = getAdminUsers().filter(user => {
    const matchSearch =
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    const matchStatus = statusFilter === "All" || user.status === statusFilter;
    const matchRole = roleFilter === "All" || user.role === roleFilter;

    return matchSearch && matchStatus && matchRole;
  });

  table.innerHTML = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="admin-status ${user.status === "Inactive" ? "inactive" : ""}" onclick="editAdminUser('${user.email}')">
          ${user.status}
        </button>
      </td>
      <td>
        <div class="admin-users-actions">
          <button class="edit" onclick="editAdminUser('${user.email}')" title="Edit">
            <i data-lucide="square-pen"></i>
          </button>

          <button class="delete" onclick="deleteAdminUser('${user.email}')" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");

  if (window.lucide) lucide.createIcons();
}

function deleteAdminUser(email) {
  if (!confirm("Delete this user?")) return;

  let users = getAdminUsers();
  users = users.filter(user => user.email !== email);

  saveAdminUsers(users);
  loadAdminDashboard();
  loadAdminUsersTable();
}
function loadReports() {

  const progressCanvas = document.getElementById("userProgressChart");
  const revenueCanvas = document.getElementById("revenueChart");

  if (!progressCanvas || !revenueCanvas) return;

  new Chart(progressCanvas, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        data: [800, 900, 1050, 1150, 1250],
        backgroundColor: "#2e7d32"
      }]
    }
  });

  new Chart(revenueCanvas, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        data: [10000, 14000, 17000, 21000, 28000],
        borderColor: "#2e7d32",
        fill: false
      }]
    }
  });
}

function exportData(type) {
  alert("Exporting " + type);
}

function applyFilter() {
  alert("Filter Applied");
}
function setTopbarText() {
  const el = document.getElementById("topbarText");
  if (!el) return;

  const isAdmin = window.location.href.includes("admin");

  if (isAdmin) {
    // ADMIN → page title
    const path = window.location.pathname;

    if (path.includes("dashboard")) el.textContent = "Dashboard";
    else if (path.includes("users")) el.textContent = "Manage Users";
    else if (path.includes("reports")) el.textContent = "Reports & Analytics";
    else el.textContent = "Admin Panel";

  } else {
    // USER → system title (fixed)
    el.textContent = "Smart Poultry Planning and Management System";
  }
}
function setTopbarText() {
  const el = document.getElementById("topbarText");
  if (!el) return;

  const path = window.location.pathname;
  const isAdmin = path.includes("admin");

  if (isAdmin) {
    if (path.includes("dashboard")) el.textContent = "Dashboard";
    else if (path.includes("users")) el.textContent = "Manage Users";
    else if (path.includes("reports")) el.textContent = "Reports & Analytics";
    else el.textContent = "Admin Panel";
  } else {
    el.textContent = "Smart Poultry Planning and Management System";
  }
}
function setGreeting() {
  const el = document.getElementById("greetingText");
  if (!el) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const hour = new Date().getHours();
  let greeting = "Hello";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  el.textContent = `${greeting}, ${user.name || "User"}!`;
}

document.addEventListener("DOMContentLoaded", setGreeting);

document.addEventListener("DOMContentLoaded", setTopbarText);

setupCoopPlannerPage();
setupLoginPage();
setupSignupPage();
setupLandingPage();
loadPlans();

if (window.lucide) {
  lucide.createIcons();
}


// --- SMARTCOOP FEATURE POP-UP LOGIC ---

const featureInfo = {
    'coop': {
        title: '3D Coop Planner',
        desc: 'Experience our interactive 3D Decision Support tool. It helps you design your poultry house with precision, ensuring the right dimensions and housing density for a healthier flock.',
        img: 'img/1x1.png' 
    },
    'estimator': {
        title: 'Cost Estimator',
        desc: 'Avoid financial surprises. Our system automatically calculates the estimated budget for materials, bird stocks, and initial feed requirements based on your plan.',
        img: 'img/Cost Estimator.png'
    },
    'health': {
        title: 'AI Health Checker',
        desc: 'Keep your flock safe with AI-powered guidance. Input symptoms and receive instant preliminary health advice and management tips to prevent disease spread.',
        img: 'img/AI Health Checker.png'
    },
    'breed': {
        title: 'Breed Recommendation',
        desc: 'Not sure which chicken to raise? Our system suggests the best breeds based on your climate, available space, and production goals—whether for eggs or meat.',
        img: 'img/Breed Recommendation.png'
    },
    'reports': {
        title: 'Reports & Analytics',
        desc: 'Make data-driven decisions. Monitor your farm performance through visual reports on mortality rates, egg production, and overall expenses.',
        img: 'img/Reports.png'
    },
    'alerts': {
        title: 'Smart Alerts',
        desc: 'Stay on top of your farm tasks. Receive real-time reminders for feeding schedules, coop cleaning, and vital vaccination dates to ensure zero missed tasks.',
        img: 'img/Alerts.png'
    }
};

function showFeature(key) {
    const display = document.getElementById('feature-display');
    const title = document.getElementById('feat-title');
    const desc = document.getElementById('feat-desc');
    const img = document.getElementById('feat-img');

    if (featureInfo[key]) {
        title.innerText = featureInfo[key].title;
        desc.innerText = featureInfo[key].desc;
        img.src = featureInfo[key].img;

        display.style.display = 'flex'; 
        document.body.style.overflow = 'hidden';
    }
}

function closeFeature() {
    const display = document.getElementById('feature-display');
    display.style.display = 'none'; 
    document.body.style.overflow = 'auto';
}


window.onclick = function(event) {
    const display = document.getElementById('feature-display');
    if (event.target == display) {
        closeFeature();
    }
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    if (typeof lucide !== 'undefined') { lucide.createIcons(); }

    // SEARCH LOGIC (Opsyonal: Idagdag lang kung may search bar ka)
    const searchInput = document.getElementById('breedSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            let filter = searchInput.value.toLowerCase();
            let cards = document.querySelectorAll('.info-card');

            cards.forEach(card => {
                let title = card.querySelector('h2').innerText.toLowerCase();
                if (title.includes(filter)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
});

function toggleChickenView(viewType) {
    // I-tago lang ang buong container, huwag baguhin ang laman
    document.getElementById("mainChickenCards").classList.add("hidden");
    
    // Ipakita ang handout section
    const subView = document.getElementById("subViewSection");
    subView.classList.remove("hidden");

    const title = document.getElementById("viewSectionTitle");
    const subtitle = document.getElementById("viewSectionSubtitle");
    const thead = document.getElementById("chickenInfoTableHead");
    const tbody = document.getElementById("chickenInfoTableBody");

    // Clear contents lang ng table
    thead.innerHTML = "";
    tbody.innerHTML = "";

    if (viewType === 'breeds') {
        title.innerText = "Poultry Breeds Reference Guide";
        subtitle.innerText = "Information on egg volume, spacing, and daily feeding.";
        thead.innerHTML = `<tr><th>Breed</th><th>Space</th><th>Yield</th></tr>`;
        tbody.innerHTML = `<tr><td>Layers</td><td>2-3 sq.ft</td><td>250-300 eggs</td></tr>
                           <tr><td>Broilers</td><td>1.5-2 sq.ft</td><td>Harvest in 5-6 wks</td></tr>`;
    } else if (viewType === 'stages') {
        title.innerText = "Lifecycle & Production Stages";
        subtitle.innerText = "Management indicators based on maturity.";
        thead.innerHTML = `<tr><th>Stage</th><th>Target Age</th><th>Focus</th></tr>`;
        tbody.innerHTML = `<tr><td>Chicks</td><td>D1 - W4</td><td>Temp Control</td></tr>
                           <tr><td>Growers</td><td>W5 - W16</td><td>Developer Feed</td></tr>`;
    } else if (viewType === 'sanitation') {
        title.innerText = "Biosecurity & Cleaning Log";
        subtitle.innerText = "Standard checklist for disease control.";
        thead.innerHTML = `<tr><th>Task</th><th>Frequency</th><th>Importance</th></tr>`;
        tbody.innerHTML = `<tr><td>Feeder Wash</td><td>Daily</td><td>High</td></tr>
                           <tr><td>Disinfection</td><td>Per Batch</td><td>High</td></tr>`;
    }

    if (window.lucide) lucide.createIcons();
}

function goBackToCards() {
    // Ibalik ang main container
    document.getElementById("mainChickenCards").classList.remove("hidden");
    // Itago ang handout
    document.getElementById("subViewSection").classList.add("hidden");
}