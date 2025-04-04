/* eslint-disable react/prop-types */

const ErrorMsg = ({ error, msgTooltip }) => {
  return (
    <>
      {error && (
        <div className={` mt-2 ${msgTooltip ? ' inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded' : ' text-danger-500 block text-sm'}`}>{error.message}</div>
      )}
    </>
  );
};

export default ErrorMsg;
