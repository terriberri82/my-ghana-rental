const UnauthenticatedWrapper = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default UnauthenticatedWrapper;
