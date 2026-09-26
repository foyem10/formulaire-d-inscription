import { useState } from 'react' /*pour controler les champs du formulaire*/
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [Nom, setNom] = useState('')
  const [Lieu, setLieu] = useState('')
  const [Tel, setTel] = useState('')
  const [Email, setEmail] = useState('')
  const [Profession, setProfession] = useState('')    /*pour controler les champs du formulaire*/
  const [Password, setPassword] = useState('')
  const [Password2, setPassword2] = useState('')
  const [envoye, setEnvoye] = useState(false)



  function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // empêche le rechargement de la page
    setEnvoye(true)
  }


  return (
    
   <div className='container'>
  
      <h1>Creer votre compte</h1>
      {envoye ? (
        <p>Merci {Nom}, ton message a bien été envoyé </p>
      ) : (
    <form onSubmit={handleSubmit}>


      <div className='row'>
            <div className='col-md-4'>
              <label htmlFor='Nom'>Nom:</label>
              <input type='text' id='Nom' value={Nom} onChange={(e)=> setNom(e.target.value)} />
            </div>
            <div className='col-md-4'>
              <label htmlFor='Date Naissance'>Age:</label>
              <input type='date' id='Age' />
            </div>
            <div className='col-md-4'>
              <label htmlFor='Lieu'>Lieu:</label>
              <input type='text' id='Nom' value={Lieu} placeholder='Lieu de Naissance' onChange={(e)=> setLieu(e.target.value)} />
            </div>
      </div>
      



    <div className='row'>
      <div className='col-md-6'>
        <label htmlFor='Email'>Email:</label>
        <input type='emal' id='Email' value={Email} onChange={(e)=> setEmail(e.target.value)} />
      </div>
      <div className='col-md-6'>  
        <label htmlFor='Tel'>Tel:</label>
        <input type='tel' id='Tel' value={Tel} onChange={(e)=> setTel(e.target.value)} />
      </div> 
    </div>


    <div className='row'>
      <div className='col-md-6'>
        <label htmlFor='Profession'>Profession:</label>
        <input type='emal' id='Profession' value={Profession} onChange={(e)=> setProfession(e.target.value)} />
      </div>
      <div className='col-md-6'>  
        <label>Residence:</label>
        <select>
          <option>Cameroun</option>
          <option>Canada</option>
          <option>Italie</option>
          <option>Allemagne</option>
          <option>USA</option>
          <option>France</option>
          <option>Belgique</option>
          <option>Autre</option>
        </select>
      </div> 


    </div>




    <div className='row'>
        <div className='col-md-6'>
        <label htmlFor='Password'>Password:</label>
        <input type='password' id='Password' value={Password} onChange={(e)=> setPassword(e.target.value)} />
      </div>
      <div className='col-md-6'>  
        <label htmlFor='Confirmer'>Confimer:</label>
        <input type='password' id='Password2' value={Password2} onChange={(e)=> setPassword2(e.target.value)} />
      </div> 
    </div>


    <input type='submit' value='create'/>




         
        
   </form>
       )}
      
    </div>
  
  )
}

export default App
