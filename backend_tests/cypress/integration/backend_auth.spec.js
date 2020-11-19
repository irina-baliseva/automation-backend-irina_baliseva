/// <reference types="cypress" />

//curl "http://localhost:3000/api/login" 
//-H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0" 
//-H "Accept: application/json" 
//-H "Accept-Language: en-US,en;q=0.5" 
//--compressed -H "Referer: http://localhost:3000/login" 
//-H "Content-Type: application/json;charset=UTF-8" 
//-H "Origin: http://localhost:3000" 
//-H "Connection: keep-alive" 
//--data-raw "{""username"":""tester01"",""password"":""GteteqbQQgSr88SwNExUQv2ydb7xuf8c""}"

import * as clientHelpers from '../helpers/clientHelpers'
import * as roomHelpers from '../helpers/roomHelpers'

describe('testing auth', function(){
   

    it('Test case 1- create a client', function(){
        clientHelpers.createClientRequest(cy)
        })

   it('Test case 2- edit a cliet', function(){
        clientHelpers.editRequestAfterGet(cy)
        })
    
   it('Test case 3- delete a cliet', function(){
        clientHelpers.deleteRequestAfterGet(cy)
    })

    it('Test case 4- create a room', function(){
        roomHelpers.createRoomRequest(cy)
        })

    it('Test case 5- delete a room', function(){
        roomHelpers.deleteRequestRoomAfterGet(cy)
    }) 
    
    
})