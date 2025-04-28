import AuthForm from '../Components/AuthForm';
import { registerUser } from '../api/auth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // 👈 import Link

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (email, password) => {
    const { token } = await registerUser(email, password);
    login(token);
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-200 flex justify-center items-center h-[100vh]">
      <div className="flex flex-col items-start p-4 bg-white rounded-xl shadow-xl" style={{ textAlign: 'center' }}>
      <AuthForm onSubmit={handleRegister} title="Register" />
      <p>
        Already have an account?{' '}
        <Link className='text-green-600' to="/">Login</Link> {/* 👈 clickable link to login */}
      </p>
      </div>
    </div>
  );
};

export default Register;
