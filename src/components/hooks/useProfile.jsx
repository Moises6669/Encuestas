import { useState } from 'react'
import { validateUsername, validatePassword } from '../functions/index'
import { useHistory } from 'react-router-dom'
import { parseJwt } from '../functions/decryptToken'
import axios from 'axios';
import cookies from 'universal-cookie'

const cookie = new cookies();

const useProfile = () => {
    const history = useHistory()
    const data = cookie.get('auth');
    const userData = parseJwt(data);
    const [token, setToken] = useState({
        name: userData.name,
        email: userData.email,
        password: ''
    })

    const [isPassword, setIsPassword] = useState();

    let [error, setError] = useState({
        name: ''
    })
    
    const validateError = (name, element) => {
        if(name === 'name'){
            setError({
                name: validatePassword(element)
            })
        } else if (name === 'email') {
            setError({
                name: validateUsername(element)
            })
        } else if (name === 'newPassword'){
            setIsPassword(element)
            
        } else if (name === 'password'){
            if(element === isPassword){
                setError({
                    name: ""
                })
            }else{
                setError({
                    name: "Las contraseñas no coinciden"
                })
            }
        }
    }

    const toggleInput = async (e) => {
        const element = e.target.name
        const elementValue = e.target.value

        validateError(element, elementValue);

        await setToken({
            ...token,
            [element]: elementValue
        })
    }

    const updateProfile = async (name, email, password) => {
        if(password.length < 6){
            setError({
                name: "Amigo, debe ingresar su contraseña antigua o tu nueva contraseña. No puedes dejar este campo vacio"
            })
        }else {
            await axios.put(`/api/users/${userData._id}`, {
                name: name,
                email: email,
                password: password
            })
                .then(resp => resp.data === "OK" ? history.push('/login') : null)
                .catch(error => console.log(error));
        }
    }

    const deleteAccount = async () => {
        await axios.delete(`/api/users/${userData._id}`)
            .then(resp => console.log(resp))
            .catch(error => console.log(error))
    }

    const toggleSubmit = async (e) => {
        e.preventDefault();

        if(error.name.length > 0){
            setError({
                name: "Porfavor, revise los campos llenados previamente"
            })
        }else{
            updateProfile(token.name, token.email, token.password);
        }
    }
    
    return [token, toggleSubmit, toggleInput, error, deleteAccount];
}

export default useProfile