const faker = require('faker')
const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'

//Skapa payload 
function createRandomClientPayload() {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()
    const fakeId = faker.random.number({min:2000, max:999999999})

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone,
        "created":"2020-11-17T09:04:43.121Z",
        "id":fakeId
    }

    return payload
}

function getRequestAllClients(cy, name, email, telephone) {
    // get request to fetch all clients
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        }

    }).then((response => {
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)
    }))
}

//Create a client
function createClientRequest(cy) {
    cy.Session().then((response => {

        let fakeClientPayload = createRandomClientPayload()

        //post request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload

        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))

        getRequestAllClients(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)
        logout(cy)
    }
    ))

}

//Delete a client
function deleteRequestAfterGet(cy){
    cy.Session().then((response =>{
    
   // get request to fetch all clients
     cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            }

        }).then((response => {
            let lastIDclient = response.body[response.body.length -1].id
            cy.log(response.body[response.body.length -1].id)
            cy.request({
                method: "DELETE",
                url: ENDPOINT_GET_CLIENT+lastIDclient,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                }
            }).then((response => {
                const responseAsString = JSON.stringify(response.body)
                cy.log(responseAsString)
                expect(responseAsString).to.have.string('true')
            }))
        }))
       
    }))
}


//Edit a client
function editRequestAfterGet(cy) {
    cy.Session().then((response => {
        let fakeClientPayload = createRandomClientPayload()
        // get request to fetch all clients
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            }

        }).then((response => {
            cy.log(response.body.length -1)
            let lastID = response.body[response.body.length -1].id
            cy.request({
                method: "PUT",
                url: ENDPOINT_GET_CLIENT + lastID,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body: fakeClientPayload
            }).then((response => {
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(fakeClientPayload.name)
            }))
        }))
        
        logout(cy)
     
    }))

}

//Logga ut
function logout(cy){
cy.request({
    method: "POST",
    url: 'http://localhost:3000/api/logout',
    headers: {
        'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
        'Content-Type': 'application/json'
    }

}).then((response => {
        const responseAsString = JSON.stringify(response.body)
        cy.log(responseAsString)
        expect(responseAsString).to.have.string('OK')
    }))
}


module.exports = {
    createClientRequest,
    deleteRequestAfterGet,
    editRequestAfterGet
}