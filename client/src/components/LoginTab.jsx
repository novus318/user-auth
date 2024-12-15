import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginTab = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // Set loading to true to indicate request is in progress
    setLoading(true);
    setError('');

    try {
      // Make the POST request to the backend API
      const response = await axios.post('/api/user/login', {
        email,
        password,
      });

      // Handle success
      if (response.data.success) {
        // Save the token 
        await localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-slate-50">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-md mb-3 text-neutral-950 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded-md mb-3 text-neutral-950 border"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default LoginTab;
