
const faker =require('faker')
const ENDPOINT_GET_ROOMS= 'http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOM= 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM= 'http://localhost:3000/api/room/'

function createRandomRoomPayload (){
    const fakeRoomNumber= faker.random.number({min:100, max:150})
    const fakeFloorField=faker.random.number(8)
    const fakePriceField=faker.random.number({min:1000, max:3000})

    const payload= {
        "features":["ensuite"],
        "category":"single",
        "number":fakeRoomNumber,
        "floor":fakeFloorField,
        "available":true,
        "price":fakePriceField
    }

    return payload
}

function getRequestAllRooms(cy, features, category, number, floor, available, price){
        // get request to fetch all rooms
       cy.request({
        method:"GET",
        url: ENDPOINT_GET_ROOMS,
        headers:{
            'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        }

    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect (responseAsString).to.have.string(features)
        expect (responseAsString).to.have.string(category)
        expect (responseAsString).to.have.string(number)
        expect (responseAsString).to.have.string(floor)
        expect (responseAsString).to.have.string(available)
        expect (responseAsString).to.have.string(price)
    }))
}

//Skapa rum
function createRoomRequest(cy){
    cy.Session().then((response =>{

        let fakeRoomPayload= createRandomRoomPayload()

        //post request to create a room
        cy.request({
            method:"POST",
            url:ENDPOINT_POST_ROOM,
            headers:{
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeRoomPayload

        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect (responseAsString).to.have.string(fakeRoomPayload.number)
        }))

        getRequestAllRooms(cy, fakeRoomPayload.features, fakeRoomPayload.category, fakeRoomPayload.number, 
                            fakeRoomPayload.floor, fakeRoomPayload.available, fakeRoomPayload.price)
    }
    ))
       
}

//Ta bort rum
function deleteRequestRoomAfterGet(cy){
    cy.Session().then((response =>{

// get request to fetch all rooms
   cy.request({
    method:"GET",
    url: ENDPOINT_GET_ROOMS,
    headers:{
        'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
        'Content-Type': 'application/json'
    }

}).then((response => {
    let lastID = response.body[response.body.length -1].id
    cy.request({
        method:"DELETE",
        url: ENDPOINT_GET_ROOM+lastID,
        headers:{
            'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        }
    }).then((response =>{
        const responseAsString = JSON.stringify(response.body)
        cy.log(responseAsString)
        expect(responseAsString).to.have.string('true')
    }))
}))

    }))
    
}

module.exports={
    createRoomRequest,
    deleteRequestRoomAfterGet
}