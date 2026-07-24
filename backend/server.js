const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Employee = require('./model/employee.model')

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/workspaceDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ _id: -1 });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/employees', async (req, res) => {
    try {
        const newEmployee = new Employee({
            fullName: req.body.fullName,
            email: req.body.email,
            role: req.body.role,
            joinDate: req.body.joinDate
        });
        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));