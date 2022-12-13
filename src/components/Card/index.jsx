import _ from 'lodash';
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context';
import { updateCardsBetweenLists, updateCardsSameList } from '../../store/actions';
import { saveToLocal } from '../../utils';


function Card({ card,
    onUpdateCardsSameList,
    onUpdateCardsBetweenLists }) {
    const { id, content, listId } = card
    // console.log(onUpdateCardsSameList);
    const [value, setValue] = useState(content)

    const { dispatchList, initialData } = useContext(Context)

    // useEffect(() => {
    //     setValue(content)
    // }, [card]);

    const handleChangeCardContent = (e) => {
        setValue(e.target.value)
        const data = _.cloneDeep(initialData)
        const list = data.lists.find(list => list.id == listId)
        const card = list.cards.find(card => card.id == id)
        card.content = e.target.value
        saveToLocal("data", data)
    }





    // DnD

    var onDragCoordDiff = {}

    const handleDragStart = e => {
        e.stopPropagation()

        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(img, 0, 0);

        const currentTarget = e.currentTarget
        const listWrapperEl = currentTarget.closest(".list-content")

        e.dataTransfer.setData("text", currentTarget.id + "&" + listWrapperEl.id);


        const cloneCardEl = e.currentTarget.cloneNode(true)
        cloneCardEl.id = 'clone-card-element'
        cloneCardEl.style.display = "none"
        e.currentTarget.after(cloneCardEl)


        onDragCoordDiff = {
            dx: e.currentTarget.getBoundingClientRect().x - e.clientX,
            dy: e.currentTarget.getBoundingClientRect().y - e.clientY
        }

    }

    const handleOnDrag = e => {
        e.stopPropagation()

        const diffX = onDragCoordDiff.dx
        const diffY = onDragCoordDiff.dy


        
        e.currentTarget.style.pointerEvents = 'none'
        e.currentTarget.style.position = 'fixed'
        e.currentTarget.style.width = '256px'
        e.currentTarget.style.left = e.clientX + diffX + 'px'
        e.currentTarget.style.top = e.clientY + diffY + 'px'
        e.currentTarget.style.transform = 'rotate(3deg)'
        e.currentTarget.style.zIndex = 2500

        const cloneCardEle = document.getElementById("clone-card-element")
        cloneCardEle.style.display = "block"
        cloneCardEle.querySelector("textarea").style.visibility = 'hidden'
        cloneCardEle.style.backgroundColor = "rgba(0, 0, 0, 0.2)"

    }

    const handleDragEnd = e => {
        e.stopPropagation()

        e.currentTarget.style.pointerEvents = 'auto'
        e.currentTarget.style.position = 'relative'
        e.currentTarget.style.width = '256px'
        e.currentTarget.style.left = 0
        e.currentTarget.style.top = 0
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.zIndex = 0
        console.log('drag end', e)


        document.getElementById("clone-card-element").remove()

    }

    const handleOnDrop = e => {
        e.preventDefault()
        // e.stopPropagation()
        const data = e.dataTransfer.getData("text")

        if (!data.includes("&")) return
        const dropCardTarget = e.currentTarget
        const dropListTarget = dropCardTarget.closest(".list-content")
        const [dragCardId, dragListId] = data.split("&")
        const dropCardId = dropCardTarget.id
        const dropListId = dropListTarget.id

        // console.log(dragCardId, dragListId, dropCardId, dropListId)

        // do nothing if drop and drag is the same element
        if (dragCardId == dropCardId) return

        // if card is dnd within the same list
        if (dragListId == dropListId) {
            console.log("Same col")

            // dispatchList(updateCardsSameList({
            //     listId: dropListId,
            //     dragCardId,
            //     dropCardId
            // }))

            // lift up state back to List component
            onUpdateCardsSameList({
                listId: dropListId,
                dragCardId,
                dropCardId
            })

        } else {
            console.log("Diff col", dragListId, dragCardId, dropListId, dropCardId)

            dispatchList(updateCardsBetweenLists({
                dragListId,
                dragCardId,
                dropListId,
                dropCardId,
            }))

            //   onUpdateCardsBetweenLists({
            //     dragListId,
            //     dragCardId,
            //     dropListId,
            //     dropCardId,
            //   })


        }

        // const targetListId = e.currentTarget.closest(".list-content").id

    }



    ////////////////////////////////////////
    const handleAddDraggable = (e) => {
        e.stopPropagation()
        e.currentTarget.closest(".list-card-wrapper").setAttribute("draggable", true)
    }

    const handleRemoveDraggable = (e) => {
        e.stopPropagation()
        e.currentTarget.closest(".list-card-wrapper").setAttribute("draggable", false)
    }

    return (
        <div className='list-card-wrapper'
            id={id}
            // draggable
            onDragStart={handleDragStart}
            onDrag={handleOnDrag}
            onDragEnd={handleDragEnd}
            // onClick={handleOnClick}
            // onDragOver={handleDragOver}
            onDrop={handleOnDrop}
            onMouseDown={handleAddDraggable}
            onMouseUp={handleRemoveDraggable}

        >
            <textarea className="list-card-detail" value={value} onChange={handleChangeCardContent} />
        </div>
    )
}

export default Card