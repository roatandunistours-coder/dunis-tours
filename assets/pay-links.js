/* Change this one string when a paypal.me link is ready. */
var PAYPAL_PAY_URL = "https://wa.me/50497754724?text=Hi%2C%20I%27d%20like%20to%20pay%20my%20deposit%20by%20PayPal";

var paypalLinks = document.querySelectorAll("[data-pay='paypal']");
for (var i = 0; i < paypalLinks.length; i++) paypalLinks[i].href = PAYPAL_PAY_URL;
