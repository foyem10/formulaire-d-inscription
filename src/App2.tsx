import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

type FieldName = 'nom' | 'age' | 'lieu' | 'tel' | 'email' | 'profession' | 'password' | 'password2'

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

  const [errors, setErrors] = useState<Record<FieldName, string>>({
    nom: '', age: '', lieu: '', tel: '', email: '', profession: '', password: '', password2: '',
  })
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    nom: false, age: false, lieu: false, tel: false, email: false, profession: false, password: false, password2: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const telRegex = /^[0-9+()\s-]{8,20}$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

  // --- Fonctions de validation pures (réutilisées pour l'affichage ET pour savoir si le formulaire est complet) ---
  function getNomError(v: string): string {
    if (v.trim() === '') return 'Le nom est requis.'
    if (v.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères.'
    return ''
  }
  function getAgeError(v: string): string {
    if (v.trim() === '') return 'La date de naissance est requise.'
    const date = new Date(v)
    if (isNaN(date.getTime())) return 'Date invalide.'
    if (date > new Date()) return 'La date ne peut pas être dans le futur.'
    return ''
  }
  function getLieuError(v: string): string {
    if (v.trim() === '') return 'Le lieu de naissance est requis.'
    return ''
  }
  function getTelError(v: string): string {
    if (v.trim() === '') return 'Le téléphone est requis.'
    if (!telRegex.test(v.trim())) return 'Numéro de téléphone invalide.'
    return ''
  }
  function getEmailError(v: string): string {
    if (v.trim() === '') return "L'email est requis."
    if (!emailRegex.test(v.trim())) return 'Email invalide (ex: nom@domaine.com).'
    return ''
  }
  function getProfessionError(v: string): string {
    if (v.trim() === '') return 'La profession est requise.'
    return ''
  }
  function getPasswordError(v: string): string {
    if (v.trim() === '') return 'Le mot de passe est requis.'
    if (!passwordRegex.test(v)) return 'Min. 8 caractères, avec 1 majuscule, 1 minuscule et 1 chiffre.'
    return ''
  }
  function getPassword2Error(v: string, original: string): string {
    if (v.trim() === '') return 'Veuillez confirmer le mot de passe.'
    if (v !== original) return 'Les mots de passe ne correspondent pas.'
    return ''
  }

  function getPasswordStrength(v: string): { score: number; label: string; color: string } {
    if (!v) return { score: 0, label: '', color: '#e9ecef' }
    let score = 0
    if (v.length >= 8) score++
    if (v.length >= 12) score++
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++
    if (/\d/.test(v)) score++
    if (/[^A-Za-z0-9]/.test(v)) score++

    if (score <= 1) return { score: 1, label: 'Faible', color: '#dc3545' }
    if (score <= 3) return { score: 2, label: 'Moyen', color: '#fd7e14' }
    return { score: 3, label: 'Fort', color: '#198754' }
  }

  // --- Handlers génériques : valident en direct dès que le champ a été "touché" une première fois ---
  function markTouched(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function handleChange(field: FieldName, value: string, validator: (v: string) => string) {
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validator(value) }))
    }
  }

  function handleBlur(field: FieldName, value: string, validator: (v: string) => string) {
    markTouched(field)
    setErrors((prev) => ({ ...prev, [field]: validator(value) }))
  }

  const passwordStrength = getPasswordStrength(Password)


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newErrors: Record<FieldName, string> = {
      nom: getNomError(Nom),
      age: getAgeError(Age),
      lieu: getLieuError(Lieu),
      tel: getTelError(Tel),
      email: getEmailError(Email),
      profession: getProfessionError(Profession),
      password: getPasswordError(Password),
      password2: getPassword2Error(Password2, Password),
    }
    setErrors(newErrors)
    setTouched({
      nom: true, age: true, lieu: true, tel: true, email: true, profession: true, password: true, password2: true,
    })

    const hasError = Object.values(newErrors).some((msg) => msg !== '')
    if (hasError) return

    setChargement(true)

    try {
      const response = await fetch('https://formulaire-d-inscription-api-production.up.railway.app/api/utilisateurs', {
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

  function fieldClass(field: FieldName, value: string): string {
    if (!touched[field]) return 'form-control'
    if (errors[field]) return 'form-control is-invalid'
    if (value) return 'form-control is-valid'
    return 'form-control'
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .signup-card {
          animation: fadeIn 0.4s ease-out;
        }
        .password-toggle {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          z-index: 5;
        }
        .password-toggle:hover {
          color: #212529;
        }
        .password-field-wrapper {
          position: relative;
        }
        .strength-bar {
          height: 4px;
          border-radius: 2px;
          background: #e9ecef;
          overflow: hidden;
          margin-top: 0.4rem;
        }
        .strength-bar-fill {
          height: 100%;
          transition: width 0.25s ease, background-color 0.25s ease;
        }
        .form-control:focus, .form-select:focus {
          border-color: #1a1a2e;
          box-shadow: 0 0 0 0.2rem rgba(26, 26, 46, 0.15);
        }
        @media (max-width: 991.98px) {
          .signup-branding {
            border-radius: 0.5rem 0.5rem 0 0 !important;
          }
        }
      `}</style>

      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
        <div className="signup-card card shadow-sm border-0 overflow-hidden" style={{ maxWidth: '950px', width: '100%' }}>
          <div className="row g-0">

            {/* Colonne gauche — branding */}
            <div
              className="signup-branding col-12 col-lg-4 d-flex flex-column justify-content-between text-white p-4"
              style={{ background: '#1a1a2e' }}
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-4 mb-lg-5">
                  <i className="bi bi-person-circle fs-4"></i>
                </div>
                <h1 className="h4 fw-semibold mb-3">Rejoignez la communauté</h1>
                <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Créez votre compte en quelques secondes et accédez à votre espace personnel.
                </p>
              </div>
              <div className="d-flex flex-row flex-lg-column gap-3 gap-lg-3 mt-4 mt-lg-5 flex-wrap">
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
            <div className="col-12 col-lg-8">
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
                        <div className="col-12 col-sm-6 col-lg-4">
                          <label htmlFor="Nom" className="form-label small text-secondary">Nom</label>
                          <input
                            type="text"
                            id="Nom"
                            className={fieldClass('nom', Nom)}
                            value={Nom}
                            onChange={(e) => { setNom(e.target.value); handleChange('nom', e.target.value, getNomError) }}
                            onBlur={(e) => handleBlur('nom', e.target.value, getNomError)}
                          />
                          {touched.nom && errors.nom && (
                            <div className="invalid-feedback" role="alert">{errors.nom}</div>
                          )}
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4">
                          <label htmlFor="Age" className="form-label small text-secondary">Date de naissance</label>
                          <input
                            type="date"
                            id="Age"
                            className={fieldClass('age', Age)}
                            value={Age}
                            onChange={(e) => { setAge(e.target.value); handleChange('age', e.target.value, getAgeError) }}
                            onBlur={(e) => handleBlur('age', e.target.value, getAgeError)}
                          />
                          {touched.age && errors.age && (
                            <div className="invalid-feedback" role="alert">{errors.age}</div>
                          )}
                        </div>
                        <div className="col-12 col-lg-4">
                          <label htmlFor="Lieu" className="form-label small text-secondary">Lieu</label>
                          <input
                            type="text"
                            id="Lieu"
                            className={fieldClass('lieu', Lieu)}
                            placeholder="Lieu de naissance"
                            value={Lieu}
                            onChange={(e) => { setLieu(e.target.value); handleChange('lieu', e.target.value, getLieuError) }}
                            onBlur={(e) => handleBlur('lieu', e.target.value, getLieuError)}
                          />
                          {touched.lieu && errors.lieu && (
                            <div className="invalid-feedback" role="alert">{errors.lieu}</div>
                          )}
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-12 col-sm-6">
                          <label htmlFor="Email" className="form-label small text-secondary">Email</label>
                          <input
                            type="email"
                            id="Email"
                            className={fieldClass('email', Email)}
                            value={Email}
                            onChange={(e) => { setEmail(e.target.value); handleChange('email', e.target.value, getEmailError) }}
                            onBlur={(e) => handleBlur('email', e.target.value, getEmailError)}
                          />
                          {touched.email && errors.email && (
                            <div className="invalid-feedback" role="alert">{errors.email}</div>
                          )}
                        </div>
                        <div className="col-12 col-sm-6">
                          <label htmlFor="Tel" className="form-label small text-secondary">Téléphone</label>
                          <input
                            type="tel"
                            id="Tel"
                            className={fieldClass('tel', Tel)}
                            value={Tel}
                            onChange={(e) => { setTel(e.target.value); handleChange('tel', e.target.value, getTelError) }}
                            onBlur={(e) => handleBlur('tel', e.target.value, getTelError)}
                          />
                          {touched.tel && errors.tel && (
                            <div className="invalid-feedback" role="alert">{errors.tel}</div>
                          )}
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-12 col-sm-6">
                          <label htmlFor="Profession" className="form-label small text-secondary">Profession</label>
                          <input
                            type="text"
                            id="Profession"
                            className={fieldClass('profession', Profession)}
                            value={Profession}
                            onChange={(e) => { setProfession(e.target.value); handleChange('profession', e.target.value, getProfessionError) }}
                            onBlur={(e) => handleBlur('profession', e.target.value, getProfessionError)}
                          />
                          {touched.profession && errors.profession && (
                            <div className="invalid-feedback" role="alert">{errors.profession}</div>
                          )}
                        </div>
                        <div className="col-12 col-sm-6">
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
                        <div className="col-12 col-sm-6">
                          <label htmlFor="Password" className="form-label small text-secondary">Mot de passe</label>
                          <div className="password-field-wrapper">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="Password"
                              className={fieldClass('password', Password)}
                              style={{ paddingRight: '2.5rem' }}
                              value={Password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                handleChange('password', e.target.value, getPasswordError)
                                if (touched.password2) {
                                  setErrors((prev) => ({ ...prev, password2: getPassword2Error(Password2, e.target.value) }))
                                }
                              }}
                              onBlur={(e) => handleBlur('password', e.target.value, getPasswordError)}
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowPassword((v) => !v)}
                              tabIndex={-1}
                              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                          </div>
                          {Password && (
                            <>
                              <div className="strength-bar">
                                <div
                                  className="strength-bar-fill"
                                  style={{
                                    width: `${(passwordStrength.score / 3) * 100}%`,
                                    backgroundColor: passwordStrength.color,
                                  }}
                                />
                              </div>
                              {passwordStrength.label && (
                                <div className="small mt-1" style={{ color: passwordStrength.color }}>
                                  Sécurité : {passwordStrength.label}
                                </div>
                              )}
                            </>
                          )}
                          {touched.password && errors.password && (
                            <div className="text-danger small mt-1" role="alert">{errors.password}</div>
                          )}
                        </div>
                        <div className="col-12 col-sm-6">
                          <label htmlFor="Password2" className="form-label small text-secondary">Confirmation</label>
                          <div className="password-field-wrapper">
                            <input
                              type={showPassword2 ? 'text' : 'password'}
                              id="Password2"
                              className={fieldClass('password2', Password2)}
                              style={{ paddingRight: '2.5rem' }}
                              value={Password2}
                              onChange={(e) => { setPassword2(e.target.value); handleChange('password2', e.target.value, (v) => getPassword2Error(v, Password)) }}
                              onBlur={(e) => handleBlur('password2', e.target.value, (v) => getPassword2Error(v, Password))}
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowPassword2((v) => !v)}
                              tabIndex={-1}
                              aria-label={showPassword2 ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                              <i className={`bi ${showPassword2 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                          </div>
                          {touched.password2 && errors.password2 && (
                            <div className="text-danger small mt-1" role="alert">{errors.password2}</div>
                          )}
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
    </>
  )
}

export default App