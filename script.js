/* ==========================================================
   Iqra University - Login & Registration
   All interactive logic. Uses Bootstrap 5's JS (modals, toasts)
   where available, plus plain validation/localStorage logic.
   ========================================================== */
(function () {
  "use strict";

  var USERS_KEY = "iqraUsers";
  var REMEMBER_KEY = "iqraRememberedUser";
  var COURSES = ["Computer Science", "Artificial Intelligence", "Software Engineering", "Human Computer Interaction", "Data Science", "Cybersecurity", "Web Development"];

  /* ---------- tiny helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- fake database (localStorage) ---------- */
  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; }
  }
  function saveUsers(list) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (e) { /* demo still works for this session */ }
  }
  function seedDemoUser() {
    var users = loadUsers();
    if (!users.some(function (u) { return u.username === "ahmed_testing"; })) {
      users.push({
        fullName: "Muhammad Ahmed",
        email: "ahmed.testing@example.edu",
        username: "ahmed_testing",
        password: "Demo@1234",
        courses: ["Computer Science"]
      });
      saveUsers(users);
    }
  }
  seedDemoUser();

  /* ---------- toasts (Bootstrap) ---------- */
  var toastRegion = $("toastRegion");
  function toast(message, type, title) {
    type = type || "primary";
    var el = document.createElement("div");
    el.className = "toast align-items-center border-0 mb-2";
    el.setAttribute("role", "alert");
    el.innerHTML =
      '<div class="d-flex">' +
        '<div class="toast-body">' + (title ? "<strong>" + title + "</strong><br>" : "") + message + "</div>" +
        '<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
      "</div>";
    el.classList.add(
      type === "success" ? "text-bg-success" :
      type === "error" ? "text-bg-danger" : "text-bg-primary"
    );
    toastRegion.appendChild(el);
    var bsToast = new bootstrap.Toast(el, { delay: 4200 });
    bsToast.show();
    el.addEventListener("hidden.bs.toast", function () { el.remove(); });
  }

  /* ---------- field error helpers (Bootstrap's is-invalid / invalid-feedback) ---------- */
  function setFieldError(inputId, message) {
    var input = $(inputId);
    var err = $(inputId + "-error");
    if (input) { input.classList.add("is-invalid"); }
    if (err) { err.textContent = message; err.classList.remove("d-none"); err.classList.add("d-block"); }
  }
  function clearFieldError(inputId) {
    var input = $(inputId);
    var err = $(inputId + "-error");
    if (input) { input.classList.remove("is-invalid"); }
    if (err) { err.classList.add("d-none"); err.classList.remove("d-block"); }
  }
  function clearAllErrors(ids) { ids.forEach(clearFieldError); }

  /* ---------- password show/hide (icon button, no "Show"/"Hide" text) ---------- */
  var EYE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>';
  var EYE_OFF_ICON =
    '<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a14.6 14.6 0 0 1-3.4 4.2M6.6 6.6C3.7 8.5 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  qsa("[data-toggle-for]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = $(btn.getAttribute("data-toggle-for"));
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show ? EYE_OFF_ICON : EYE_ICON;
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* ---------- router: #login / #register / #notes ---------- */
  var authShell = $("authShell");
  var notesView = $("view-notes");
  function setView(name) {
    if (name !== "login" && name !== "register" && name !== "notes") { name = "login"; }
    if (name === "notes") {
      authShell.classList.add("d-none");
      notesView.classList.add("active");
    } else {
      authShell.classList.remove("d-none");
      notesView.classList.remove("active");
      qsa(".auth-view", authShell).forEach(function (v) { v.classList.remove("active"); });
      $("view-" + name).classList.add("active");
    }
    window.scrollTo(0, 0);
  }
  function routeFromHash() {
    var h = (location.hash || "#login").replace("#", "");
    setView(h);
  }
  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();

  /* ---------- course selection chips ---------- */
  var chipGroup = $("courseChips");
  var selectedCourses = [];
  COURSES.forEach(function (course, i) {
    var id = "course-" + i;
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<input type="checkbox" class="btn-check" id="' + id + '" autocomplete="off">' +
      '<label class="btn btn-outline-primary btn-sm course-chip-label" for="' + id + '">' + course + "</label>";
    var checkbox = wrap.querySelector("input");
    var label = wrap.querySelector("label");
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        selectedCourses.push(course);
        clearFieldError("reg-course");
      } else {
        selectedCourses = selectedCourses.filter(function (c) { return c !== course; });
      }
    });
    chipGroup.appendChild(checkbox);
    chipGroup.appendChild(label);
  });

  /* ---------- password strength ---------- */
  var regPassword = $("reg-password");
  function checkStrength(value) {
    var rules = {
      len: value.length >= 8,
      caseMix: /[a-z]/.test(value) && /[A-Z]/.test(value),
      num: /[0-9]/.test(value)
    };
    var score = (rules.len ? 1 : 0) + (rules.caseMix ? 1 : 0) + (rules.num ? 1 : 0);

    qs('[data-rule="len"]').classList.toggle("met", rules.len);
    qs('[data-rule="case"]').classList.toggle("met", rules.caseMix);
    qs('[data-rule="num"]').classList.toggle("met", rules.num);

    var bar = $("pwStrengthBar");
    var pct = (score / 3) * 100;
    bar.style.width = pct + "%";
    bar.className = "progress-bar " + (score <= 1 ? "bg-danger" : score === 2 ? "bg-warning" : "bg-success");

    $("strengthLabel").textContent = value.length === 0 ? "Password strength" : (score <= 1 ? "Weak" : score === 2 ? "Fair" : "Strong");
    return rules.len && rules.caseMix && rules.num;
  }
  regPassword.addEventListener("input", function () { checkStrength(regPassword.value); });

  /* ---------- plain format checks ---------- */
  function isStrongPassword(value) {
    return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value);
  }
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  function isValidUsername(value) {
    return /^[A-Za-z][A-Za-z0-9_]{3,19}$/.test(value);
  }
  function isValidName(value) {
    return value.trim().length >= 2 && /^[A-Za-z\s'-]+$/.test(value);
  }

  /* ---------- shared field validators ----------
     Used BOTH while typing (so an error can appear right away)
     AND again on submit (so an untouched empty field is still caught). */
  function validateRegFullName() {
    var v = $("reg-fullname").value.trim();
    if (!v) return { ok: false, msg: "Please enter your full name." };
    if (!isValidName(v)) return { ok: false, msg: "Use letters, spaces or hyphens only." };
    return { ok: true };
  }
  function validateRegEmail() {
    var v = $("reg-email").value.trim();
    if (!v) return { ok: false, msg: "Please enter your email address." };
    if (!isValidEmail(v)) return { ok: false, msg: "Enter a valid email, like name@example.com." };
    var users = loadUsers();
    if (users.some(function (u) { return u.email.toLowerCase() === v.toLowerCase(); })) {
      return { ok: false, msg: "An account with this email already exists. Try logging in instead." };
    }
    return { ok: true };
  }
  function validateRegUsername() {
    var v = $("reg-username").value.trim();
    if (!v) return { ok: false, msg: "Choose a username." };
    if (!isValidUsername(v)) return { ok: false, msg: "4-20 characters: start with a letter, then letters, numbers or underscores." };
    var users = loadUsers();
    if (users.some(function (u) { return u.username.toLowerCase() === v.toLowerCase(); })) {
      return { ok: false, msg: "That username is taken. Try another." };
    }
    return { ok: true };
  }
  function validateRegPassword() {
    var v = $("reg-password").value;
    if (!v) return { ok: false, msg: "Create a password." };
    if (!isStrongPassword(v)) return { ok: false, msg: "Use 8+ characters with upper, lowercase and a number." };
    return { ok: true };
  }
  function validateRegConfirm() {
    var v = $("reg-confirm").value;
    if (!v) return { ok: false, msg: "Confirm your password." };
    if (v !== $("reg-password").value) return { ok: false, msg: "Passwords don't match." };
    return { ok: true };
  }
  function validateLoginIdentifier() {
    var v = $("login-identifier").value.trim();
    if (!v) return { ok: false, msg: "Enter your username or email." };
    return { ok: true };
  }
  function validateLoginPassword() {
    var v = $("login-password").value;
    if (!v) return { ok: false, msg: "Enter your password." };
    return { ok: true };
  }
  function validateForgotEmail() {
    var v = $("forgot-email").value.trim();
    if (!v) return { ok: false, msg: "Please enter your email address." };
    if (!isValidEmail(v)) return { ok: false, msg: "Enter a valid email address." };
    return { ok: true };
  }

  function runValidator(inputId, validatorFn) {
    var result = validatorFn();
    if (result.ok) { clearFieldError(inputId); } else { setFieldError(inputId, result.msg); }
    return result.ok;
  }
  function wireLiveValidation(inputId, validatorFn) {
    var input = $(inputId);
    if (!input) return;
    input.addEventListener("input", function () { runValidator(inputId, validatorFn); });
  }

  wireLiveValidation("reg-fullname", validateRegFullName);
  wireLiveValidation("reg-email", validateRegEmail);
  wireLiveValidation("reg-username", validateRegUsername);
  wireLiveValidation("reg-password", validateRegPassword);
  wireLiveValidation("reg-confirm", validateRegConfirm);
  wireLiveValidation("login-identifier", validateLoginIdentifier);
  wireLiveValidation("login-password", validateLoginPassword);
  wireLiveValidation("forgot-email", validateForgotEmail);

  regPassword.addEventListener("input", function () {
    if ($("reg-confirm").value) { runValidator("reg-confirm", validateRegConfirm); }
  });

  /* ---------- registration ---------- */
  var registerForm = $("registerForm");
  var registerSubmit = $("registerSubmit");
  var registerIds = ["reg-fullname", "reg-email", "reg-username", "reg-password", "reg-confirm", "reg-course"];
  var lastRegisteredUsername = "";

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors(registerIds);
    $("registerSuccessBanner").classList.add("d-none");

    var fullName = $("reg-fullname").value.trim();
    var email = $("reg-email").value.trim();
    var username = $("reg-username").value.trim();
    var password = $("reg-password").value;

    var valid = true;
    var users = loadUsers();

    if (!runValidator("reg-fullname", validateRegFullName)) valid = false;
    if (!runValidator("reg-email", validateRegEmail)) valid = false;
    if (!runValidator("reg-username", validateRegUsername)) valid = false;
    if (!runValidator("reg-password", validateRegPassword)) valid = false;
    if (!runValidator("reg-confirm", validateRegConfirm)) valid = false;

    if (selectedCourses.length === 0) { setFieldError("reg-course", "Pick at least one course to continue."); valid = false; }

    if (!valid) {
      toast("Check the highlighted fields and try again.", "error", "Couldn't create your account");
      return;
    }

    registerSubmit.disabled = true;
    registerSubmit.querySelector(".btn-label").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating your account…';

    setTimeout(function () {
      users.push({ fullName: fullName, email: email, username: username, password: password, courses: selectedCourses.slice() });
      saveUsers(users);
      lastRegisteredUsername = username;

      registerSubmit.disabled = false;
      registerSubmit.querySelector(".btn-label").textContent = "Create account";

      $("registerSuccessText").textContent = "Welcome, " + fullName.split(" ")[0] + " — your account is ready.";
      $("registerSuccessBanner").classList.remove("d-none");
      toast("Your account was created successfully.", "success", "Account created");

      registerForm.reset();
      selectedCourses = [];
      qsa(".btn-check", chipGroup).forEach(function (c) { c.checked = false; });
      checkStrength("");
    }, 700);
  });

  $("continueToLogin").addEventListener("click", function () {
    $("registerSuccessBanner").classList.add("d-none");
    location.hash = "#login";
    if (lastRegisteredUsername) { $("login-identifier").value = lastRegisteredUsername; }
  });

  /* ---------- login ---------- */
  var loginForm = $("loginForm");
  var loginSubmit = $("loginSubmit");
  var loginIds = ["login-identifier", "login-password"];

  (function prefillRemembered() {
    try {
      var remembered = localStorage.getItem(REMEMBER_KEY);
      if (remembered) { $("login-identifier").value = remembered; $("login-remember").checked = true; }
    } catch (e) {}
  })();

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors(loginIds);
    $("loginBanner").classList.add("d-none");

    var identifier = $("login-identifier").value.trim();
    var password = $("login-password").value;
    var valid = true;

    if (!runValidator("login-identifier", validateLoginIdentifier)) valid = false;
    if (!runValidator("login-password", validateLoginPassword)) valid = false;
    if (!valid) { return; }

    loginSubmit.disabled = true;
    loginSubmit.querySelector(".btn-label").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in…';

    setTimeout(function () {
      var users = loadUsers();
      var match = users.find(function (u) {
        return u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase();
      });

      loginSubmit.disabled = false;
      loginSubmit.querySelector(".btn-label").textContent = "Log in";

      if (!match) {
        setFieldError("login-identifier", "We couldn't find an account with that username or email.");
        toast("No matching account was found.", "error", "Login failed");
        return;
      }
      if (match.password !== password) {
        setFieldError("login-password", "That password doesn't match. Try again or reset it.");
        toast("Incorrect password.", "error", "Login failed");
        return;
      }

      try {
        if ($("login-remember").checked) { localStorage.setItem(REMEMBER_KEY, match.username); }
        else { localStorage.removeItem(REMEMBER_KEY); }
      } catch (err) {}

      toast("Welcome back, " + match.fullName.split(" ")[0] + ".", "success", "Signed in");

      $("loginFormWrap").classList.add("d-none");
      $("welcomeName").textContent = "Welcome back, " + match.fullName.split(" ")[0] + "!";
      $("welcomeCourses").innerHTML = match.courses.map(function (c) {
        return '<span class="badge rounded-pill badge-eyebrow">' + c + "</span>";
      }).join("");
      $("welcomePanel").classList.remove("d-none");
    }, 700);
  });

  $("logoutBtn").addEventListener("click", function () {
    $("welcomePanel").classList.add("d-none");
    $("loginFormWrap").classList.remove("d-none");
    loginForm.reset();
    toast("You've been signed out.", "info", "Signed out");
    try {
      var remembered = localStorage.getItem(REMEMBER_KEY);
      if (remembered) { $("login-identifier").value = remembered; $("login-remember").checked = true; }
    } catch (e) {}
  });

  /* ---------- forgot password modal ---------- */
  var forgotModalEl = $("forgotModal");
  forgotModalEl.addEventListener("show.bs.modal", function () {
    $("forgotSuccess").classList.add("d-none");
    clearFieldError("forgot-email");
    $("forgot-email").value = "";
  });

  $("forgotSubmit").addEventListener("click", function () {
    $("forgotSuccess").classList.add("d-none");
    if (!runValidator("forgot-email", validateForgotEmail)) return;

    var btn = $("forgotSubmit");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = "Send reset instructions";
      $("forgotSuccess").classList.remove("d-none");
      toast("If that account exists, reset instructions would be sent.", "info", "Request received");
    }, 600);
  });
})();
