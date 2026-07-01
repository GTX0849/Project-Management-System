tailwind.config = {
    theme: {
        extend: {
            colors: {
                teal: 'var(--teal)',
                orange: 'var(--orange)',
                cyan: 'var(--cyan)',
                white: 'var(--white)',
                tealDark: 'var(--teal-dark)',
                orangeDark: 'var(--orange-dark)',
                textDark: 'var(--text-dark)',
                textMuted: 'var(--text-muted)',
                bgMain: 'var(--bg-main)',
                bgCard: 'var(--bg-card)',
                borderLight: 'var(--border-light)'
            },
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                hover: 'var(--shadow-hover)',
            }
        }
    }
}

const form = document.getElementById('registrationForm');
const listContainer = document.getElementById('employeeListContainer');
let employee_details = [];
let editId = null; 

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        id: editId ? editId : Date.now(), // Keep existing ID if editing
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        joinDate: document.getElementById('joinDate').value
    };

    if (editId) {
        employee_details = employee_details.map(emp => emp.id === editId ? formData : emp);
        editId = null; 
        form.querySelector('button[type="submit"]').textContent = "Register User";
    } else {
        employee_details.push(formData);
    }

    renderEmployees();
    form.reset();
});

function renderEmployees() {
    const listContainer = document.getElementById('employeeListContainer');
    listContainer.innerHTML = ""; // Clear existing list

    employee_details.forEach((emp) => {
        const li = document.createElement("li");
        li.className = "group p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center w-full max-w-3xl";
        
        li.innerHTML = `
            <div class="flex flex-col gap-1">
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
                <button onclick="editEmployee(${emp.id})" class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button onclick="deleteEmployee(${emp.id})" class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        listContainer.appendChild(li);
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

function deleteEmployee(id) {
    employee_details = employee_details.filter(emp => emp.id !== id);
    renderEmployees();
}