import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let employees = []

const readEmployee = () => {
    try {
        const data = fs.readFileSync('employees.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

const writeEmployee = (data) => {
    try {
        fs.writeFileSync('employees.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.log(error);
    }
}

app.get('/api/employees', (req, res) => {
    const employees = readEmployee();
    res.json(employees);
});

app.post('/api/employees', (req, res) => {
    const { name, post, salary } = req.body;
    if (!name || !post || !salary) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const newEmployee = {
        id: Date.now(),
        name,
        post,
        salary
    };
    employees.push(newEmployee);
    writeEmployee(employees);
    res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, post, salary } = req.body;

    let employees = readEmployee();
    const index = employees.findIndex(emp => emp.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: "Employee not found" })
    }

    employees[index] = { ...employees[index], name, post, salary };
    writeEmployee(employees);
    res.json(employees[index]);
})

app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    let employees = readEmployee();
    const initialLength = employees.length;
    
    employees = employees.filter(emp => emp.id !== parseInt(id));

    if (employees.length === initialLength) {
        return res.status(404).json({ message: "Employee not found" });
    }

    writeEmployee(employees);
    res.json({ message: "Employee deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
