interface AuthWrapperProps {
  children: React.ReactNode;
}

function AuthWrapper({ children }: AuthWrapperProps): JSX.Element {
  return children;
}

export default AuthWrapper;