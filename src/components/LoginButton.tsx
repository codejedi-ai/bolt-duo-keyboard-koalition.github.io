import { Link } from 'react-router-dom';

function LoginButton(): JSX.Element {
  return (
    <Link 
      to="/auth"
      className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-all duration-200 font-medium"
    >
      Login
    </Link>
  );
}

export default LoginButton;