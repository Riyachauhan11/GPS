import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import nodemailer from 'nodemailer';


dotenv.config();
const app = express();
const port = 3000;

const validEmail = process.env.ADMIN_EMAIL;
const validPassword = process.env.ADMIN_PASSWORD;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.get("/", async(req, res) => {
    try{
      res.render("index.ejs");   
    }
    catch(error){
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: error.message,
    });
    }
  });


app.get("/pinpoint", async (req, res) => {
try {
    res.render("pinpoint.ejs");
} 
catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("pinpoint.ejs", {
    error: error.message,
    });
}
});

app.get('/getData', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.redirect('/auth');
    }
    console.log(userId);  
    try {
        res.render('getData.ejs', { userId: userId });
    } catch (error) {
        console.error('Failed to render getData:', error.message);
        res.status(500).send('Internal Server Error');
    }
});



app.get("/auth", async (req, res) => {
try {
    res.render("auth.ejs");
} catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("auth.ejs", {
    error: error.message,
    });
}
});

app.get("/geofence", async (req, res) => {
        try {
            res.render("admin_login.ejs");
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.render("admin_login.ejs", {
                error: error.message,
            });
        }
    }
);

app.post("/geofence", async (req, res) => {
    const { email, password } = req.body;

    if (email === validEmail && password === validPassword) {
        res.render("geofence.ejs"); // Render the geofence page
    } else {
        res.render("admin_login.ejs", {
            error: "Invalid credentials",
        });
    }
});

// Endpoint to handle sending emails
app.post('/sendEmail', (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_SENDER,
            pass: process.env.MAIL_PASS
        }
    });

    let mailOptions = {
        from:{
            name:'Geofence',
            address: process.env.MAIL_SENDER
        },
        to: email,
        subject: 'Geofence Event Notification',
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    });
});
        

app.get("/login", async (req, res) => {
    try {
        res.render("login.ejs");
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("login.ejs", {
        error: error.message,
        });
    }
});

app.get("/signup", async (req, res) => {
    try {
        res.render("signup.ejs");
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("signup.ejs", {
        error: error.message,
        });
    }
});
    

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });