import './dashboard.css';
import {useEffect, useState} from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from "axios";
import {baseUrl} from "../../config/config";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, RadioGroup, Radio} from '@mui/material'
import {STATUS} from "../New";

export default function Dashboard(){
  const [solicitacaos, setsolicitacaos] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isComplementoAberto, setIsComplementoAberto] = useState(false);
  const [novoStatus, setNovoStatus] = useState(null);
  const [solicitacaoASerAtualizado, setsolicitacaoASerAtualizado] = useState(null);
  const [solicitacaoSelecionado, setsolicitacaoSelecionado] = useState(null);

    useEffect(() => {
        axios.get(baseUrl + '/solicitacoes')
        .then(response => {
            if(response.status === 200) setsolicitacaos(response.data);
            else console.log('Erro ao carregar os solicitacaos');
        })
    }, []);

    function atualizarStatus() {
        solicitacaoASerAtualizado.status = novoStatus;
        console.log(solicitacaoASerAtualizado);
        axios.patch(baseUrl + '/solicitacoes/', solicitacaoASerAtualizado)
            .catch(error => alert(error.message));
    }

    function closeComplemento(event, reason) {
        if (reason ==="backdropClick") setIsComplementoAberto(false);
    }

    return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>

        {solicitacaos.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum solicitacao registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo solicitacao
            </Link>
          </div>
        )  : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo solicitacao
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
              {solicitacaos.map((solicitacao) => {
                  return (
                      <tr key={solicitacao.id}>
                          <td data-label="Cliente">{ solicitacao.cliente.nome }</td>
                          <td data-label="Assunto">{ solicitacao.assunto }</td>
                          <td data-label="Status">
                        <span
                            className="badge"
                            style={
                                solicitacao.status === 'EM_ABERTO' ?
                                    { backgroundColor: '#bf2d17' } :
                                    solicitacao.status === 'EM_PROGRESSO' ?
                                        { backgroundColor: '#c2b43c' } :
                                        { backgroundColor: '#5cb85c'}
                            }
                        >
                          { solicitacao.status }
                        </span>
                          </td>
                          <td data-label="Cadastrado">{ solicitacao.dataCriacao }</td>
                          <td data-label="#">
                              {solicitacaoSelecionado ?
                                  <Dialog open={isComplementoAberto} onClose={closeComplemento}>
                                  <DialogTitle>Complemento:</DialogTitle>
                                  <DialogContent>
                                  <DialogContentText>{solicitacaoSelecionado.complemento || "sem complemento específico"}</DialogContentText>
                                  </DialogContent>
                                  </Dialog>: null
                              }

                              <button onClick={()=> {
                                  setsolicitacaoSelecionado(solicitacao);
                                  setIsComplementoAberto(true)
                              }} className="action" style={{backgroundColor: '#3583f6' }}>
                                  <FiSearch color="#FFF" size={17} />
                              </button>
                              <button onClick={()=> {
                                  setsolicitacaoASerAtualizado(solicitacao)
                                  setIsDialogOpen(true)
                              }} className="action" style={{backgroundColor: '#F6a935' }}>
                                  <FiEdit2 color="#FFF" size={17} />
                              </button>
                              <Dialog open={isDialogOpen}>
                                  <DialogTitle>Qual o novo status?</DialogTitle>
                                  <DialogContent>
                                      <RadioGroup defaultValue={solicitacao.status} row name="status" onChange={(e) => setNovoStatus(e.target.value)}>
                                          <div><Radio value={STATUS.EM_ABERTO} /> Em Aberto</div>
                                          <div><Radio value={STATUS.EM_PROGRESSO} /> Em Progresso</div>
                                          <div><Radio value={STATUS.ATENDIDO} /> Atendido</div>
                                      </RadioGroup>
                                      <DialogActions>
                                          <button onClick={()=> {
                                              setIsDialogOpen(false)
                                              atualizarStatus();
                                          }}>Confirmar</button>
                                      </DialogActions>
                                  </DialogContent>
                              </Dialog>
                          </td>
                      </tr>
                  )
              })}
              </tbody>
            </table>
          </>
        )}

      </div>

    </div>
  )
}