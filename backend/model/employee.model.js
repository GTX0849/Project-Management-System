const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(
    {
    fullName: {
        type: String,
        required: [true, 'Please Enter Employee Name'],
    },

    email: {
        type: String,
        required: [true, 'Please Enter Email'],
    },

    role: 
    { 
        type: String, 
        required: [true, 'Please Select Role'], 
    },

    joinDate: { 
        type: Date, 
        required: [true, 'Please Enter Joining Date'] 
    }
    }    
)

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;