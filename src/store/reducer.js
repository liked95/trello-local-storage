import { ADD_CARD, ADD_LIST, DELETE_LIST, UPDATE_LIST_ORDER, UPDATE_CARDS_BETWEEN_LISTS, UPDATE_DROP_HEADING, UPDATE_EMPTY_LIST } from "./constants"
import _ from 'lodash'
import { deleteFromArr, saveToLocal } from "../utils"

export const initialListState = {
    listOrder: ['list-1', 'list-2', 'list-3'],
    lists: [
        {
            id: 'list-1',
            title: "My title 1",
            cardOrder: ['card-2', 'card-1', 'card-3'],
            cards: [
                {
                    id: 'card-1',
                    listId: 'list-1',
                    content: "First 1",
                },
                {
                    id: 'card-2',
                    listId: 'list-1',
                    content: "First 2",
                },
                {
                    id: 'card-3',
                    listId: 'list-1',
                    content: "First 3",
                },
            ]
        },
        {
            id: 'list-2',
            title: "My title 2",
            cardOrder: ['card-5', 'card-4', 'card-6'],
            cards: [
                {
                    id: 'card-4',
                    listId: 'list-2',
                    content: "Second 4",
                },
                {
                    id: 'card-5',
                    listId: 'list-2',
                    content: "Second 5",
                },
                {
                    id: 'card-6',
                    listId: 'list-2',
                    content: "Second 6",
                },
            ]
        },
        {
            id: 'list-3',
            title: "My title 3",
            cardOrder: ['card-8', 'card-7', 'card-9', 'card-10', 'card-11'],
            cards: [
                {
                    id: 'card-7',
                    listId: 'list-3',
                    content: "Third 7",
                },
                {
                    id: 'card-8',
                    listId: 'list-3',
                    content: "Third 8",
                },
                {
                    id: 'card-9',
                    listId: 'list-3',
                    content: "Third 9",
                },
                {
                    id: 'card-10',
                    listId: 'list-3',
                    content: "Third 10",
                },
                {
                    id: 'card-11',
                    listId: 'list-3',
                    content: "Third 11",
                },
            ]
        }
    ]
}

const listReducer = (state, action) => {
    let clonedState = _.cloneDeep(state)
    switch (action.type) {
        case ADD_LIST: {
            const listOrder = [...clonedState.listOrder, action.payload.id]
            const lists = _.cloneDeep(clonedState.lists)
            lists.push({
                id: action.payload.id,
                title: action.payload.title,
                cards: action.payload.cards,
                cardOrder: action.payload.cardOrder,

            })


            saveToLocal("data", { ...clonedState, listOrder, lists })
            return { ...clonedState, listOrder, lists }
        }

        case DELETE_LIST: {
            let listId = action.payload
            console.log(listId)

            let listOrderIdx = clonedState.listOrder.indexOf(listId)
            clonedState.listOrder.splice(listOrderIdx, 1)

            let listIdx = clonedState.lists.findIndex(list => list.id == listId)
            clonedState.lists.splice(listIdx, 1)

            const newState = {
                ...clonedState,
                listOrder: clonedState.listOrder,
                lists: clonedState.lists
            }

            console.log(newState)
            saveToLocal("data", newState)
            return newState
        }

        case ADD_CARD: {
            console.log(action.payload)
            const { listId, id, content } = action.payload
            const lists = _.cloneDeep(clonedState.lists)

            lists.map(list => {
                if (list.id !== listId) {
                    return list
                }

                // if listId is matched
                list.cards.push({
                    id,
                    listId,
                    content,
                })

                list.cardOrder.push(id)
                return list
            })

            console.log(lists)

            saveToLocal("data", { ...clonedState, lists })
            return { ...clonedState, lists }
        }

        case UPDATE_LIST_ORDER: {
            // console.log(action.payload)
            let newState = { ...clonedState, listOrder: action.payload }

            saveToLocal("data", newState)

            return newState
        }

        case UPDATE_CARDS_BETWEEN_LISTS: {

            const { dragListId, dragCardId, dropListId, dropCardId } = action.payload
            // console.log(dragListId, dragCardId, dropListId, dropCardId)
            const lists = clonedState.lists
            const dragList = lists.find(list => list.id == dragListId)
            // Remove dragCardId from cardOrder 
            deleteFromArr(dragCardId, dragList.cardOrder)
            // Remove Card from DragList
            let dragCardIdx = dragList.cards.findIndex(card => card.id == dragCardId)
            let removedCard = dragList.cards.splice(dragCardIdx, 1)[0]
            // console.log(removedCard, dragList)

            // insert into dropListCardOrder
            const dropList = lists.find(list => list.id == dropListId)
            const dropCardOrderIdx = dropList.cardOrder.indexOf(dropCardId)
            dropList.cardOrder.splice(dropCardOrderIdx + 1, 0, dragCardId)

            // Insert removedCard into DropList
            removedCard.listId = dropListId
            const dropCardIdx = dropList.cards
            dropList.cards.splice(dropCardIdx + 1, 0, removedCard)


            // console.log(dropList)

            let newState = { ...clonedState, lists }


            saveToLocal("data", newState)

            return newState
        }

        case UPDATE_DROP_HEADING: {
            console.log(action.payload)
            const { dropListId, dragCardId, dragListId } = action.payload

            const lists = clonedState.lists
            const dragList = lists.find(list => list.id == dragListId)
            // Remove dragCardId from cardOrder 
            deleteFromArr(dragCardId, dragList.cardOrder)
            // Remove Card from DragList
            let dragCardIdx = dragList.cards.findIndex(card => card.id == dragCardId)
            let removedCard = dragList.cards.splice(dragCardIdx, 1)[0]


            // insert into dropListCardOrder
            const dropList = lists.find(list => list.id == dropListId)
            dropList.cardOrder.unshift(dragCardId)

            // Insert removedCard into DropList
            removedCard.listId = dropListId 
            dropList.cards.unshift(removedCard)

            let newState = {...clonedState, lists}
            saveToLocal("data", newState)
            return newState
        }


        case UPDATE_EMPTY_LIST: {
            const { dropListId, dragCardId, dragListId } = action.payload
            const lists = clonedState.lists
            const dragList = lists.find(list => list.id == dragListId)
            // Remove dragCardId from cardOrder 
            deleteFromArr(dragCardId, dragList.cardOrder)
            // Remove Card from DragList
            let dragCardIdx = dragList.cards.findIndex(card => card.id == dragCardId)
            let removedCard = dragList.cards.splice(dragCardIdx, 1)[0]


            // insert into dropListCardOrder
            const dropList = lists.find(list => list.id == dropListId)
            dropList.cardOrder.unshift(dragCardId)

            // Insert removedCard into DropList
            removedCard.listId = dropListId
            removedCard.listId = dropListId
            dropList.cards.unshift(removedCard)

            let newState = {...clonedState, lists}
            saveToLocal("data", newState)

            return newState
        }


        default:
            return state
    }
}



export default listReducer 
