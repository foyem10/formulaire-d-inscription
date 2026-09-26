import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [Nom, setNom] = useState('')
  const [Age, setAge] = useState('')
  const [Lieu, setLieu] = useState('')
  const [Tel, setTel] = useState('')
  const [Email, setEmail] = useState('')
  const [Profession, setProfession] = useState('')
  const [Residence, setResidence] = useState('Cameroun')
  const [Password, setPassword] = useState('')
  const [Password2, setPassword2] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [chargement, setChargement] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [password2Error, setPassword2Error] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

  function validateEmail(value: string): boolean {
    if (value.trim() === '') {
      setEmailError("L'email est requis.")
      return false
    }
    if (!emailRegex.test(value)) {
      setEmailError('Email invalide (ex: nom@domaine.com).')
      return false
    }
    setEmailError('')
    return true
  }

  function validatePassword(value: string): boolean {
    if (value.trim() === '') {
      setPasswordError('Le mot de passe est requis.')
      return false
    }
    if (!passwordRegex.test(value)) {
      setPasswordError('Min. 8 caractères, avec 1 majuscule, 1 minuscule et 1 chiffre.')
      return false
    }
    setPasswordError('')
    return true
  }

  function validatePassword2(value: string, original: string): boolean {
    if (value.trim() === '') {
      setPassword2Error('Veuillez confirmer le mot de passe.')
      return false
    }
    if (value !== original) {
      setPassword2Error('Les mots de passe ne correspondent pas.')
      return false
    }
    setPassword2Error('')
    return true
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
    if (Password2) validatePassword2(Password2, value)
  }

  function handlePassword2Change(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPassword2(value)
    validatePassword2(value, Password)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const isEmailValid = validateEmail(Email)
    const isPasswordValid = validatePassword(Password)
    const isPassword2Valid = validatePassword2(Password2, Password)

    if (!isEmailValid || !isPasswordValid || !isPassword2Valid) {
      return
    }

    setChargement(true)

    try {
      const response = await fetch('http://localhost:8000/api/utilisateurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nom: Nom,
          age: Age,
          lieu: Lieu,
          tel: Tel,
          email: Email,
          profession: Profession,
          residence: Residence,
          password: Password,
          password_confirmation: Password2,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error(result.errors)
        alert('Erreur : ' + JSON.stringify(result.errors))
        setChargement(false)
        return
      }

      setEnvoye(true)
    } catch (error) {
      console.error('Erreur réseau :', error)
      alert('Impossible de contacter le serveur.')
      setChargement(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm border-0 overflow-hidden" style={{ maxWidth: '950px', width: '100%', margin: '2rem' }}>
        <div className="row g-0">

          {/* Colonne gauche — branding */}
          <div
            className="col-lg-4 d-none d-lg-flex flex-column justify-content-between text-white p-4"
            style={{ background: '#1a1a2e' }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-5">
                <i className="bi bi-person-circle fs-4"></i>
                
              </div>
              <h1 className="h4 fw-semibold mb-3">Rejoignez la communauté</h1>
              <p className="small" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Créez votre compte en quelques secondes et accédez à votre espace personnel.
              </p>
            </div>
            <div className="d-flex flex-column gap-3 mt-5">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-check"></i>
                <span className="small" style={{ color: 'rgba(255,255,255,0.7)' }}>Mot de passe chiffré</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge"></i>
                <span className="small" style={{ color: 'rgba(255,255,255,0.7)' }}>Inscription rapide</span>
              </div>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="col-lg-8">
            <div className="p-4 p-md-5">

              {envoye ? (
                <div className="text-center py-5">
                  <i className="bi bi-check-circle-fill text-success mb-3" style={{ fontSize: '3rem' }}></i>
                  <h2 className="h4 fw-semibold mb-2">Compte créé avec succès</h2>
                  <p className="text-muted">Merci {Nom}, ton compte a bien été enregistré.</p>
                </div>
              ) : (
                <>
                  
                  <h2 className="h5 fw-semibold mb-4">Informations du compte</h2>

                  <form onSubmit={handleSubmit} noValidate>

                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label htmlFor="Nom" className="form-label small text-secondary">Nom</label>
                        <input
                          type="text"
                          id="Nom"
                          className="form-control"
                          value={Nom}
                          onChange={(e) => setNom(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="Age" className="form-label small text-secondary">Date de naissance</label>
                        <input
                          type="date"
                          id="Age"
                          className="form-control"
                          value={Age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="Lieu" className="form-label small text-secondary">Lieu</label>
                        <input
                          type="text"
                          id="Lieu"
                          className="form-control"
                          placeholder="Lieu de naissance"
                          value={Lieu}
                          onChange={(e) => setLieu(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label htmlFor="Email" className="form-label small text-secondary">Email</label>
                        <input
                          type="email"
                          id="Email"
                          className={`form-control ${emailError ? 'is-invalid' : Email ? 'is-valid' : ''}`}
                          value={Email}
                          onChange={handleEmailChange}
                        />
                        {emailError && <div className="invalid-feedback">{emailError}</div>}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="Tel" className="form-label small text-secondary">Téléphone</label>
                        <input
                          type="tel"
                          id="Tel"
                          className="form-control"
                          value={Tel}
                          onChange={(e) => setTel(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label htmlFor="Profession" className="form-label small text-secondary">Profession</label>
                        <input
                          type="text"
                          id="Profession"
                          className="form-control"
                          value={Profession}
                          onChange={(e) => setProfession(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="Residence" className="form-label small text-secondary">Résidence</label>
                        <select
                          id="Residence"
                          className="form-select"
                          value={Residence}
                          onChange={(e) => setResidence(e.target.value)}
                        >
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

                    <div className="row g-3 mb-2">
                      <div className="col-md-6">
                        <label htmlFor="Password" className="form-label small text-secondary">Mot de passe</label>
                        <input
                          type="password"
                          id="Password"
                          className={`form-control ${passwordError ? 'is-invalid' : Password ? 'is-valid' : ''}`}
                          value={Password}
                          onChange={handlePasswordChange}
                        />
                        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="Password2" className="form-label small text-secondary">Confirmation</label>
                        <input
                          type="password"
                          id="Password2"
                          className={`form-control ${password2Error ? 'is-invalid' : Password2 ? 'is-valid' : ''}`}
                          value={Password2}
                          onChange={handlePassword2Change}
                        />
                        {password2Error && <div className="invalid-feedback">{password2Error}</div>}
                      </div>
                    </div>
                    <p className="small text-muted mb-4">8 caractères min., 1 majuscule, 1 minuscule, 1 chiffre.</p>

                    <button
                      type="submit"
                      className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                      disabled={chargement}
                    >
                      {chargement ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          Création en cours...
                        </>
                      ) : (
                        <>
                          Créer mon compte
                          <i className="bi bi-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App