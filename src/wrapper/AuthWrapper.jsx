const AuthenticatedWrapper = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};
export default AuthenticatedWrapper;
