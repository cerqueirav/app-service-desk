class ClienteService{
    async function removerCliente(cnpj){
        axios.delete(`${baseUrl}/client/${cnpj}`)
            .catch(error => alert('Erro ao remover cliente: ' + error.message))
    }
    
    function atualizarCliente(cliente) {
        axios.patch(`${baseUrl}/client`, cliente)
            .catch(error => alert('Erro ao atualizar cliente: ' + error.message))
    }

    function criarCliente(e){
        e.preventDefault();
        const clientData ={
            name: clientName,
            cnpj,
            address,
            timeOfRegistration: new Date().toISOString().split('T')[0], //ex: 2022-06-18
        }
        axios.post(baseUrl + '/client', clientData)
            .then(response => {
                if(response.status === 200) alert('Cliente cadastrado com sucesso!');
                else alert('Erro ao criar cliente: ' + response.data.message);
            })
    }
}

export default ClienteService;

