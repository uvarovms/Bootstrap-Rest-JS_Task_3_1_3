$(async function () {
    await getAllRoles();
    await getTableAllUsers();
    await getTableForAdmin();
    await getRolesByUser();
    await findUserInfo();
    await addUser();
    await getDefaultModal();
})

const fetchUserService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('users'),
    findAllRoles: async () => await fetch('roles'),
    findPrincipal: async () => await fetch('user'),
    findUserById: async (id) => await fetch(`${id}`),
    addNewUser: async (user) => await fetch('add', {
        method: 'POST',
        headers: fetchUserService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`${id}`, {
        method: 'PUT',
        headers: fetchUserService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`${id}`, {method: 'DELETE', headers: fetchUserService.head})
}

async function getAllRoles() {
    let allRoles = [];
    await fetchUserService.findAllRoles()
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                allRoles.push(role);
            })
        })
    return allRoles;
}

async function findUserInfo() {
    let findUser = $('#findUserInfo b');
    await fetchUserService.findPrincipal()
        .then(res => res.json())
        .then(user => {
            let findUserInfo = user.email
            findUser.append(findUserInfo);
        })
}

async function getRolesByUser() {
    let findRole = $('#rolesByUser');
    await fetchUserService.findPrincipal()
        .then(res => res.json())
        .then(user => {
            let rolesUser = user.roles.map(role => "  " + role.name)
            findRole.append(rolesUser);
        })
}

async function getTableForAdmin() {
    let table = $('#mainTableForAdmin tbody');
    await fetchUserService.findPrincipal()
        .then(res => res.json())
        .then(user => {
            let fillInTheAdminTable = `$(
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td> ${user.roles.map(role => "  " + role.name)}</td>
            </tr>
            )`;
            table.append(fillInTheAdminTable);
        })
}

async function getTableAllUsers() {
    let table = $('#mainTableAllUsers tbody');
    table.empty();
    await fetchUserService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let fillInAllUsersTable = `$(
                        <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td> ${user.roles.map(role => "  " + role.name)}</td>
                        <td>
                            <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                            data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                        </td>
                        <td>
                             <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                             data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                        </td>
                    </tr>
                )`;
                table.append(fillInAllUsersTable);
            })
        })

    $("#mainTableAllUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let userById = await fetchUserService.findUserById(`${id}`);
    let user = userById.json();
    let allEditRoles = [];
    await fetchUserService.findAllRoles()
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                allEditRoles.push(role);
            })
        })
    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
                <label for="id" class="font-weight-bold">ID<input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled>
                <label th:for="name" class="font-weight-bold">First Name<input class="form-control" type="text" id="name" value="${user.name}">
                <label th:for="lastName" class="font-weight-bold">Last Name<input class="form-control" type="text" id="lastName" value="${user.lastName}">
                <label th:for="age" class="font-weight-bold">Age<input class="form-control" id="age" type="number" value="${user.age}">
                <label th:for="email" class="font-weight-bold">Email<input class="form-control" type="text" id="email" value="${user.email}">
                <label th:for="password" class="font-weight-bold">Password<input class="form-control" type="password" id="password" value="${user.password}">
                <h1></h1>
                <label th:for="password" class="font-weight-bold">Role<br>
                <select class="form-control" id="mySelectId" name="mySelect" multiple size="2">
                    <option value="${allEditRoles[0].name}">${allEditRoles[0].name}</option>
                    <option value="${allEditRoles[1].name}">${allEditRoles[1].name}</option>-->
                </select>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    });

    $("#editButton").on('click', async () => {
        let id = (modal.find("#id").val()).trim();
        let age = modal.find("#age").val().trim();
        let name = modal.find("#name").val().trim();
        let lastName = modal.find("#lastName").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        let roleByUserEdit = [];

        let elementEditRole = document.getElementById("mySelectId");
        for (let i = 0; i < elementEditRole.options.length; i++) {
            let oneAddRole = elementEditRole.options[i];
            if (oneAddRole.selected) roleByUserEdit.push(oneAddRole.value);
        }

        let data = {
            id: id,
            name: name,
            lastName: lastName,
            email: email,
            password: password,
            age: age,
            roles: roleByUserEdit
        }
        await fetchUserService.updateUser(data, id);
        await getTableAllUsers();
        modal.modal('hide');
    })
}

async function deleteUser(modal, id) {
    let userById = await fetchUserService.findUserById(`${id}`);
    let user = userById.json();
    let allDelRoles = [];
    await fetchUserService.findAllRoles()
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                allDelRoles.push(role);
            })
        })
    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
                <label for="id" class="font-weight-bold">ID<input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <label th:for="name" class="font-weight-bold">First Name<input class="form-control" type="text" id="name" value="${user.name}" disabled><br>
                <label th:for="lastName" class="font-weight-bold">Last Name<input class="form-control" type="text" id="lastName" value="${user.lastName}" disabled><br>
                <label th:for="age" class="font-weight-bold">Age<input class="form-control" id="age" type="number" value="${user.age}" disabled><br>
                <label th:for="email" class="font-weight-bold">Email<input class="form-control" type="text" id="email" value="${user.email}" disabled><br>   
                <h1></h1>
                <label th:for="roles" class="font-weight-bold">Role<br>
                <select class="form-control" id="mySelectId" name="mySelectDelete" multiple size="2">                          
                    <option value="${allDelRoles[0].name}" disabled>${allDelRoles[0].name}</option>
                    <option value="${allDelRoles[1].name}" disabled>${allDelRoles[1].name}</option> 
                </select>            
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })
    $("#deleteButton").on('click', async () => {
        await fetchUserService.deleteUser(id);
        await getTableAllUsers();
        modal.modal('hide');
    })
}

async function addUser() {
    let allAddRoles = [];
    await fetchUserService.findAllRoles()
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                allAddRoles.push(role);
            })
        })
    let select = $('#defaultSomeForm div');
    let fillTheBodyOnlyRoles = `
        <select class="form-control" id="mySelectForAddId" name="mySelect" multiple size="2">
            <option value="${allAddRoles[0].name}">${allAddRoles[0].name}</option>
            <option value="${allAddRoles[1].name}">${allAddRoles[1].name}</option>
        </select>
    `;
    select.append(fillTheBodyOnlyRoles);
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')
        let name = addUserForm.find('#addNewUserName').val().trim();
        let lastName = addUserForm.find('#addNewUserLastName').val().trim();
        let age = addUserForm.find('#addNewUserAge').val().trim();
        let email = addUserForm.find('#addNewUserEmail').val().trim();
        let password = addUserForm.find('#addNewUserPassword').val().trim();
        let roleByUserAdd = [];

        let elAddRole = document.getElementById("mySelectForAddId");
        for (let i = 0; i < elAddRole.options.length; i++) {
            let oneAddRole = elAddRole.options[i];
            if (oneAddRole.selected) roleByUserAdd.push(oneAddRole.value);
        }

        let data = {
            name: name,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roleByUserAdd
        }
        await fetchUserService.addNewUser(data);
        await getTableAllUsers();
        addUserForm.find('#addNewUserName').val('');
        addUserForm.find('#addNewUserLastName').val('');
        addUserForm.find('#addNewUserAge').val('');
        addUserForm.find('#addNewUserEmail').val('');
        addUserForm.find('#addNewUserPassword').val('');
    })
}


