import { useState, useEffect } from 'react';
import { FiUser, FiDelete, FiEdit2, FiCheck } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './costumers.css'
import {AuthContext} from "../../contexts/auth";
import {baseUrl} from "../../config/config";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Costumers() {
    
    const { register} = useForm();
    const [nomeCliente, setNomeCliente] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [clientes, setClientes] = useState([]);
    const [campoCnpjEditavel, setCampoCnpjEditavel] = useState(null);
    const [atualizaNome, setAtualizaNome] = useState('');
    const [atualizaEndereco, setAtualizaEndereco] = useState('');

    useEffect(()=>{
       
        axios.get(`${baseUrl}/clientes`)
            .then(response => {
                if(response.status === 200) setClientes(response.data);
            })
    },[clientes]);

    function criarCliente(e){
        e.preventDefault();
        const clientData ={
            nome: nomeCliente,
            cnpj,
            endereco,
            timeOfRegistration: new Date().toISOString().split('T')[0], //ex: 2022-06-18
        }
        axios.post(baseUrl + '/clientes', clientData)
            .then(response => {
                if(response.status === 200) alert('Cliente cadastrado com sucesso!');
                else alert('Erro ao criar cliente: ' + response.data.message);
            })
    }

    async function removerCliente(cnpj){
        axios.delete(`${baseUrl}/clientes/${cnpj}`)
            .catch(error => alert('Erro ao remover cliente: ' + error.message))
    }

    function atualizarCliente(cliente) {
        axios.patch(`${baseUrl}/clientes`, cliente)
            .catch(error => alert('Erro ao atualizar cliente: ' + error.message))
    }

    function editarCliente(cliente) {
        if(cliente.cnpj === campoCnpjEditavel) {
            const clienteAtual = {
                cnpj: cliente.cnpj,
                nome: atualizaNome || cliente.endereco,
                endereco: atualizaEndereco || cliente.endereco,
            }
            atualizarCliente(clienteAtual);
            setCampoCnpjEditavel(null)
        }
        else {
            setCampoCnpjEditavel(cliente.cnpj);
            setAtualizaNome(cliente.nome);
            setAtualizaEndereco(cliente.endereco);
        }
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title nome="Clientes">
                    <FiUser size={25} />
                </Title>
                <div className="container">
                    <form onSubmit={(e)=>{criarCliente(e)}} className="form-profile costumers">
                        <label>Nome</label>
                        <input placeholder="Digite o Nome Fantasia" type="text" required  value={nomeCliente}  onChange={(e) => setNomeCliente(e.target.value)} />
                       
                        <label>CNPJ</label>
                        <input placeholder="Digite o CNPJ" type="text" required value={cnpj} onChange={(e) => { setCnpj(e.target.value) }} />

                        <label>Endereço</label>
                        <input placeholder="Digite o seu Endereço" type="text" required value={endereco} onChange={(e) => { setEndereco(e.target.value) }} />

                        <button className="button-costumers" type="submit">Salvar</button>
                    </form>
                </div>
                <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">CNPJ</th>
                  <th scope="col">Endereço</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                  {clientes.map((cliente)=>{
                      return(
                        <tr key={cliente.cnpj}>
                            {cliente.cnpj === campoCnpjEditavel ?
                                <td>
                                    <input className="editable-cell" type="text" value={atualizaNome} onChange={(e) => setAtualizaNome(e.target.value)} />
                                </td>
                                : 
                                <td data-label="Cliente">{cliente.nome}</td>}
                                <td data-label="CNPJ">{cliente.cnpj}</td>
                            {cliente.cnpj === campoCnpjEditavel ?
                                <td>
                                   <input className="editable-cell" type="text" value={atualizaEndereco} onChange={(e) => setAtualizaEndereco(e.target.value)} />
                                </td>
                                : 
                                <td data-label="Endereço">{cliente.endereco}</td>}
                                <td data-label="Cadastrado">{cliente.dataCadastro}</td>
                                <td data-label="#">
                            <button onClick={()=>{removerCliente(cliente.cnpj)}} className="action" style={{backgroundColor: '#3583f6' }}>
                            <FiDelete color="#FFF" size={18} />
                            </button>
                            <button onClick={()=>editarCliente(cliente)} className="action" style={{backgroundColor: '#F6a935' }}>
                              {cliente.cnpj === campoCnpjEditavel ? <FiCheck color="green" size={18}/>: <FiEdit2 color="#FFF" size={17}/>}
                            </button>
                        </td>
                      </tr>
                      );
                  })}
              </tbody>
            </table>
            </div>
        </div>
    );
}