import { useState } from 'react';

const AuthForm = ({ onSubmit, title }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form className="flex flex-col gap-2 w-60 my-5" onSubmit={handleSubmit}>
      <h2 className='text-3xl font-semibold mb-2'>{title}</h2>
      <input className='border-0 outline-0 bg-gray-200 p-2' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className='border-0 outline-0 bg-gray-200 p-2' placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className='px-3 py-1 bg-green-400 text-white font-semibold hover:bg-green-500' type="submit">{title}</button>
    </form>
  );
};

export default AuthForm;
