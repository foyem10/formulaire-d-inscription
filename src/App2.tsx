import { useState, useRef, useEffect } from 'react'
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

  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)
  const [ready, setReady] = useState(false)

  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ isDown: false, startX: 0, startScroll: 0 })

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

  // Centre le scroll horizontalement au chargement + calcule si des fondus sont nécessaires
  function updateFades() {
    const el = scrollerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setShowLeftFade(el.scrollLeft > 4)
    setShowRightFade(el.scrollLeft < maxScroll - 4)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const maxScroll = el.scrollWidth - el.clientWidth
    el.scrollLeft = maxScroll / 2
    updateFades()

    const onResize = () => updateFades()
    window.addEventListener('resize', onResize)

    const t = setTimeout(() => setReady(true), 30)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [])

  // Glisser à la souris (drag-to-scroll) — le tactile fonctionne nativement
  function onMouseDown(e: React.MouseEvent) {
    const el = scrollerRef.current
    if (!el) return
    dragState.current = { isDown: true, startX: e.pageX, startScroll: el.scrollLeft }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragState.current.isDown) return
    const el = scrollerRef.current
    if (!el) return
    e.preventDefault()
    const delta = e.pageX - dragState.current.startX
    el.scrollLeft = dragState.current.startScroll - delta
  }
  function stopDrag() {
    dragState.current.isDown = false
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .form-scroller {
          scrollbar-width: thin;
          scrollbar-color: #1a1a2e #e9ecef;
        }
        .form-scroller::-webkit-scrollbar {
          height: 8px;
        }
        .form-scroller::-webkit-scrollbar-track {
          background: #e9ecef;
          border-radius: 8px;
        }
        .form-scroller::-webkit-scrollbar-thumb {
          background: #1a1a2e;
          border-radius: 8px;
        }
        .form-scroller::-webkit-scrollbar-thumb:hover {
          background: #33334d;
        }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem 0' }}>

        <div style={{ position: 'relative', width: '100%' }}>

          {/* Fondu gauche indiquant qu'on peut glisser */}
          <div
            style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '48px',
              background: 'linear-gradient(to right, #f8f9fa, transparent)',
              pointerEvents: 'none', zIndex: 2,
              opacity: showLeftFade ? 1 : 0, transition: 'opacity 0.3s ease',
            }}
          />
          {/* Fondu droit */}
          <div
            style={{
              position: 'absolute', top: 0, bottom: 0, right: 0, width: '48px',
              background: 'linear-gradient(to left, #f8f9fa, transparent)',
              pointerEvents: 'none', zIndex: 2,
              opacity: showRightFade ? 1 : 0, transition: 'opacity 0.3s ease',
            }}
          />

          <div
            ref={scrollerRef}
            className="form-scroller"
            onScroll={updateFades}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              padding: '0.5rem 1.5rem 1rem',
              cursor: dragState.current.isDown ? 'grabbing' : 'grab',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              className="card shadow-sm border-0 overflow-hidden mx-auto"
              style={{
                width: '950px',
                minWidth: '950px',
                opacity: ready ? 1 : 0,
                animation: ready ? 'fadeSlideUp 0.5s ease-out' : 'none',
                userSelect: dragState.current.isDown ? 'none' : 'auto',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'nowrap' }}>

                {/* Colonne gauche — branding */}
                <div
                  className="d-flex flex-column justify-content-between text-white p-4"
                  style={{ background: '#1a1a2e', flex: '0 0 316px', width: '316px' }}
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
                <div style={{ flex: '0 0 634px', width: '634px' }}>
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

                          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ flex: '1 1 33.333%', minWidth: 0 }}>
                              <label htmlFor="Nom" className="form-label small text-secondary">Nom</label>
                              <input
                                type="text"
                                id="Nom"
                                className="form-control"
                                value={Nom}
                                onChange={(e) => setNom(e.target.value)}
                              />
                            </div>
                            <div style={{ flex: '1 1 33.333%', minWidth: 0 }}>
                              <label htmlFor="Age" className="form-label small text-secondary">Date de naissance</label>
                              <input
                                type="date"
                                id="Age"
                                className="form-control"
                                value={Age}
                                onChange={(e) => setAge(e.target.value)}
                              />
                            </div>
                            <div style={{ flex: '1 1 33.333%', minWidth: 0 }}>
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

                          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ flex: '1 1 50%', minWidth: 0 }}>
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
                            <div style={{ flex: '1 1 50%', minWidth: 0 }}>
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

                          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ flex: '1 1 50%', minWidth: 0 }}>
                              <label htmlFor="Profession" className="form-label small text-secondary">Profession</label>
                              <input
                                type="text"
                                id="Profession"
                                className="form-control"
                                value={Profession}
                                onChange={(e) => setProfession(e.target.value)}
                              />
                            </div>
                            <div style={{ flex: '1 1 50%', minWidth: 0 }}>
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

                          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{ flex: '1 1 50%', minWidth: 0 }}>
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
                            <div style={{ flex: '1 1 50%', minWidth: 0 }}>
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
        </div>
      </div>
    </>
  )
}

export default App