import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const Login = () => {
  let emails = 'admin'
  let contrasea = 'admin123'
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const history = useHistory(); // Obtenemos el objeto history con useHistory()


  const onSubmit = (e) => {
    if(emails === email && contraseña === contrasea ) history.push("/dashboard");

     else alert('Datos incorrectos')
  };
    return(
        <>
  
<div className="min-h-screenflex flex-col justify-center sm:py-12">
  <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
  <div className="flex items-center justify-center mt-8 mb-2">

</div>
<h2 className="text-white text-4xl font-bold mb-12 text-center">Panel de busqueda de stock</h2>
    <div className="bg-negritoclaro shadow w-full rounded-lg divide-y divide-gray-200">
      <div className="px-5 py-7">
        <label className="font-semibold text-sm text-white pb-1 block">E-mail</label>
        <input
  className="py-3 w-full tracking-tight bg-transparent text-white placeholder-white/50 outline-none border-2 rounded-lg border-black focus:border-rosita transition duration-200"
  id="signUpInput1-2"
                    type="text"
                    placeholder="Email Address"
                    name="correo"
                   onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="font-semibold text-sm text-white pb-1 block">Password</label>
                          <input
  className="py-3 w-full tracking-tight bg-transparent text-white placeholder-white/50 outline-none border-2 rounded-lg border-black focus:border-rosita transition duration-200"
  id="signUpInput1-3"
                    type="password"
                    placeholder="contraseña"
                    name="contraseña"
                     onChange={(e) => setContraseña(e.target.value)}
                  />    
                  
                      <button type="button" onClick={onSubmit} className="transition duration-200 mt-8 bg-rosita  focus:shadow-sm focus:ring-4 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
            <span className="inline-block mr-2">Login</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </button>

      </div>
        <div className="py-5">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-center sm:text-left whitespace-nowrap">
     
          </div>
        </div>
      </div>
    </div>
    <div className="py-5">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-center sm:text-left whitespace-nowrap">
   
          </div>
        </div>
      </div>
  </div>
</div>
        </>
    )
}