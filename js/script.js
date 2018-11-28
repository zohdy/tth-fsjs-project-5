/********************************************** /
                FETCH FUNCTIONS
 /*********************************************/
const queryString = 'https://randomuser.me/api/?nat=us&results=12';
fetchData(queryString)
    .then(data => generateEmployee(data.results))
    .then(employees => displayGallery(employees))
    .then(employees => displaySearchBar(employees))
    .then(employees => attachEventListeners(employees));

// Reusable fetch function
function fetchData(url){
    return fetch(url)
        .then(checkNetworkStatus)
        .then(res => res.json())
        .catch(error => console.log('There was an error fetching data from ' + queryString, error))
}
// Returns a new array of employee objects based on the selected properties
function generateEmployee (results) {
    return results.map((prop) => {
       const employee = {};
        employee['name'] = prop.name.first + ' ' + prop.name.last;
        employee['email'] = prop.email;
        employee['street'] = prop.location.street;
        employee['city'] = prop.location.city;
        employee['state'] = prop.location.state;
        employee['postcode'] = prop.location.postcode;
        employee['phone'] = prop.phone;
        employee['dob'] = formatDateOfBirth(prop.dob.date);
        employee['picture'] = prop.picture.large;
        return employee;
    });
}

function displaySearchBar(employees){
    document.querySelector('.search-container').innerHTML += `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>`;
    return employees;
}

// Add a .card element for each employee in the array. Employee props are added dynamically using ${} notation
function displayGallery(employees) {
    for(let index in employees){
        document.querySelector('.gallery').innerHTML += `
        <!-- Adding an index data-attribute to each employee for the prev and next buttons -->
        <div class="card" data-index-number="${index}">
            <div class="card-img-container">
                <img class="card-img" src="${employees[index].picture}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employees[index].name}</h3>
                <p class="card-text">${employees[index].email}</p>
                <p class="card-text cap">${employees[index].city}, ${employees[index].state}</p>
            </div>
        </div>`;
    }
    return employees;
}
/********************************************** /
                    EVENTS
 /*********************************************/
function attachEventListeners(employees) {
    let index;
    const maxIndex = document.querySelectorAll('.card').length - 1;

    // Attach a listener on each card element
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            index = e.currentTarget.dataset.indexNumber;
            showModal(employees, index)
        });
    });
    // Event delegation for dynamic added elements
    document.body.addEventListener('click', e => {
        if(e.target.id === 'modal-close-btn' || e.target.id === 'close-x'){
            removeModal();
        }
        // Prev and Next buttons wraps around
        if(e.target.id === 'modal-next'){
            index++;
            if(index > maxIndex){
                index = 0;
            }
            removeModal();
            showModal(employees, index)
        }
        // Prev and Next buttons wraps around
        if(e.target.id === 'modal-prev'){
            index--;
            if(index < 0){
                index = maxIndex;
            }
            removeModal();
            showModal(employees, index)
        }
    });
    // Keyup event listener for search filter
    document.body.addEventListener('keyup', e => {
        if(e.target.id === 'search-input'){
            const userInput = e.target.value;
            filterEmployees(employees, userInput)
        }
    });
}
/********************************************** /
                HELPER FUNCTIONS
 /*********************************************/

function checkNetworkStatus (response) {
    if(response.ok){
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
function removeModal() {
    const modalContainer = document.querySelector('#modal-container');
    modalContainer.parentNode.removeChild(modalContainer);
}
function showModal(employees, index) {
    // Using 'insertAdjacentHTML' to prevent listener from being erased
    document.body.insertAdjacentHTML('beforeend', renderModalHTML(employees, index));
}

// dob is shown as '1975-11-12T06:34:44Z' and should be formatted as MM/DD/YY
function formatDateOfBirth(dob) {
    const currentDob = new Date(dob);
    let date = currentDob.getDate();
    let month = currentDob.getMonth() + 1;
    const year = currentDob.getFullYear();

    // Month and day Pad
    if(month < 10) { month = '0' + month; }
    if(date < 10) { date = '0' + date; }

    // Formats to MM/DD/YY
    return date + "/" + month + "/" + year.toString().slice(2);
}
// Hide or show the card elements based on the search input
function filterEmployees (employees, userInput) {
    const employeeCards = document.querySelectorAll('.card');
        for(let i = 0; i < employees.length; i++) {
            if (employees[i].name.toLowerCase().includes(userInput.toLowerCase())) {
                employeeCards[i].style.display = 'flex';
            } else {
                employeeCards[i].style.display = 'none';
            }
        }
}
function renderModalHTML(employees, index) {
    return `
             <div class="modal-container" id="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong id="close-x">X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employees[index].picture}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employees[index].name}</h3>
                    <p class="modal-text">${employees[index].email}</p>
                    <p class="modal-text cap">${employees[index].city}</p>
                    <hr>
                    <p class="modal-text">${employees[index].phone}</p>
                    <p class="modal-text cap">${employees[index].street}, ${employees[index].city}</p>
                    <p class="modal-text cap">${employees[index].state}, ${employees[index].postcode}</p>
                    <p class="modal-text">${employees[index].dob}</p>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                 </div>
            </div>`;
}


