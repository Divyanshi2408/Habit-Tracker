import AuthForm from '../Components/AuthForm';
import { loginUser } from '../api/auth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; 

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const { token } = await loginUser(email, password);
    login(token);
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-200 flex justify-center items-center h-[100vh]">
      <div className="flex flex-col items-start p-4 bg-white rounded-xl shadow-xl" style={{ textAlign: 'center' }}>
      <AuthForm onSubmit={handleLogin} title="Login" />
      <p className='text-gray-700'>Don't have an account?</p>
      <Link to="/register">
        <button className='px-3 py-1 mt-2 rounded-lg bg-white border-2 border-green-400 hover:bg-green-400 hover:text-white font-semibold'>Register</button>
      </Link>
    </div>
    </div>
  );
};

export default Login;
