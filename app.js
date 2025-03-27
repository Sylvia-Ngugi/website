 // script.js
 let isLoggedIn = false;
let hasAccount = false;

function showAuthSection(showLogin = false) {
    const authSection = document.getElementById('auth');
    authSection.style.display = 'block';
    
    if (showLogin) {
        showLoginForm();
    } else {
        // Show signup by default, or login if they have account
        hasAccount ? showLoginForm() : showSignupForm();
    }
}

function hideAuthSection() {
    document.getElementById('auth').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function checkLoginAndBook() {
    if (isLoggedIn) {
        window.location.href = "#Book Table";
    } else {
        showAuthSection();
        alert("Please log in or sign up to book a table.");
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check login status from storage
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    hasAccount = localStorage.getItem('hasAccount') === 'true';

    // Form toggle links
    document.getElementById('login-link').addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    document.getElementById('signup-link').addEventListener('click', function(e) {
        e.preventDefault();
        showSignupForm();
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        hideAuthSection();
        alert('Login successful!');
    });
    
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        hasAccount = true;
        localStorage.setItem('hasAccount', 'true');
        showLoginForm();
        alert('Signup successful! Please login.');
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        const authSection = document.getElementById('auth');
        if (authSection.style.display === 'block' && 
            !e.target.closest('.auth-container') && 
            !e.target.matches('[onclick*="showAuthSection"], [onclick*="checkLoginAndBook"]')) {
            hideAuthSection();
        }
    });
});

// ** Mobile Menu **
const bar = document.querySelector('.fa-bars');
const cross = document.querySelector('#hdcross');
const headerbar = document.querySelector('.headerbar');

if (bar && cross && headerbar) { // Check if elements exist
    bar.addEventListener('click', function() {
        setTimeout(() => {
            cross.style.display = 'block';
        }, 200);
        headerbar.style.right = '0%';
    });

    cross.addEventListener('click', function() {
        cross.style.display = 'none';
        headerbar.style.right = '-100%';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const bar = document.querySelector('.bar');
    const mainNav = document.querySelector('.main-nav');
    
    // Create close button for mobile
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&times;';
    closeBtn.classList.add('close-menu');
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 30px;
        cursor: pointer;
    `;
    mainNav.appendChild(closeBtn);
    
    // Toggle menu
    bar.addEventListener('click', function() {
        mainNav.classList.add('active');
    });
    
    closeBtn.addEventListener('click', function() {
        mainNav.classList.remove('active');
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
        });
    });
});

// ** Simulated Payment Functionality **
function processPayment(paymentMethod, amount, meal, paymentDetails) {
    let paymentInfo = "";
    switch (paymentMethod) {
        case "mpesa":
            paymentInfo = `M-Pesa Till Number: ${paymentDetails.mpesaTillNumber}`;
            break;
        case "bank_transfer":
            paymentInfo = `Card Number: ${paymentDetails.cardNumber}, Expiry: ${paymentDetails.expiryDate}, CVV: ${paymentDetails.cvv}`;
            break;
        case "paypal":
            paymentInfo = `PayPal Email: ${paymentDetails.paypalEmail}`;
            break;
    }
    alert(`Simulating payment of KES ${amount} for ${meal} via ${paymentMethod}.  ${paymentInfo} Payment Successful!`);
    // ** In a real application: **
    // 1. You'd send the payment details to your server.
    // 2. Your server would interact with a payment gateway (Stripe, PayPal, M-Pesa API).
    // 3.  Handle success/failure responses.
}

//**Function for Validating card details
function validateCardNumber(number) {
   var regex = new RegExp("^[0-9]{16}$");
   if (!regex.test(number))
       return false;

   return luhnCheck(number);
}

function luhnCheck(val) {
   var sum = 0;
   for (var i = 0; i < val.length; i++) {
       var intVal = parseInt(val.substr(i, 1));
       if (i % 2 == 0) {
           intVal *= 2;
           if (intVal > 9) {
               intVal = 1 + (intVal % 10);
           }
       }
       sum += intVal;
   }
   return (sum % 10) == 0;
}

//** Function for validating date expiring
function validateExpDate() {
   var month = document.getElementById("expiryDate").value;
   if (month == '' || month.length != 5 || month.indexOf('/') != 2)
       return false;
       
   var m = parseInt(month.substring(0, 2));
   var y = parseInt(month.substring(3, 5));
   if (isNaN(m) || m < 1 || m > 12)
       return false;
       
   var d = new Date();
   var thisMonth = d.getMonth() + 1;
   var thisYear = d.getFullYear().toString().substring(2, 4);
   
   if (y < thisYear || (y == thisYear && m < thisMonth))
       return false;
       
   return true;
}
//** Function for validating email address**
function validateEmail(){
   var email= document.getElementById("paypalEmail").value
   var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   if(email.match(mailformat)){
       return true;
   }
   else{
       return false;
   }
}

// ** Payment Button Event Listener **
document.addEventListener('DOMContentLoaded', function() { // Ensure DOM is loaded

    const payButton = document.getElementById('payButton');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const mpesaFields = document.getElementById('mpesaFields');
    const bankTransferFields = document.getElementById('bankTransferFields');
    const paypalFields = document.getElementById('paypalFields');

    function showPaymentFields(method) {
        mpesaFields.style.display = (method === 'mpesa') ? 'block' : 'none';
        bankTransferFields.style.display = (method === 'bank_transfer') ? 'block' : 'none';
        paypalFields.style.display = (method === 'paypal') ? 'block' : 'none';
    }

    // Initial visibility
    showPaymentFields(paymentMethodSelect.value);

    // Update visibility on change
    paymentMethodSelect.addEventListener('change', function() {
        showPaymentFields(this.value);
    });


    if (payButton) {
        payButton.addEventListener('click', function() {
            const amount = document.getElementById('amount').value;
            const paymentMethod = paymentMethodSelect.value;
            const meal = document.getElementById('meal').value;

            let paymentDetails = {};
            switch (paymentMethod) {
                case "mpesa":
                    paymentDetails.mpesaTillNumber = document.getElementById('mpesaTillNumber').value;
                    if (!paymentDetails.mpesaTillNumber) {
                        alert("Please enter M-Pesa Till Number.");
                        return;
                    }
                    break;
                case "bank_transfer":
                   var validCard = validateCardNumber(document.getElementById("cardNumber").value);
                   var validExpDate = validateExpDate();
                   if (!validCard) {
                       alert("Please enter a valid card number");
                       return;
                   }
                   if (!validExpDate){
                       alert("Please enter a valid expiry date")
                       return
                   }
                    paymentDetails.cardNumber = document.getElementById('cardNumber').value;
                    paymentDetails.expiryDate = document.getElementById('expiryDate').value;
                    paymentDetails.cvv = document.getElementById('cvv').value;
                    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
                        alert("Please enter all card details.");
                        return;
                    }
                    break;
                case "paypal":
                    paymentDetails.paypalEmail = document.getElementById('paypalEmail').value;
                    if (!paymentDetails.paypalEmail || !validateEmail()) {
                        alert("Please enter valid PayPal Email.");
                        return;
                    }
                    break;
            }

            if (amount && paymentMethod && meal) {
                processPayment(paymentMethod, amount, meal, paymentDetails);
            } else {
                alert("Please fill in all payment details.");
            }
        });
    }
});
