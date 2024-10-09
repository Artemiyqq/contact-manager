let contacts = [];
let sortDirection = {};

function sortTableByColumn(columnIndex) {
    const table = document.getElementById("cotactsBody");
    const rows = Array.from(table.getElementsByTagName("tr"));

    sortDirection[columnIndex] = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';

    rows.sort((a, b) => {
        const cellA = a.getElementsByTagName("td")[columnIndex].textContent.trim();
        const cellB = b.getElementsByTagName("td")[columnIndex].textContent.trim();

        let comparison = cellA.localeCompare(cellB);

        if (sortDirection[columnIndex] === 'desc') {
            comparison = -comparison;
        }

        return comparison;
    });

    table.innerHTML = "";

    rows.forEach(row => table.appendChild(row));
}

function getContacts() {
    fetch('contacts-manager/get')
        .then(response => response.json())
        .then(data => {
            contacts = data.map(contact => ({ ...contact, editMode: false }));
            fillInTable();
        })
        .catch(error => console.error('Error on fetching contacts:', error));
}

function fillInTable(filteredContacts = contacts) {
    const table = document.getElementById("cotactsBody");
    table.innerHTML = "";

    filteredContacts.forEach((contact, index) => {
        let row = `
            <tr>
                <td>${contact.editMode ? `<input type="text" class="form-control" value="${contact.name}" id="name_${index}">` : contact.name}</td>
                <td>${contact.editMode ? `<input type="date" class="form-control" value="${contact.dateOfBirth}" id="dob_${index}">` : contact.dateOfBirth}</td>
                <td>${contact.editMode ? `<select class="form-control" id="married_${index}">
                                            <option value="Yes" ${contact.married ? 'selected' : ''}>Yes</option>
                                            <option value="No" ${!contact.married ? 'selected' : ''}>No</option>
                                          </select>` : (contact.married ? 'Yes' : 'No')}
                </td>
                <td>${contact.editMode ? `<input type="text" class="form-control" value="${contact.phone}" id="phone_${index}">` : contact.phone}</td>
                <td>${contact.editMode ? `<input type="number" class="form-control" value="${contact.salary}" id="salary_${index}">` : contact.salary}</td>
                <td>
                    ${contact.editMode ? `
                        <button class="btn btn-success px-2" onclick="saveContact(${index})">Save</button>
                        <button class="btn btn-secondary" onclick="cancelEdit(${index})">Cancel</button>` : `
                        <button class="btn btn-primary" onclick="editContact(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteContact(${index})">Delete</button>`}
                </td>
             </tr>`;
        table.innerHTML += row;
    });
}

function editContact(index) {
    contacts[index].editMode = true;
    fillInTable();
}

function cancelEdit(index) {
    contacts[index].editMode = false;
    fillInTable();
}

function saveContact(index) {
    const editedContact = {
        name: document.getElementById(`name_${index}`).value,
        dateOfBirth: document.getElementById(`dob_${index}`).value,
        married: document.getElementById(`married_${index}`).value === 'Yes',
        phone: document.getElementById(`phone_${index}`).value,
        salary: parseFloat(document.getElementById(`salary_${index}`).value)
    };

    contacts[index] = { ...editedContact, editMode: false };

    fetch(`contacts-manager/put/${index+1}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedContact)
    })
        .then(response => response.json())
        .then(data => {
            fillInTable();
        })
        .catch(error => console.error('Error updating contact:', error));
}

function deleteContact(index) {
    const confirmDelete = confirm("Are you sure you want to delete this contact?");

    if (confirmDelete) {
        contacts.splice(index, 1);

        fetch(`contacts-manager/delete/${index}`, {
            method: 'DELETE',
        })

        fillInTable();
    }
}

function applyFilters() {
    const nameFilter = document.getElementById("nameFilter").value.toLowerCase();
    const dobFilter = document.getElementById("dobFilter").value.toLowerCase();
    const marriedFilter = document.getElementById("marriedFilter").value;
    const phoneFilter = document.getElementById("phoneFilter").value.toLowerCase();
    const salaryFilter = document.getElementById("salaryFilter").value.toLowerCase();

    const filteredContacts = contacts.filter(contact => {
        return (!nameFilter || contact.name.toLowerCase().includes(nameFilter)) &&
            (!dobFilter || contact.dateOfBirth.toLowerCase().includes(dobFilter)) &&
            (!marriedFilter || (marriedFilter === "Yes" ? contact.married : !contact.married)) &&
            (!phoneFilter || contact.phone.toLowerCase().includes(phoneFilter)) &&
            (!salaryFilter || contact.salary.toString().toLowerCase().includes(salaryFilter));
    });

    fillInTable(filteredContacts);
}

function postCsv() {
    const fileInput = document.getElementById("csvFile");
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    fetch('contacts-manager/post', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

getContacts();
fillInTable();
