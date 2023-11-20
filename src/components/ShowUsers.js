import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alert } from '../functions';
import '../css/style.css';
import { Pagination } from 'react-bootstrap';
const ShowUsers = () => {
    
    const url = 'http://localhost:44319/api/users';
    const [users,setUsers]= useState([]);
    const [id,setId]= useState('');
    const [nombre,setNombre]= useState('');
    const [correo,setCorreo]= useState('');
    const [edad,setEdad]= useState('');

    const [operation,setOperation]= useState('');
    const [title,setTitle]= useState('');

    useEffect(()=>{
        getUsers();
    },[]);

    const [data, setData] = useState([
        { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
      ]);

    const getUsers = async () => {
        const respuesta = await axios.get(url);
        setUsers(respuesta.data);
    }

    const openModal = (op,id,nombre,edad,correo) => {
        setId('');
        setNombre('');
        setEdad('');
        setCorreo('');
        setOperation(op);

        if(op === 1){
            setTitle('Registrar Usuario');
        } else if(op === 2){
            setTitle('Editar Usuario');
            setId(id);
            setNombre(nombre);
            setEdad(edad);
            setCorreo(correo);
        }

        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }

    const validar = () =>{
        var parametro;
        var metodo;
        
        if(nombre.trim() === ''){
            show_alert('Escribe el nombre del usuario','warning');
        }else if(edad === ''){
            show_alert('Escribe la edad del usuario','warning');
        }else if(correo.trim() === ''){
            show_alert('Escribe el correo del usuario','warning');
        }else{
            if(operation === 1){
                parametro = {nombre:nombre.trim(),edad:edad,correo:correo.trim()};
                metodo = 'POST';
            }else{
                parametro = {id:id,nombre:nombre.trim(),edad:edad,correo:correo.trim()};
                metodo = 'PUT';
            }
            console.log(metodo);
            console.log(parametro);
            enviarSolicitud(metodo,parametro);
        }

    }

    const enviarSolicitud = async(metodo,parametro) => {  
        await axios({
                method:metodo,
                url:url,
                data:parametro}).then(function(respuesta){
            
            if(respuesta.status === 202 || respuesta.status === 201 || respuesta.status === 200){
                var msj = 'Su operación se ha realizado de manera exitosa!';
                show_alert(msj,"success");
                getUsers();
            }
        }).catch(function(error){
            show_alert("Hubo un error en la solicitud","error");
        });
    }

    const deleteUser = async(id,nombre) => {  
        const varSwal = withReactContent(Swal);
        varSwal.fire({
            title:'¿Desea eliminar el usuario '+ nombre +'?',
            icon:'question',
            text:'No prodrá revertir los cambios',
            showCancelButton:true,
            confirmButtonText:'Si, eliminar',
            cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                enviarSolicitud('DELETE',{id:id})
            }else{
                show_alert("El producto no fue eliminado","info");
            }
        });
    }

    return (
        
        <div className='App'>
            <br />
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-2 offset-md-2'>
                        <div className='d-grid mx-auto'>
                            <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                <i className='fa-solid fa-circle-plus'></i> Nuevo Usuario
                            </button>    
                        </div>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-lg-2'>
                        <div className='table-responsive'>

                            
                            <table className='table table-striped' id='table'> 
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Edad</th>
                                        <th>Correo</th>
                                        <th></th>
                                    </tr>
                                </thead>    

                                <tbody>
                                    {users.map((user,id) => (
                                        <tr key={user.id}>
                                            <td>{(id +1)}</td>
                                            <td>{user.nombre}</td>
                                            <td>{user.edad}</td>
                                            <td>{user.correo}</td>
                                            <td>
                                                <button onClick={()=> openModal(2,user.id,user.nombre,user.edad,user.correo)} 
                                                        className='btn btn-secondary' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={()=> deleteUser(user.id,user.nombre)} className='btn btn-dark'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>    

                            </table> 
                         
      
                        </div>
                        
                    </div>
                </div>

            </div>

            <div className='modal fade' aria-hidden='true' id='modalUsersM'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>    
                        <input type='hidden' id='id'></input>  
                        <div className='input-group'>
                            <label for="validation01">Nomde del Usuario</label>
                            <input type='text' id='nombre' className="form-control" placeholder="Intruduzca el nombre"
                                value={nombre} onChange={(e)=> setNombre(e.target.value)}></input>  
                        </div>    
                        <div className="input-group">
                            <input type='text' id='edad' className="form-control" placeholder="Intruduzca la edad"
                                value={edad} onChange={(e)=> setEdad(e.target.value)}></input>  
                        </div>    
                        <div className="input-group">
                            <input type='text' id='correo' className="form-control" placeholder="Intruduzca el correo"
                                value={correo} onChange={(e)=> setCorreo(e.target.value)}></input>  
                        </div>  
                        <div className="d-grid col-6 mx-auto">
                            <button type='button' onClick={() => validar()}
                             className='btn btn-info' data-bs-dismiss='modal' aria-label='close'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>    
                    </div>
                </div>               
            </div>


            <div className='modal fade' aria-hidden='true' id='modalUsers'>
                <div className='modal-dialog'>
                    <div className='modal-content modal_content'>

            <div class="container px-5 my-5">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                    <div class="card border-0 rounded-3">
                        <div class="card-body p-4">
                        <div class="text-center">
                            <div class="h1 fw-light">{title}</div>
                            <p class="mb-4 text-muted">
                                 Formulario para gestionar usarios!</p>
                        </div>

                            <input type='hidden' id='id'></input>  
                            <div className='input-group'>
                                <input type='text' id='nombre' className="form-control" placeholder="Intruduzca el nombre"
                                    value={nombre} onChange={(e)=> setNombre(e.target.value)}></input>  
                            </div>    
                            <div className="input-group">
                                <input type='text' id='edad' className="form-control" placeholder="Intruduzca la edad"
                                    value={edad} onChange={(e)=> setEdad(e.target.value)}></input>  
                            </div>    
                            <div className="input-group">
                                <input type='text' id='correo' className="form-control" placeholder="Intruduzca el correo"
                                    value={correo} onChange={(e)=> setCorreo(e.target.value)}></input>  
                            </div>             

                            <div class="d-grid">
                                <button type='button' onClick={() => validar()}
                                className='btn btn-success' data-bs-dismiss='modal' aria-label='close'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                      

                        </div>
                    </div>
                    </div>
                </div>
                </div>

                </div>
                </div>
                </div>

        </div>
    )
}

export default ShowUsers
