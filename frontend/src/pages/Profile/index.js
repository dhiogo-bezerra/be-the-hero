import React , {useEffect,useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiPower, FiTrash2} from 'react-icons/fi';
import './styles.css'
import logoImg from "../../assets/download.svg";
import api from '../../services/api';

export default function Profile(){
  const ongName = localStorage.getItem('ongName');
  const ongId = localStorage.getItem('ongId');
  const [incidents, setIncidents] = useState([]);
  const history = useHistory();

  useEffect(() => {
    api.get('profile', {headers: {Authorization: ongId}}).then(response => {
        setIncidents(response.data);
    })
  }, [ongId]);

  async function handleDeleteIncident(id)
  {
    try{
      await api.delete(`incidents/${id}`, {
        headers:{
          Authorization: ongId
        }
      });
       setIncidents(incidents.filter(incidents => incidents.id !== id));
    }
    catch(err)
    {
      alert('Errp ao deletar caso, tente novamente.');
    }
  }
   
  async function handleLogout()  {
      localStorage.clear();
      history.push('/');
  }
  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
          <span>Bem vinda, {ongName}</span>
        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size={18} color="#E02041"></FiPower>
        </button>
      </header>

      <h1>Casos cadastrados</h1>
      <ul>
       {incidents.map(incident => (
          <li key={incident.id}>
          <strong>Caso:</strong>
          <p>{incident.title}</p>

          <strong>Descrição:</strong>
          <p>{incident.description}</p>

          <strong>Valor:</strong>
          <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</p>
          <button type="button" onClick={() => handleDeleteIncident(incident.id)}> 
            <FiTrash2 size={20} color="#a8a8b3"></FiTrash2>
          </button>
        </li>

       ))}
      </ul>
    </div>
  )
}