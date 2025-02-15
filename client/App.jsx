import React from 'react';
import { useState, useEffect } from 'react';
import CodeViewer from './components/CodeViewer.jsx';
import QuestionsList from './components/QuestionsList.jsx';
import AuthenticationButtons from './Authentication.jsx'
import CodeEditor from './components/CodeEditor.jsx'
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './profile.jsx'

const App = () => {
// STATE HOOKS
  const [title, setTitle] = useState(title);
  const [description, setDescription] = useState(description);
  const [solution, setSolution] = useState(solution);
  const [comments, setComments] = useState(comments);
  const [titleCards, setTitleCards] = useState({titles: []});

  // FUNCTION THAT QUERIES DB AND UPDATES STATE
  const fetchAndUpdateTitles = async () => {
    try {
      const response = await fetch('api/listProblems'); //we need a router that gets us to the readProblemTitles middleware
      const titles = await response.json();
      setTitleCards(titles);
    } catch (error) {
      console.error('Error fetching titles: ', error);
    }
  };
  
  //FUNCTION THAT ACCESSES DATA

  const handleAccessDataClick = async (e)=> {
    const clickedTitle = e.target.title;
    console.log(32,clickedTitle)
    try {
      //readProblem sends title on req.body
      const response = await fetch(`/api/readProblem`, {
        //title
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({title: clickedTitle})
      });
      const data = await response.json();
      console.log(42, data)
      const { title, description, solution, comments } = data;
      setTitle(title);
      setDescription(description);
      setSolution(solution);
      // cm.setValue(solution)
      setComments(comments);
    }
    catch (error) {
      console.log('There was an error accessing the data: ', error)
    }
  };
  
  //FUNCTION THAT DELETES A TITLE
  const handleDeleteClick = async (e) => {
    const clickedTitle = e.target.title;
    try {
      console.log('Clicked Title for delete', clickedTitle);
      const response = await fetch('api/deleteProblem', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({title: 
          clickedTitle})
      });
      fetchAndUpdateTitles();
    }
    catch (error) {
      console.log('There was an error deleting the title: ', error)
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setTitle('');
    setDescription('');
    setSolution('');
    setComments('');
  };

  //FUNCTION THAT ADDS A NEW PROBLEM
  const handleAddTitle = async (e) => {
    e.preventDefault();
    //const { user } = useAuth0();

    const newProblem = {
      title,
      description,
      solution,
      comments,
      // created_by
    };

    if(titleCards.titles.includes(title)){
      try {
        await fetch('api/updateProblem', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProblem),
        });
      } catch (err) {
        console.log('There was an error updating the title', err);
      }
    } 
    else {
      try {
        await fetch('api/createProblem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProblem),
        });
      } 
      catch (err) {
        console.log('There was an error creating the title', err);
      }
    }
    fetchAndUpdateTitles();
    handleClear(e);
  };


  
  // LOAD TITLES ON INITIAL PAGE RENDER
  useEffect(() => {
    fetchAndUpdateTitles();
  }, []);
  const { isAuthenticated } = useAuth0();
  return (
    <div className='App'>
      {isAuthenticated && (<>
      <QuestionsList value="tbu" title={title} handleDeleteClick={handleDeleteClick} handleAccessDataClick={handleAccessDataClick} titleCards={titleCards}/>
      <CodeViewer value="tbu" title={title} description={description} solution={solution} comments ={comments} handleClear = {handleClear} handleAccessDataClick={handleAccessDataClick} setTitle={setTitle} setDescription={setDescription} setSolution={setSolution} setComments={setComments} handleAddTitle={handleAddTitle}/>
      {/* <CodeEditor/> */}
      </>
      )}
      <nav>
        <Profile />
        <AuthenticationButtons />
      </nav>
    </div>
  )
}

export default App;
