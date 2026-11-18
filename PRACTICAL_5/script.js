const form = document.getElementById("registrationForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const dob = document.getElementById("dob");
const bloodGroup = document.getElementById("bloodGroup");
const address = document.getElementById("address");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const documentFile = document.getElementById("document");
const terms = document.getElementById("terms");
const showPassword = document.getElementById("showPassword");
const strengthText = document.getElementById("passwordStrength");

const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const mobileRegex = /^[6-9]\d{9}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

// Shows a message under a field
function setError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(function (error) {
    error.textContent = "";
  });

  document.getElementById("successMessage").textContent = "";
}

// Mobile number: allow digits only while typing
mobile.addEventListener("input", function () {
  mobile.value = mobile.value.replace(/\D/g, "");
});

// Show / hide both password fields
showPassword.addEventListener("change", function () {
  const type = showPassword.checked ? "text" : "password";
  password.type = type;
  confirmPassword.type = type;
});

// Password strength meter
password.addEventListener("input", function () {
  const value = password.value;

  if (value.length === 0) {
    strengthText.textContent = "";
    return;
  }

  let strength = 0;

  if (value.length >= 8) strength++;
  if (/[a-z]/.test(value)) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/\d/.test(value)) strength++;
  if (/[@$!%*?&]/.test(value)) strength++;

  if (strength <= 2) {
    strengthText.textContent = "Password Strength: Weak";
    strengthText.style.color = "#d32f2f";
  } else if (strength <= 4) {
    strengthText.textContent = "Password Strength: Medium";
    strengthText.style.color = "#e68a00";
  } else {
    strengthText.textContent = "Password Strength: Strong";
    strengthText.style.color = "#0f7a3d";
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  let isValid = true;
  fullName.value = fullName.value.trim();
  email.value = email.value.trim();
  mobile.value = mobile.value.trim();
  address.value = address.value.trim();

  // Full name
  if (fullName.value === "") {
    setError("nameError", "Full name is required.");
    isValid = false;
  } else if (!nameRegex.test(fullName.value)) {
    setError("nameError", "Name should contain only letters and single spaces.");
    isValid = false;
  }

  // Email
  if (email.value === "") {
    setError("emailError", "Email address is required.");
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    setError("emailError", "Please enter a valid email address.");
    isValid = false;
  }

  // Mobile
  if (mobile.value === "") {
    setError("mobileError", "Mobile number is required.");
    isValid = false;
  } else if (!mobileRegex.test(mobile.value)) {
    setError("mobileError", "Enter a valid 10-digit Indian mobile number.");
    isValid = false;
  }

  // Date of birth
  if (dob.value === "") {
    setError("dobError", "Date of birth is required.");
    isValid = false;
  } else if (new Date(dob.value) > new Date()) {
    setError("dobError", "Date of birth cannot be in the future.");
    isValid = false;
  }

  // Gender
  if (!document.querySelector('input[name="gender"]:checked')) {
    setError("genderError", "Please select your gender.");
    isValid = false;
  }

  // Blood group
  if (bloodGroup.value === "") {
    setError("bloodError", "Please select your blood group.");
    isValid = false;
  }

  // Address
  if (address.value === "") {
    setError("addressError", "Address is required.");
    isValid = false;
  } else if (address.value.length < 10) {
    setError("addressError", "Address must contain at least 10 characters.");
    isValid = false;
  }

  // Password
  if (password.value === "") {
    setError("passwordError", "Password is required.");
    isValid = false;
  } else if (!passwordRegex.test(password.value)) {
    setError(
      "passwordError",
      "Password must contain 8-30 characters, including uppercase, lowercase, number and special character."
    );
    isValid = false;
  }

  // Confirm password
  if (confirmPassword.value === "") {
    setError("confirmPasswordError", "Please confirm your password.");
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    setError("confirmPasswordError", "Passwords do not match.");
    isValid = false;
  }

  // ID proof (optional)
  if (documentFile.files.length > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const selectedFile = documentFile.files[0];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("fileError", "Only JPG, PNG, and PDF files are allowed.");
      isValid = false;
    } else if (selectedFile.size > 5 * 1024 * 1024) {
      setError("fileError", "File size must not exceed 5 MB.");
      isValid = false;
    }
  }

  // Terms
  if (!terms.checked) {
    setError("termsError", "You must confirm the information before registration.");
    isValid = false;
  }

  // All good
  if (isValid) {
    const patientName = fullName.value;
    form.reset();
    strengthText.textContent = "";
    password.type = "password";
    confirmPassword.type = "password";
    document.getElementById("successMessage").textContent =
      "Thank you, " + patientName + "! Patient registration completed successfully.";
  }
});