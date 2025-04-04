/* eslint-disable react/prop-types */

const Label = ({ label, id, isRequired, classLabel = 'form-label', horizontal }) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className={` capitalize flex text-[16px] items-center gap-1 ${classLabel}  ${horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''}`}>
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
    </>
  );
};

export default Label;
