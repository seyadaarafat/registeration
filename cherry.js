var userData;
var searchlist = [];
var mybtn = document.getElementById("mybtn");
var updatedindex;
var userName = document.getElementById("userName");
var userPassword = document.getElementById("userPassword");
var userEmail = document.getElementById("userEmail");
var userNumber = document.getElementById("userNumber");

// Load data from local storage when the page loads
// window.onload = function() {
var storedData = localStorage.getItem('userData');
if (storedData) {
    userData = JSON.parse(storedData);
    display(userData);
} else {
    userData = [];
}

function addData(event) {
    event.preventDefault();

    if (mybtn.innerHTML === "Submit") {
        var user = {
            Name: userName.value,
            password: userPassword.value,
            email: userEmail.value,
            number: userNumber.value
        }
        var isValidPassword = validatePassword(user.password);

        if (!isValidPassword) {
            document.getElementById("warningpass").innerHTML = `<p> Password must be 8 characters, contain uppercase and lowercase letters, and a special character!</p>`;
            document.getElementById("userPassword").classList.remove("is-valid");
            document.getElementById("userPassword").classList.add("is-invalid");
            return;
        } else {
            document.getElementById("warningpass").innerHTML = "";
            document.getElementById("userPassword").classList.remove("is-invalid");
            document.getElementById("userPassword").classList.add("is-valid");
        }
        // Validate phone number
        var isValidPhoneNumber = validatePhoneNumber(user.number);

        if (!isValidPhoneNumber) {
            document.getElementById("warning").innerHTML = `<p>Invalid phone number!</p>`;
            document.getElementById("userNumber").classList.remove("is-valid");
            document.getElementById("userNumber").classList.add("is-invalid");
            return;
        } else {
            document.getElementById("warning").innerHTML = ""; 
            document.getElementById("userNumber").classList.remove("is-invalid");
            document.getElementById("userNumber").classList.add("is-valid");
        }

    

        userData.push(user);

        // Save to local storage
        localStorage.setItem('userData', JSON.stringify(userData));

        display(userData);
    } else if (mybtn.innerHTML === "update user") {
        // Ensure that updatedindex is correctly defined
        if (updatedindex !== undefined && updatedindex < userData.length) {
            userData[updatedindex].Name = userName.value;
            userData[updatedindex].password = userPassword.value;
            userData[updatedindex].email = userEmail.value;
            userData[updatedindex].number = userNumber.value;

            // Validate phone number
            var isValidPhoneNumber = validatePhoneNumber(userData[updatedindex].number);

            if (!isValidPhoneNumber) {
                document.getElementById("warning").innerHTML = `<p>Invalid phone number!</p>`;
                document.getElementById("userNumber").classList.remove("is-valid");
                document.getElementById("userNumber").classList.add("is-invalid");
                return;
            } else {
                document.getElementById("warning").innerHTML = ""; // Remove the warning if the phone number is valid
                document.getElementById("userNumber").classList.remove("is-invalid");
                document.getElementById("userNumber").classList.add("is-valid");
            }

            var isValidPassword = validatePassword(userData[updatedindex].password);
            if (!isValidPassword) {
                document.getElementById("warningpass").innerHTML = `<p>Password must be 8 characters, contain uppercase and lowercase letters, and a special character!</p>`;
                document.getElementById("userPassword").classList.remove("is-valid");
                document.getElementById("userPassword").classList.add("is-invalid");
                return;
            } else {
                document.getElementById("warningpass").innerHTML = "";
                document.getElementById("userPassword").classList.remove("is-invalid");
                document.getElementById("userPassword").classList.add("is-valid");
            }

            localStorage.setItem('userData', JSON.stringify(userData));

            display(userData);
        } else {
            console.error("Invalid index or updatedindex is not defined.");
        }
    }
}

function display(userData) {
    // Clear the existing content
    document.getElementById("userData").innerHTML = '';
    var cartoona = "";

    if (userData.length == 0) {
        cartoona += `
      <tr>
        <td colspan="5">
          <div class="alert alert-danger">No match found</div>
        </td>
      </tr>`;
    } else {
        cartoona += `
                      <input type="text" onblur="search()" id="searchInput"  class="form-control " placeholder="Search by name">

      <table class="table table-hover table-bordered">
        <thead class="t-head">
          <tr>
            <th>Name</th>
            <th>Password</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>`;

        for (var i = 0; i < userData.length; i++) {
            cartoona += `
            <tr>
              <td>${userData[i].Name}</td>
              <td>${userData[i].password}</td>
              <td>${userData[i].email}</td>
              <td>${userData[i].number}</td>
              <td>
                <button onclick="deleteUser(${i})" class="btn btn-danger">Delete</button>
                <button onclick="editUser(${i})" class="btn btn-info">Edit</button>
              </td>
            </tr>`;
        }

        cartoona += `</tbody>
                  </table>`;
    }

    document.getElementById("userData").innerHTML = cartoona;
}


function validatePhoneNumber(phoneNumber) {
    var regex = /^0[1](2|5|0)[0-9]{8}$/; // 10 digits only

    if (regex.test(phoneNumber)) {
        return true;
    } else {
        return false;
    }
}

function validatePassword(password) {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    return regex.test(password);
}


function search() {
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
    searchlist = userData.filter((user) => user.Name.toLowerCase().includes(searchInput));
    display(searchlist);
}

function deleteUser(index) {
    userData.splice(index, 1);
    localStorage.setItem('userData', JSON.stringify(userData));
    display(userData);
}

function editUser(index) {
    mybtn.innerHTML = "update user";
    userName.value = userData[index].Name;
    userPassword.value = userData[index].password;
    userEmail.value = userData[index].email;
    userNumber.value = userData[index].number;
    updatedindex = index;
}

function reset() {
    mybtn.innerHTML = "Submit";
    userName.value = "";
    userPassword.value = "";
    userEmail.value = "";
    userNumber.value = "";
    updatedindex = undefined;
    document.getElementById("warning").innerHTML = "";
    document.getElementById("userNumber").classList.remove("is-invalid");
    document.getElementById("userNumber").classList.remove("is-valid");
    document.getElementById("userPassword").classList.remove("is-invalid");
    document.getElementById("userPassword").classList.remove("is-valid");
}