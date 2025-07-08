import './logincard.css';
import { useState } from 'react';
import api from '../utils/axiosInstance.jsx'
import { useSetRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom.js';
import { authScreenAtom } from '../atoms/authScreenAtom.js';

import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { toast } from 'react-toastify';
const LoginCard = () => {
  const setUser = useSetRecoilState(userAtom);
  const setScreen = useSetRecoilState(authScreenAtom);
  const [form, setForm] = useState({ username: '', password: ''});
  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const navigate=useNavigate()
  const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
  e.preventDefault();
   setLoading(true);
  try {
     const { data } = await api.post('/users/login', form, {
      withCredentials: true, 
     });



    setUser({ username: form.username,name:data.name,userId:data.userId }); 

   toast.success("Login successful!");
    navigate("/")
  } catch (err) {
    console.error(err.response?.data || err);
  
      toast.error(err.response?.data?.message || 'Login failed');
  }finally{
      setLoading(false);
  }
}


  return (
    <div className="login-card">
      <h2 className="mb-4">Welcome to Libris</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Usernam"
          value={form.username}
          onChange={onChange}
        />
       
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
    
<button type="submit" disabled={loading}>
  {loading ? <ClipLoader size={20} color="#fff" /> : "Log in"}
</button>

      </form>

      <p className="text-sm mt-3"> No account?
        <button
          className="underline"
          onClick={() => setScreen('signup')}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginCard;
