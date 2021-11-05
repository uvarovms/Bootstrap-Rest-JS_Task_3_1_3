$(async function () {
    await findUserInfo();
    await getRolesByUser();
    await getTableUserInfo();
})

const fetchUserService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findUser: async () => await fetch('user'),
}

async function findUserInfo() {
    let findUser = $('#findUserInfo b');
    await fetchUserService.findUser()
        .then(res => res.json())
        .then(user => {
            let findUserInfo = user.email
            findUser.append(findUserInfo);
        })
}

async function getRolesByUser() {
    let findRole = $('#rolesByUser');
    await fetchUserService.findUser()
        .then(res => res.json())
        .then(user => {
            let rolesUser = user.roles.map(role => "  " + role.name)
            findRole.append(rolesUser);
        })
}

async function getTableUserInfo() {
    let tableUserInfo = $('#tableUserInfo tbody');
    await fetchUserService.findUser()
        .then(res => res.json())
        .then(user => {
            let fillInTheUserTable = `(
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(role => "  " + role.name)}</td>
            </tr>
            )`;
            tableUserInfo.append(fillInTheUserTable);
        })
}
