import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';
import { userAtom } from '../atoms/userAtom.js';
import { authScreenAtom } from '../atoms/authScreenAtom.js';
import './signupcard.css'
import { toast } from 'react-toastify';
const SignupCard = () => {
  const setScreen = useSetRecoilState(authScreenAtom);
  const [form, setForm] = useState({ username: '', password: '',email:'',name:'' });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/signup', form, {
        withCredentials: true, 
      });

 
   toast.success("Signup successful!");
      setScreen('login'); 
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-card">
      <h2 className="mb-4">Sign up</h2>

      <form onSubmit={handleSubmit}>
          <input
                  name="name"
                  type="text"
                  placeholder="First Name"
                  value={form.name}
                  onChange={onChange}
                />
         <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                />
        <input
          name="username"
          placeholder="Username"
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
        <button type="submit">Create</button>
      </form>

      <p className="text-sm mt-3">
        Have an account?{' '}
        <button className="underline" onClick={() => setScreen('login')}>
          Log in
        </button>
      </p>
    </div>
  );
};

export default SignupCard;
