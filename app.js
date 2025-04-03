

// Handle Mobile Navigation Menu
document.addEventListener('DOMContentLoaded', function () {
    const bar = document.querySelector('.fa-bars');
    const cross = document.querySelector('#hdcross');
    const headerbar = document.querySelector('.headerbar');

    if (bar && cross && headerbar) {
        bar.addEventListener('click', function () {
            setTimeout(() => {
                cross.style.display = 'block';
            }, 200);
            headerbar.style.right = '0%';
        });

        cross.addEventListener('click', function () {
            cross.style.display = 'none';
            headerbar.style.right = '-100%';
        });
    }
});

// Handle Payment Processing
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
    alert(`Simulating payment of KES ${amount} for ${meal} via ${paymentMethod}. ${paymentInfo} Payment Successful!`);
}

// Validate Card Number (Luhn Algorithm)
function validateCardNumber(number) {
    let sum = 0;
    let alternate = false;
    for (let i = number.length - 1; i >= 0; i--) {
        let n = parseInt(number[i], 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }
    return (sum % 10 === 0);
}

// Validate Expiry Date
function validateExpDate(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    let [month, year] = expiry.split('/').map(Number);
    let currentYear = new Date().getFullYear() % 100;
    let currentMonth = new Date().getMonth() + 1;
    return year > currentYear || (year === currentYear && month >= currentMonth);
}

// Validate Email
function validateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

// Payment Event Listener
document.addEventListener('DOMContentLoaded', function () {
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

    showPaymentFields(paymentMethodSelect.value);
    paymentMethodSelect.addEventListener('change', function () {
        showPaymentFields(this.value);
    });

    if (payButton) {
        payButton.addEventListener('click', function () {
            const amount = document.getElementById('amount').value;
            const meal = document.getElementById('meal').value;
            const paymentMethod = paymentMethodSelect.value;
            let paymentDetails = {};

            if (paymentMethod === "mpesa") {
                paymentDetails.mpesaTillNumber = document.getElementById('mpesaTillNumber').value;
                if (!paymentDetails.mpesaTillNumber) return alert("Please enter M-Pesa Till Number.");
            }

            if (paymentMethod === "bank_transfer") {
                paymentDetails.cardNumber = document.getElementById('cardNumber').value;
                paymentDetails.expiryDate = document.getElementById('expiryDate').value;
                paymentDetails.cvv = document.getElementById('cvv').value;

                if (!validateCardNumber(paymentDetails.cardNumber)) return alert("Invalid card number.");
                if (!validateExpDate(paymentDetails.expiryDate)) return alert("Invalid expiry date.");
                if (!paymentDetails.cvv) return alert("CVV is required.");
            }

            if (paymentMethod === "paypal") {
                paymentDetails.paypalEmail = document.getElementById('paypalEmail').value;
                if (!validateEmail(paymentDetails.paypalEmail)) return alert("Invalid PayPal email.");
            }

            if (amount && meal) {
                processPayment(paymentMethod, amount, meal, paymentDetails);
            } else {
                alert("Please fill in all payment details.");
            }
        });
    }
});
