// React
import React, { useEffect, useState } from 'react';

import instanciaAxios from './ajax/instanciaAxios';

import './PaginaTarefas.css';

const PaginaTarefas = () => {

  const [listaCategorias, setListaCategorias] = useState([]);
  const [listaTarefas, setListaTarefas] = useState([]);
  const [listaDias, setListaDias] = useState([]);
  const [listaTurnos, setListaTurnos] = useState([]);
  const [descricaoNovoItem, setDescricaoNovoItem] = useState('');
  const [categoriaNovoItem, setCategoriaNovoItem] = useState('');
  const [diaNovoItem, setDiaNovoItem] = useState('');
  const [turnoNovoItem, setTurnoNovoItem] = useState('');
  const [alertaNovoItem, setAlertaNovoItem] = useState('desligado');
  
  useEffect(() => {
    pegarCategorias();
    pegarTarefas();
    pegarDias();
    pegarTurnos();
  }, []);

  const pegarCategorias = async () => {

    try {
      const resposta = await instanciaAxios.get('../json/categorias.json');
      setListaCategorias(resposta.data.categorias);
    } catch (error) {
      console.log(error.message);
    }

  };

  const pegarTarefas = async () => {

    try {
      const resposta = await instanciaAxios.get('../json/tarefas.json');
      setListaTarefas(resposta.data.tarefas);
    } catch (error) {
      console.log(error.message);
    }

  };

  const pegarDias = async () => {

    try {
      const resposta = await instanciaAxios.get('../json/dias.json');
      setListaDias(resposta.data.dias);
    } catch (error) {
      console.log(error.message);
    }

  };

  const pegarTurnos = async () => {

    try {
      const resposta = await instanciaAxios.get('../json/turnos.json');
      setListaTurnos(resposta.data.turnos);
    } catch (error) {
      console.log(error.message);
    }

  };

  const OpcoesCategoriasComponente = () => {
    if( listaCategorias.length > 0 ) {
      const listaCategoriasJSX = listaCategorias.map( ( item ) => {
        return (
          <option key={ item.id } value={ item.id } >
            { item.descricao }
          </option>
        );
      } );
    
      return listaCategoriasJSX;
    } else { 
      return null;
    }
  };

  const OpcoesDiasComponente = () => {
    if( listaDias.length > 0 ) {
      const listaDiasJSX = listaDias.map( item => {
        return (
          <div key={ item.id }>
            <input 
              type='radio' 
              name='dia' 
              value={ item.id } 
              id={ `dia-${item.valor}` } 
              onChange={ (evento) => setDiaNovoItem( evento.target.value ) } 
              checked={ item.id === diaNovoItem } />
            <label htmlFor={ `dia-${item.valor}` }>
              { item.rotulo }
            </label>
          </div>
        );
      } );
    
      return listaDiasJSX;
    } else { 
      return null;
    }
  };

  const OpcoesTurnosComponente = () => {
    if( listaTurnos.length > 0 ) {
      const listaTurnosJSX = listaTurnos.map( item => {
        return (
          <div key={ item.id }>
            <input 
              type='radio' 
              name='turno' 
              value={ item.id } 
              id={ `turno-${item.valor}` } 
              onChange={ (evento) => setTurnoNovoItem( evento.target.value ) }
              checked={ item.id === turnoNovoItem } />
            <label htmlFor={ `turno-${item.valor}` }>
              { item.rotulo }
            </label>
          </div>
        );
      } );
    
      return listaTurnosJSX;
    } else { 
      return null;
    }
  };

  const AlertaIconeComponente = () => {
    return ( 
      <img className='icone icone-alerta' src='/images/despertador-icone.png' />
    );
  };

  const CorpoTabelaComponente = () => {

    if( listaTarefas.length > 0 ) {
      return (
        <tbody>
          { listaTarefas.map( item => {
                return (
                  <LinhaTabelaComponente
                    key={ item.id } 
                    id={ item.id } 
                    descricao={ item.descricao } 
                    idCategoria={ item.idCategoria } 
                    idDia={ item.idDia } 
                    alerta={ item.alerta } 
                    idTurno={ item.idTurno } />
                );
              } 
            ) 
          }
        </tbody>
      );
    } else {
      return null;
    }

  };

  const LinhaTabelaComponente = ( { id, descricao, idCategoria, idDia, alerta, idTurno } ) => {

    // Categoria encontrada para a tarefa em questão.
    const _categoria = listaCategorias ? listaCategorias.find( item => item.id === idCategoria ) : null;

    // Dia encontrado para a tarefa em questão.
    const _dia = listaDias ? listaDias.find( item => item.id === idDia ) : null;

    // Turno encontrado para a tarefa em questão.
    const _turno = listaTurnos ? listaTurnos.find( item => item.id === idTurno ) : null;

    // Alerta da tarefa em questão.
    const _alerta = alerta === 'ligado' ? <AlertaIconeComponente /> : null;

    return (
      <tr>
        <td>
          { descricao }
          { _alerta }
        </td>
        <td>{ _categoria ? _categoria.descricao : null }</td>
        <td>{ _dia ? _dia.rotulo : null }</td>
        <td>{ _turno ? _turno.rotulo : null }</td>
        <td>
          <img 
            className='icone'
            src='/images/remover-icone.png' 
            onClick={ () => { removerItem( id ) } }
            />
        </td>
      </tr>
    );
  };

  const incluirItem = () => {

    if( categoriaNovoItem > 0 && descricaoNovoItem ) {

      // Gerando o id do novo item
      const indiceUltimoElemento = listaTarefas.length - 1;
      const ultimoElemento = listaTarefas[ indiceUltimoElemento ];
      const idUltimoElemento = ultimoElemento.id;
      const idNovoItem = parseInt( idUltimoElemento ) + 1;

      const novoItem = {
        "id": idNovoItem,
        "descricao": descricaoNovoItem,
        "idCategoria": categoriaNovoItem,
        "idDia": diaNovoItem,
        "idTurno": turnoNovoItem,
        "alerta": alertaNovoItem
      };

      setListaTarefas( [ ...listaTarefas, novoItem] );
    } else {
      alert('Por favor, preencha os campos categoria e descrição.');
    }
  };

  const removerItem = ( idSelecionado ) => {
    console.log( `O id selecionado foi: ${ idSelecionado }` );

    const _listaTarefas = listaTarefas.filter( (item) => {
      return item.id !== idSelecionado;
    } );

    setListaTarefas( _listaTarefas );
  };

  return (
    <> {/* ReactFragment */}

      <h1>AGENDA EMPRESARIAL</h1>


      <div id='container'>

        <div className='box'>

          <div id='box1'>

            <div className='novo-item-campo-input-select'>
              <label>Categoria: </label>
              <select 
                value={ categoriaNovoItem }
                onChange={ (evento) => setCategoriaNovoItem( evento.target.value ) }>
                <option value={-1}>Selecione uma categoria</option>
                <OpcoesCategoriasComponente />
              </select>
            </div>

            <div className='novo-item-campo-input-select'>
              <label>Endereço: </label>
              <input 
                type='text' 
                onChange={ (evento) => setDescricaoNovoItem( evento.target.value ) } />
            </div>
          </div>

          <div id="box2">
            <div id='colunas-dias-turnos'>

            <div className='novo-item-campo'>
              <label>Dia: </label>
              <OpcoesDiasComponente />
            </div>

            <div className='novo-item-campo'>
              <label>Turno: </label>
              <OpcoesTurnosComponente />
            </div>

          </div>

          <div className='novo-item-campo'>
            <p>Alerta?</p>

            <input 
              type='checkbox' 
              id='campo-alerta' 
              name='campo-alerta'
              onChange={ () => { setAlertaNovoItem( 
                alertaNovoItem === 'ligado' ? 'desligado' : 'ligado' ) } } />
            <label htmlFor='campo-alerta'>Ligado</label>
          </div>

          <button
            id='novo-item-btn-incluir'
            onClick={ () => {
              return incluirItem();
            } }
          >Incluir</button>
          </div>

        </div>

        <div className='box' >

          <table>

            <thead>
              <tr>
                <th>Endereço</th>
                <th>Categoria</th>
                <th>Dia</th>
                <th>Turno</th>
                <th>Ações</th>
              </tr>
            </thead>

            <CorpoTabelaComponente />

            <tfoot>
              <tr>
                <td colSpan='5'>Total de Itens: { listaTarefas.length }</td>
              </tr>
            </tfoot>

          </table>

        </div>

      </div>

    </>
  );

}

export default PaginaTarefas;