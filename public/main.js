'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()
}


const getLocalStorage = ()=> JSON.parse (localStorage.getItem('dbClient')) ?? []
const setLocalStorage = (dbClient)=> localStorage.setItem("dbClient", JSON.stringify(dbClient))

//CRUD-Delete
const deleteClient = (logado) =>{
    const dbClient = readClient()
    dbClient.splice(logado,1)
    setLocalStorage(dbClient)
}

//CRUD-Update
const updateClient = (logado, client) => {
    const dbClient = readClient()
    dbClient[logado] = client
    setLocalStorage(dbClient)

}
//CRUD-Read
const readClient = ()=> getLocalStorage()

//CRUD-Create
const createClient = (client)=>{
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}



const isValidFields = () =>{
        return document.getElementById('form').reportValidity()
}

const clearFields = () =>{
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = ()=>{
    if (isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
            professor: document.getElementById('professor').value,
            categoria: document.getElementById('categoria').value,
            descricao: document.getElementById('descricao').value,
            foto: document.getElementById('file')
        }
        const logado = document.getElementById('nome').dataset.logado
        if (logado == 'new'){
            createClient(client, logado)
            createRow
            updateTable()
            closeModal()
        } else {
        
            updateClient(logado, client)
            updateTable()
            closeModal()
            
        }
       
    }
}

const createRow = (client, logado)=>{
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.email}</td>
            <td>${client.celular}</td>
            <td>${client.cidade}</td>
            <td>${client.professor}</td>
            <td>${client.categoria}</td>
            <td>${client.descricao}</td>
            <td><img id="preview" src="${client.foto}"></td>
            <td>
                <button type="button" class="button green" id="edit-${logado}">Editar</button>
                <button type="button" class="button red" id="delete-${logado}">Excluir</button>
            </td>
        `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () =>{
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('professor').value = client.professor
    document.getElementById('categoria').value = client.categoria
    document.getElementById('descricao').value = client.descricao
    document.getElementById('foto').src = client.foto
    document.getElementById('nome').dataset.logado = client.logado
}

const editClient = (logado) => {
    const client = readClient()[logado]
    client.logado = logado
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button'){

        const [action, logado] = event.target.id.split('-')

        if (action == 'edit'){
            editClient(logado)
        } else {
            const client = readClient()[logado]
            const response = confirm ( `Tem certeza que deseja excluir o perfil de ${client.nome} permanentemente?`)
            if (response) {
                deleteClient(logado)
                updateTable()
            }
            
        }
}
}
//---------------------
const CLIENT_ID = 'de311c9a655ed81';

const doUpload = (url, options) => {
    const promiseCallback = (resolve, reject) => {
        fetch(url, options)
        .then(response => response.json())
        .then(resolve)
        .catch(reject);
    }
    return new Promise(promiseCallback)
}

const uploadImage = () => {
    e.preventDefault();

    const file = document.getElementById('foto')

    const data = new FormData
    data.append('image', file.files[0])
    
    doUpload('https://api.imgur.com/3/image', {
        method: 'POST',
        body: data,
        headers: {
            'Authorization': `Client_ID ${CLIENT_ID}`,
        }
    })
    .then(console.log)
    .catch(console.error)

}

const form = document.getElementById('foto');
form.addEventListener('submit', uploadImage)
//------------------------
updateTable()


document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('Salvar')
    .addEventListener('click', saveClient)

document.getElementById('Cancelar')
    .addEventListener('click', closeModal)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)        