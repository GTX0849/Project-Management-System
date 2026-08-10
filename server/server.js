import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config();

// ── MongoDB Connection ──────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// ── Employee Schema & Model ─────────────────────────────────────────────────
const employeeSchema = new mongoose.Schema({
    name:   { type: String, required: true },
    email:  { type: String, required: true },
    post:   { type: String, required: true },
    salary: { type: Number, required: true },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

// ── Nodemailer Transporter ──────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ── Express App ─────────────────────────────────────────────────────────────
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// GET all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch employees', error });
    }
});

// POST – create a new employee
app.post('/api/employees', async (req, res) => {
    const { name, email, post, salary } = req.body;
    if (!name || !email || !post || !salary) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const password = Math.random().toString(36).slice(-8);

    try {
        const newEmployee = await Employee.create({ name, email, post, salary });

        // Send welcome email
        try {
            const mailOptions = {
                from: `"HR Department" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Welcome to the Company - Account Details',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7f6; color: #333;">
                        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: auto;">
                            <h2 style="color: #2b6cb0; text-align: center; border-bottom: 2px solid #edf2f7; padding-bottom: 10px;">Welcome Aboard, ${name}!</h2>
                            <p style="font-size: 16px; line-height: 1.5;">Your employee account has been successfully created. Below are your login credentials to access the internal portal:</p>
                            <div style="background-color: #ebf8fa; padding: 15px; border-left: 4px solid #319795; margin: 20px 0;">
                                <p style="margin: 0 0 10px 0;"><strong>Username / Email:</strong> ${email}</p>
                                <p style="margin: 0;"><strong>Password:</strong> <span style="font-family: monospace; font-size: 16px; background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${password}</span></p>
                            </div>
                            <p style="font-size: 14px; color: #718096; margin-top: 30px;">Please change your password upon your first login. If you face any issues, contact IT support.</p>
                            <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">Best Regards,<br>HR Department</p>
                        </div>
                    </div>
                `,
            };
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error('Failed to send email:', mailError);
        }

        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create employee', error });
    }
});

// PUT – update an employee
app.put('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, post, salary } = req.body;

    try {
        const updated = await Employee.findByIdAndUpdate(
            id,
            { name, email, post, salary },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update employee', error });
    }
});

// DELETE – remove an employee
app.delete('/api/employees/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Employee.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete employee', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
