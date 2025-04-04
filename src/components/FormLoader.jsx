/* eslint-disable react/prop-types */
const FormLoader = ({ children, isLoading }) => {
  if (children) {
    return isLoading ? (
      <div className="flex items-center justify-center h-[200px]">
        <span className="dot-loader"></span>
      </div>
    ) : (
      children
    );
  }

  return (
    <div className="flex items-center justify-center h-[200px]">
      <span className="dot-loader"></span>
    </div>
  );
};

export default FormLoader;
