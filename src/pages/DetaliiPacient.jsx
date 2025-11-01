import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function DetaliiPacient() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pacient } = location.state || {};

  const [showFront, setShowFront] = useState(true);
  const [audioInstance, setAudioInstance] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [pacientCompletat, setPacientCompletat] = useState(null);
  const [uploadedWav, setUploadedWav] = useState(null);
  const [audioInfo, setAudioInfo] = useState(null);
  const [aiResult, setAiResult] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null); 

  const calculeazaAmplitudineaMedie = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = reader.result;

        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const rawData = audioBuffer.getChannelData(0);

          let suma = 0;
          for (let i = 0; i < rawData.length; i++) {
            suma += Math.abs(rawData[i]);
          }
          const amplitudineMedie = suma / rawData.length;
          resolve(amplitudineMedie);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    if (!pacient) return navigate('/pacienti');

    if (pacient.number !== undefined) {
      fetch('https://localhost:7274/api/PatientDetails')
        .then(res => res.json())
        .then(data => {
          const match = data.find(p => p.number === pacient.number);
          if (!match) return setPacientCompletat(pacient);

          fetch('https://localhost:7274/api/Patients')
            .then(res => res.json())
            .then(recordingsData => {
              const recordingsMatch = recordingsData.find(p => p.number === pacient.number);
              const combinat = {
                ...pacient,
                ...match,
                recordings: recordingsMatch?.recordings ?? []
              };
              setPacientCompletat(combinat);
            })
            .catch(() => setPacientCompletat({ ...pacient, ...match }));
        })
        .catch(() => setPacientCompletat(pacient));
    } else {
      fetch('https://localhost:7274/api/Patients/database')
        .then(res => res.json())
        .then(db => {
          const gasit = db.find(p => p.username === pacient.username);
          if (gasit) {
            const combinat = {
              ...pacient,
              age: gasit.age,
              sex: gasit.sex,
              weight: gasit.weight,
              height: gasit.height,
              diagnostic: gasit.diagnosis
            };
            setPacientCompletat(combinat);
          } else {
            setPacientCompletat(pacient);
          }
        })
        .catch(() => setPacientCompletat(pacient));
    }
  }, [pacient, navigate]);

  const handleToggleFrontBack = () => {
    setShowFront(!showFront);
  };

  const getManechinImage = () => {
    const sex = pacientCompletat?.sex?.toUpperCase();
    if (sex === 'F') {
      return showFront ? '/femeie_front.png' : '/femeie_back.png';
    } else {
      return showFront ? '/barbat_front.png' : '/barbat_back.png';
    }
  };

 const playSound = (pos) => {
  if (!pacientCompletat) return;

  
  if (!pacientCompletat.number && uploadedWav) {
    uploadedWav.play();
    setAudioInstance(uploadedWav);
    setActiveButton(pos);
    setSelectedRecording({ audioFile: audioInfo?.name }); 
    return;
  }

  
  if (!pacientCompletat.number && !uploadedWav) {
    alert("Te rog să adaugi un fișier audio pentru pacientul real.");
    return;
  }

  
  if (!pacientCompletat.recordings) return;

  let recording = pacientCompletat.recordings.find(r => r.position.toUpperCase() === pos);

  
  if (!recording) {
    recording = pacientCompletat.recordings.find(r => r.position.toUpperCase() === 'TC');
  }

  if (recording) {
    const audio = new Audio(`https://localhost:7274/DataFiles/${recording.audioFile}`);
    setAudioInstance(audio);
    audio.play().catch(() => {
      alert('Eroare la redarea sunetului!');
    });
    setActiveButton(pos);
    setSelectedRecording(recording);
  } else {
    alert(`Nu există sunet disponibil pentru poziția ${pos} și nici sunet generic Tc.`);
  }
};





  const stopSound = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setActiveButton(null);
    }
  };

  const openSpectrogram = () => {
    if (selectedRecording && selectedRecording.spectrogram) {
      window.open(`https://localhost:7274/DataFiles/${selectedRecording.spectrogram}`, '_blank');
    } else {
      alert("Nu ai selectat un sunet sau spectrograma nu este disponibilă.");
    }
  };

  const handleWavUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "audio/wav") {
      const reader = new FileReader();
      reader.onload = () => {
        const audio = new Audio(reader.result);
        setUploadedWav(audio);
        const objectUrl = URL.createObjectURL(file);
        const tempAudio = new Audio(objectUrl);
        tempAudio.onloadedmetadata = () => {
          setAudioInfo({ name: file.name, duration: tempAudio.duration });
        };
      };
      reader.readAsDataURL(file);
    } else {
      alert("Te rog să selectezi un fișier .wav valid.");
    }
  };

  const handleVerifyDiagnostic = async () => {
    const pacientId = pacientCompletat.number;

    if (!pacientId && uploadedWav && audioInfo) {
      const fileInput = document.getElementById('uploadWav');
      const file = fileInput.files[0];

      const amplitudineMedie = await calculeazaAmplitudineaMedie(file);

      let diagnostic = 'healthy';
      let message = `Pacient probabil sănătos.`;

      if (amplitudineMedie > 0.02) {
        diagnostic = 'sick';
        message = `Pacient probabil bolnav.`;
      }

      setAiResult(message);

      setPacientCompletat(prev => ({
        ...prev,
        diagnostic: diagnostic
      }));

      setLoadingAi(false);
      return;
    }

    setLoadingAi(true);
    setAiResult('');
    try {
      const res = await fetch(`https://localhost:7274/api/AiDiagnostic/${pacientId}`);
      const data = await res.json();

      setAiResult(data?.message || 'Niciun răspuns primit de la AI.');

      setPacientCompletat(prev => ({
        ...prev,
        diagnostic: data?.diagnostic || 'healthy',
        severity: data?.severity || null
      }));
    } catch (error) {
      console.error(error);
      setAiResult("❌ Eroare la generarea diagnosticului.");
    } finally {
      setLoadingAi(false);
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('ro-RO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (!pacientCompletat) return null;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbar}>
        <div style={styles.leftSide}>
          <Link to="/" style={styles.menuButton}>🏠 StethoNet</Link>
        </div>
        <div style={styles.rightSide}>
          <Link to="/pacienti" style={styles.link}>Înapoi la pacienți</Link>
        </div>
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>Fișa Medicală Pacient {pacientCompletat.number || pacientCompletat.username}</h2>

        <div style={styles.infoSection}>
          <p>👤 <b>Pacient:</b> {pacientCompletat.number || pacientCompletat.username}</p>
          <p>{pacientCompletat.sex?.toUpperCase() === 'F' ? '♀️' : '♂️'} <b>Sex:</b> {pacientCompletat.sex === 'F' ? 'Feminin' : 'Masculin'}</p>
          <p>🎂 <b>Vârstă:</b> {pacientCompletat.age || 'Necunoscut'} ani</p>
          <p>⚖️ <b>Greutate:</b> {pacientCompletat.weight || pacientCompletat.childWeight || 'Necunoscut'} kg</p>
          <p>📏 <b>Înălțime:</b> {pacientCompletat.height || pacientCompletat.childHeight || 'Necunoscut'} cm</p>
          {typeof pacientCompletat.adultBMI === 'number' && (
            <p>📊 <b>BMI Adult:</b> {pacientCompletat.adultBMI.toFixed(2)}</p>
          )}
          <p>📅 <b>Examinare:</b> {formattedDate}</p>

          <p>🧠 <b>Diagnostic:</b> {pacientCompletat.diagnostic || 'Necunoscut'}</p>
          {pacientCompletat.severity && (
            <p>🔍 <b>Severitate:</b>{' '}
              {Object.entries(pacientCompletat.severity).map(
                ([tip, procent]) => `${tip} ${procent}`
              ).join(', ')}
            </p>
          )}
        </div>

        <div style={styles.manequinAndButtons}>
          <div style={styles.manequinContainer}>
            <img src={getManechinImage()} alt="Manechin" style={styles.manequinImage} />
            {['AL', 'AR', 'PL', 'PR'].map(pos => (
              <button
                key={pos}
                title="Ascultă sunet"
                style={{
                  ...styles.soundButton,
                  backgroundColor: activeButton === pos ? '#00cc66' : '#3182ce',
                  top: pos[0] === 'A' ? '50%' : '65%',
                  left: pos[1] === 'L' ? '30%' : '65%'
                }}
                onClick={() => playSound(pos)}
              >
                {pos}
              </button>
            ))}
          </div>

          <div style={styles.buttonsArea}>
            <button style={styles.loadButton} onClick={handleToggleFrontBack}> {showFront ? 'Vezi spatele' : 'Vezi fața'} </button>
            <button style={styles.loadButton} onClick={openSpectrogram}> Vezi spectrograma </button>
            <button style={styles.loadButton} onClick={stopSound}> Oprește sunetul </button>
            <input type="file" id="uploadWav" accept=".wav" style={{ display: 'none' }} onChange={handleWavUpload} />
            {!pacientCompletat.number && (
              <button style={styles.loadButton} onClick={() => document.getElementById('uploadWav').click()}> Adaugă sunet nou </button>
            )}

            {audioInfo && (
              <button style={styles.loadButton}>
                Analiza sunet: {audioInfo.name} | Durată: {audioInfo.duration.toFixed(2)} sec
              </button>
            )}
            <button style={styles.loadButton} onClick={handleVerifyDiagnostic}>Check result </button>
            {aiResult && (
              <div style={styles.resultBox}>
                🤖 <b></b> {aiResult}
              </div>
            )}
          </div>
        </div>

        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>🎧 Ascultă sunetele pulmonare pentru această poziție.</p>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundImage: 'url("/fundal1.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    overflow: 'hidden',
    position: 'relative'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid #ddd',
    position: 'relative',
    zIndex: 10
  },
  leftSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  rightSide: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  menuButton: {
    fontSize: '18px',
    background: '#3182ce',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  link: {
    color: '#2b6cb0',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '1100px',
    textAlign: 'center',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    margin: '30px auto'
  },
  heading: {
    fontSize: '32px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#2b6cb0'
  },
  infoSection: {
    marginBottom: '30px',
    textAlign: 'left',
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#2d3748'
  },
  manequinAndButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '40px',
    marginTop: '20px',
    alignItems: 'center'
  },
  manequinContainer: {
    position: 'relative',
    width: '300px',
    height: '400px'
  },
  manequinImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  soundButton: {
    position: 'absolute',
    padding: '6px 10px',
    fontSize: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  buttonsArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  loadButton: {
    padding: '10px 20px',
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  resultBox: {
    marginTop: '20px',
    backgroundColor: '#e6f7ff',
    border: '1px solid #90cdf4',
    padding: '15px',
    borderRadius: '8px',
    color: '#2b6cb0',
    fontSize: '16px',
    textAlign: 'left',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  }
};

export default DetaliiPacient;
