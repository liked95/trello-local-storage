import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import List from './components/List';
import AddList from './components/AddList';
import { useContext, useEffect, useState } from 'react';
import { Context } from './context';


import { reorder } from './utils';



function App() {
  const { initialData } = useContext(Context)

  // console.log(initialData)
  const [boardLists, setBoardLists] = useState([])


  useEffect(() => {
    let lists = reorder(initialData.lists, initialData.listOrder, 'id')
    // console.log(initialData.lists)
    setBoardLists(lists)
  }, [initialData])

  // const handleOnChangeListOrder = (newListOrder) => {
  //   // let lists = reorder(initialData.lists, newListOrder, 'id')
  //   setBoardLists(newListOrder)
  //   // console.log(lists);
  //   // console.log(newListOrder);
  // }

  let deleteData = null
  // get what dragCardId to delete from dragListId from List component 
  // and then pass these data to another List
  const handleGetDragList = (value) => {
    console.log("value >> ", value)
    // setDeleteData(value)
    deleteData = value

    // pass to drag list
  }

  const handleDeleteDragCard = (value) => {
    console.log("value to delete >> ", value)
  }


  return (
    <div className="App">
      <div className='dashboard'  >
        <div className='dashboard-columns'>
          {boardLists.map((list) => <List
            list={list}
            key={list.id}
            // onHandleGetDragList={handleGetDragList}
            // onHandleDeleteDragCard={handleDeleteDragCard}
            // deleteData={deleteData}
          />)}
        </div>
        <AddList />
      </div>
    </div>


  );
}

export default App;
