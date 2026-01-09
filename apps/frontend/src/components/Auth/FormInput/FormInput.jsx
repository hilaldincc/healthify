import css from "./FormInput.module.css";

const FormInput = ({ id, label, type, placeholder, register, error }) => (
  <div className={css.InputWrapper}>
    <label htmlFor={id} className={css.visuallyHidden}>
      {label}
    </label>

    <input
      type={type}
      id={id}
      placeholder={placeholder}
      {...register}
      className={`${css.formInput} ${error ? css.formInputError : ""}`}
    />
    {error && <p className={css.authErrorMessage}>{error}</p>}
  </div>
);

export default FormInput;