import React, { useState } from 'react';
import GorgiaLogo from '../../../assets/gorgia-jobs-cover.png';
import BiostarLogo from '../../../assets/Biostar.png';
import { fetchUser, login } from '../../../services/auth';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            console.log(response);
            if(response.status == 200){
                navigate('/employees/create')
            }
        } catch (error) {
            setError(error.message || 'An error occurred during login.');
        }
    };



    return (
        <div className="bg-[#1976D2] w-full h-[100vh] flex flex-col justify-between items-center py-[100px]">
            <div className="flex flex-col justify-center items-center">
                <img src={GorgiaLogo} alt="Gorgia Jobs" />
                <img src={BiostarLogo} alt="Biostar" />
            </div>
            <div className="flex flex-col justify-center items-center mt-6 gap-12 w-[575px]">
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-white outline-none border-b border-white w-full py-2 placeholder-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent text-white outline-none border-b border-white w-full py-2 placeholder-white"
                />
                {error && <p className="text-red-500">არასწორი პაროლი ან ემაილი</p>}
                <button
                    className="text-[17px] bg-[#FBD15B] text-[#1976D2] w-full rounded-md py-4 font-bold"
                    onClick={() => handleLogin()}
                >
                    შესვლა
                </button>
            </div>
        </div>
    );
};

export default Login;
