const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');

const app = express();
const port = 3000;

const accountSid = 'AC9a8cbf151e473a3b6f795591d14c8e3f';  // Your Twilio Account SID
const authToken = '107f22f45d7f5861add1f729db53a709';  // Your Twilio Auth Token
const client = twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like HTML, CSS, JS
app.use(express.static('public'));

// Endpoint to handle form submission
app.post('/send-whatsapp', (req, res) => {
    const { name, address, item, phone } = req.body;

    const message = `New delivery request:
    Name: ${name}
    Address: ${address}
    Item to deliver: ${item}
    Phone: ${phone}`;

    client.messages
        .create({
            from: 'whatsapp:+14155238886',  // Twilio WhatsApp sandbox number
            body: message,
            to: 'whatsapp:+962795956190'  // Replace with your phone number
        })
        .then((message) => {
            console.log('Message SID:', message.sid);
            // Redirect to success page after successful message
            res.redirect('/success');
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).send('Error sending request');
        });
});

// Success page route
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
