import React, { useState } from "react";
import loginpic from "../images/login.svg";
import { NavLink,useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputs = (e) => {
    setEmail(e.target.value);
  };
  const giveInputs = (e) => {
    setPassword(e.target.value);
  };

  const loginUser = async(e)=>{
    e.preventDefault();
    const res = await fetch("/signin",{
      method : "POST",
      headers :{
           "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    });
    const data = res.json()

    if(res.status === 400|| !data){
      window.alert("Invalid Credentials")
    }else{
      window.alert("Login Successful")
      navigate("../")
    }
  }

  return (
    <>
      <section className="sign-in">
        <div className="container mt-5">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src={loginpic} alt="login pic "></img>
              </figure>
              <NavLink to="/signUp" className="signin-image-link">
                Create Account
              </NavLink>
            </div>
            <div className="signin-form">
              <h2 className="form-title">Sign IN</h2>
              <form  method="POST" className="register-form" id="register-form">
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="name"
                    autoComplete="off"
                    value={email}
                    onChange={handleInputs}
                    placeholder="Your Email"
                  ></input>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="zmdi zmdi-key material-icons-name"></i>
                  </label>
                  <input
                    type="password "
                    name="password "
                    id="password "
                    autoComplete="off"
                    value={password}
                    onChange={giveInputs}
                    placeholder="Your Password "
                  ></input>
                </div>

                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signin"
                    id="signin"
                    className="form-submit"
                    value="Log IN"
                    onClick={loginUser}
                  ></input>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
