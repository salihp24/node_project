import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios"
import "./Register.css"

function Register() {

    const navigate = useNavigate()

    const [user,setUser] = useState({
        username:"",
        email:"",
        password:""
    })

    const [error,setError] = useState("")

    const handleChange = (e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    }

    const handleRegister = async ()=>{

        if(!user.username || !user.email || !user.password){
            setError("Please fill all fields")
            return
        }

        try{

            const res = await axios.post(
                "http://localhost:5000/api/users/register",
                user
            )

            console.log(res.data)

            navigate("/login")

        }catch(err){

            setError(err.response?.data?.message || "Registration failed")

        }

    }

  return (

    <div className="register-container">

        <h2 className="register-title">Register</h2>

        <input
            className="register-input"
            name="username"
            placeholder="Username"
            onChange={handleChange}
        />

        <input
            className="register-input"
            name="email"
            placeholder="Email"
            onChange={handleChange}
        />

        <input
            className="register-input"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
        />

        <p className="error-message">{error}</p>

        <button className="register-button" onClick={handleRegister}>
            Register
        </button>

        <p style={{ marginTop:"12px", color:"white" }}>
            Already have an account?{" "}
            <Link to="/login" style={{color:"red"}}>Login</Link>
        </p>

    </div>

  )
}

export default Register