// REMOVED the require() statements. They do not work in frontend JavaScript!

const form = document.getElementById('registrationForm');
const listContainer = document.getElementById('employeeListContainer');
let employee_details = [];
let editId = null;

const API_URL = "http://localhost:3000/api/employees";

fetchEmployees();

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        joinDate: document.getElementById('joinDate').value
    };

    try {
        let response;

        if (editId) {
            response = await fetch(`${API_URL}/${editId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
        }

        const data = await response.json();

        if (!response.ok) {
            if (data.error) {
                alert('An error occurred: ' + data.error);
            }
            return;
        }

        if (editId) {
            editId = null;
            form.querySelector('button[type="submit"]').textContent = "Register User";
        }

        form.reset();
        await fetchEmployees();
    }
    catch (error) {
        console.log('Error Saving Data', error);
        alert('Failed to Save.');
    }
});

async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        employee_details = data.map(emp => ({
            id: emp._id, 
            fullName: emp.fullName,
            email: emp.email,
            role: emp.role,
            joinDate: emp.joinDate.split('T')[0]
        }));
        
        renderEmployees();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function deleteEmployee(id) {
    if(!confirm("Are you sure you want to delete this user?")) return;
    
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchEmployees();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

function renderEmployees() {
    const listContainer = document.getElementById('employeeListContainer');
    listContainer.innerHTML = ""; 

    employee_details.forEach((emp) => {
        const li = document.createElement("li");
        li.className = "group p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center w-full max-w-3xl";

        li.innerHTML = `
            <div class="flex flex-col gap-1">
                <div id="avatar-${emp.id}" class="w-12 h-12 flex items-center justify-center rounded-full bg-borderLight overflow-hidden">
                    <i class="fa-solid fa-spinner fa-spin text-gray-400"></i> 
                </div>
                <p class="text-lg font-bold text-gray-900">${emp.fullName}</p>
                <div class="flex flex-wrap items-center gap-x-3 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                        <i class="fa-solid fa-envelope text-teal"></i> ${emp.email}
                    </span>
                    <span class="hidden md:inline text-gray-300">|</span>
                    <span class="font-medium text-tealDark">${emp.role}</span>
                    <span class="hidden md:inline text-gray-300">|</span>
                    <span class="italic">Joined: ${emp.joinDate}</span>
                </div>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editEmployee('${emp.id}')" class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button onclick="deleteEmployee('${emp.id}')" class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        listContainer.appendChild(li);

        fetch(`https://api.dicebear.com/10.x/croodles/svg?seed=${emp.fullName}`)
            .then(data => {
                return data.text()
            }).then(image => {
                const imgContainer = document.getElementById(`avatar-${emp.id}`)
                if (imgContainer) {
                    imgContainer.innerHTML = image
                    const svgElement = imgContainer.querySelector('svg');
                    if (svgElement) {
                        svgElement.classList.add('w-full', 'h-full');
                    }
                }
            }).catch(error => {
                console.error("Failed to load avatar for", emp.fullName, error);
                document.getElementById(`avatar-${emp.id}`).innerHTML = `<i class="fa-solid fa-user text-gray-400"></i>`;
            });
    });
}

function editEmployee(id) {
    const emp = employee_details.find(e => e.id === id);
    if (emp) {
        document.getElementById('fullName').value = emp.fullName;
        document.getElementById('email').value = emp.email;
        document.getElementById('role').value = emp.role;
        document.getElementById('joinDate').value = emp.joinDate;

        editId = id;
        form.querySelector('button[type="submit"]').textContent = "Update User";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}