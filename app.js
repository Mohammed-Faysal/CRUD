document.addEventListener('DOMContentLoaded', function () {
    // Initialize DataTable
    $('#example').DataTable({
        scrollY: '600px',
        scrollCollapse: true,
        paging: true
    });

    let getData = localStorage.getItem('customers') ? JSON.parse(localStorage.getItem('customers')) : []

    let isEdit = false, editId

    showInfo()

    var form = document.getElementById('addNewForm')
    var customer_Name = document.getElementById('customerName')
    var customer_Address = document.getElementById('customerAddress')
    var customerEmail = document.getElementById('email')
    var joining_Date = document.getElementById('joiningDate')

    var addNewModal

    // Show modal when "Add New" button is clicked
    document.getElementById('addNewBtn').addEventListener('click', function () {
        addNewModal = new bootstrap.Modal(document.getElementById('addNewModal'), {
            backdrop: 'static',
            keyboard: false
        });
        
        document.getElementById('addNewForm').reset()
        
        document.querySelector('.submitBtn').innerText = 'Submit'
        document.querySelector('.modal-title').innerText = "Add New Customer"

        isEdit = false
        addNewModal.show();
    });


    // Function to capture and return gender value
    function getGender() {
        const gender = document.querySelector('input[name="gender"]:checked')

        return gender ? gender.value : ''
    }


    // Function to capture and return selected skills as an array
    function getSkills() {
        const selectedSkills = [] // an empty array

        document.querySelectorAll('input[name="skills"]:checked').forEach(skill => {
            selectedSkills.push(skill.value)
        })

        return selectedSkills.join(', ') // Join array into comma-separated string. Ex: JavaScript, React Js, Express JS
    }


    // Upload Image
    const img = document.querySelector(".img")
    const uploadImg = document.getElementById("uploadimg")

    uploadImg.onchange = function(){
        if(uploadImg.files[0].size < 1000000){ // 1MB = 1000000
            var fileReader = new FileReader()

            fileReader.onload = function(e){
                imgUrl = e.target.result
                img.src = imgUrl
            }

            fileReader.readAsDataURL(uploadImg.files[0])
        }
        else{
            alert("This file is too large!")
        }
    }




    function showInfo(){

         // Get the DataTable instance
        let table = $('#example').DataTable();
        table.clear(); // Clear existing data in the DataTable

        getData.forEach((element, index) => {

            // Add the row to the DataTable
            table.row.add([
                index + 1,
                `<img src="${element.image || './image/user.png'}" width="50" height="50" alt="Profile Picture">`,
                element.customerName,
                element.customerAddress,
                element.email,
                element.gender,
                element.skills,
                element.joiningDate,
                `<td class="actionIcon">
                    <button class="actionBtn" onclick="editInfo(${index})">Edit</button>

                    <button class="actionBtn" onclick="deleteInfo(${index})">Delete</button>
                </td>`
            ]);
        })

        // Redraw the DataTable to display the new rows
        table.draw();
    }
    showInfo()


    window.editInfo = function(index) {
        isEdit = true
        editId = index
        const info = getData[index]

        customer_Name.value = info.customerName
        customer_Address.value = info.customerAddress
        customerEmail.value = info.email
        joining_Date.value = info.joiningDate
        img.src = info.image || "./image/user.png"

        // Set Gender
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
            radio.checked = (radio.value === info.gender)
        })

         // Set Skills
         document.querySelectorAll('input[name="skills"]').forEach(skill => {
            skill.checked = info.skills.includes(skill.value)
        })

        document.querySelector('.submitBtn').innerText = 'Update'
        document.querySelector('.modal-title').innerText = "Update The Form"

        // Initialize and show modal
        addNewModal = new bootstrap.Modal(document.getElementById('addNewModal'), {
            backdrop: 'static',
            keyboard: false
        });

        addNewModal.show();
        
        document.querySelector('.submitBtn').innerText = 'Update'
        document.querySelector('.modal-title').innerText = "Update The Form"
    }


    window.deleteInfo = function(index) {
        if (confirm("Are you sure you want to delete this customer?")) {
            getData.splice(index, 1);
            localStorage.setItem('customers', JSON.stringify(getData));
            showInfo();
        }
    }


    // Form Validation for gender and skills
    function validateForm(){
        let genderSelected = false;
        let skillsSelected = false

        // Check if a gender is selected
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
            if(radio.checked){
                genderSelected = true
            }
        })

        // Check if any skill is selected
        document.querySelectorAll('input[name="skills"]').forEach(skill => {
            if(skill.checked){
                skillsSelected = true
            }
        })


        // if no gender or no skills selected, show an alert and prevent form submission
        if(!genderSelected){
            alert("Please select a gender.")
            return false
        }

        if(!skillsSelected){
            alert("Please select at least one skill.")
            return false
        }


        // if both gender and skills are selected, return true to allow form submission
        return true
    }





    form.addEventListener('submit', (e)=> {
        e.preventDefault()

        if(!validateForm()){
            return
        }
    
        const information = {
            image: img.src,
            customerName: customer_Name.value,
            customerAddress: customer_Address.value,
            email: customerEmail.value,
            gender: getGender(),
            skills: getSkills(),
            joiningDate: joining_Date.value,
        }
    
        if(!isEdit){
            getData.push(information)
        }
        else{
            isEdit = false
            getData[editId] = information
        }
    
        localStorage.setItem('customers', JSON.stringify(getData))
    
        document.querySelector('.submitBtn').innerText = 'Submit'
        document.querySelector('.modal-title').inneText = "Add New Customer"
    
        showInfo()
        form.reset()
        img.src = "./image/user.png" // Reset to default image
        addNewModal.hide(); // Close the modal after submission

    })

});



