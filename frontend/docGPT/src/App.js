import logo from './Components/Assets/docGPTLogo.svg';
import './App.css';
import FacebookLogin from '@greatsumini/react-facebook-login';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import Home from './Components/HomePage/Home';
import Info from './Components/InfoPage/Info';
import Chat from './Components/Chat/Chat';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  let inicio = false;

  function getComp() {
    /*if(inicio){
      return(<LoginForm></LoginForm>);
    } else {
      return(<RegisterForm></RegisterForm>);
    }*/
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/info' element={<Info />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/chat/:userID' element={<Chat />} />
        </Routes>
      </Router>
      <header className="App-header">
        {getComp()}
        {/*<img src={logo} className="App-logo" alt="logo" />
        <h1>
          DOC GPT
        </h1>
        <FacebookLogin
          appId="1082300983025211"
          icon="fa-facebook"
          style={{
            backgroundColor: '#4267b2',
            color: '#fff',
            fontSize: '16px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
          }}
          onSuccess={(response) => {
            console.log('Login Success!', response);
          }}
          onFail={(error) => {
            console.log('Login Failed!', error);
          }}
          onProfileSuccess={(response) => {
            console.log('Get Profile Success!', response);
          }}
        />
        */}
      </header>
    </div>
  );
}

export default App;
