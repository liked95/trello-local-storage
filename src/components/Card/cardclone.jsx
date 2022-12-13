import React, { useState, useEffect } from 'react'

function Card({ card }) {
    const { id, content } = card
    const [value, setValue] = useState(content)

    useEffect(() => {
        setValue(content)
    }, [card]);

    const handleChangeCardContent = (e) => {
        setValue(e.target.value)
    }





    // DnD
    var onCardDragCoordDiff = {}

    const handleDragStart = (e) => {
        // e.preventDefault()
        e.stopPropagation()
        console.log(e)
        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(img, 0, 0);

        e.dataTransfer.setData("text", e.target.id);

        // const clonedEle = e.target.cloneNode(true)
        // clonedEle.id = 'clone-card-element'
        // clonedEle.style.display = "none"
        // console.log(e.currentTarget)
        // // e.currentTarget.closest(".list-cards").appendChild(clonedEle)
        // e.target.after(clonedEle)

        onCardDragCoordDiff = {
            dx: e.currentTarget.getBoundingClientRect().x - e.clientX,
            dy: e.currentTarget.getBoundingClientRect().y - e.clientY
        }
    }

    const handleOnDrag = e => {
        // e.preventDefault()
        e.stopPropagation()
        // console.log(e)
        // style source element
        // e.target.style.display = "none"
        
        e.currentTarget.style.pointerEvents = 'none'


        const diffX = onCardDragCoordDiff.dx
        const diffY = onCardDragCoordDiff.dy
        console.log(diffX, diffY)

        const sourceEle = e.currentTarget
        // console.log(e)
        sourceEle.style.position = 'fixed'
        sourceEle.style.width = '256px'
        sourceEle.style.left = e.clientX + diffX + 'px'
        sourceEle.style.top = e.clientY + diffY + 'px'
        sourceEle.style.rotate = "5deg"
        sourceEle.style.zIndex = 2000

        // const cloneEle = document.getElementById("clone-card-element")
        // cloneEle.style.display = "block"
        // cloneEle.querySelector("textarea").style.visibility = "hidden"
        // cloneEle.style.backgroundColor = "rgba(0, 0, 0, 0.1)"
    }

    const handleDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // allow user to drag again 
        e.currentTarget.style.pointerEvents = 'auto'
        // reset style
        e.currentTarget.style.rotate = "0deg"
        e.currentTarget.style.position = 'relative'
        e.currentTarget.style.left = 0
        e.currentTarget.style.top = 0
        e.currentTarget.style.zIndex = 0
        e.currentTarget.style.display = "block"



        //disable drag attribute when mouse release
        // let allLists = Array.from(document.querySelectorAll(".list-content"))
        // allLists.forEach(list => list.setAttribute('draggable', false))

        // document.getElementById("clone-card-element").remove()

        // reset coordinate
        onCardDragCoordDiff = {}

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
            // onDrop={handleOnDrop}
            onMouseDown={handleAddDraggable}
            onMouseUp={handleRemoveDraggable}

        >
            <textarea className="list-card-detail" value={value} onChange={handleChangeCardContent} />
        </div>
    )
}

export default Card