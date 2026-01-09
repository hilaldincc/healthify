import css from "./RegistrationForm.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useId } from "react";
import FormInput from "../FormInput/FormInput";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../../redux/auth/authOperations";
import { Link } from "react-router-dom";
import { clearAuthError } from "../../../redux/auth/authSlice";
import {
  selectIsLoading,
  selectError,
} from "../../../redux/auth/authSelectors";

//Validasyon Şeması
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const registerSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid email address").required("Required"),
  password: yup
    .string()
    .matches(
      passwordPattern,
      "Password must be at least 8 characters, containing uppercase, lowercase, and a digit."
    )
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectError);

  const nameFieldId = useId();
  const emailFieldId = useId();
  const passwordFieldId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });
  // Hata durumunu temizleme
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (values) => {
    const { ...userData } = values;
    try {
      await dispatch(registerUser(userData)).unwrap();
      reset();
    } catch {
      // Hata yönetimi Redux thunk (registerUser operasyonu)
      // ve Redux state (authError) tarafından yapılıyor.
      // Bu catch bloğu, .unwrap() tarafından fırlatılan hatayı
      // yakalayarak uygulamanın çökmesini engellemek için gereklidir.
    }
  };

  return (
    <div className={css.registerContainer}>
      <div className={css.registerWrapper}>
        <h2 className="auth-title">REGISTER</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={css.registerForm}>
          <FormInput
            id={nameFieldId}
            label="Name"
            type="name"
            placeholder="Name *"
            register={register("name")}
            error={errors.name?.message}
          />

          <FormInput
            id={emailFieldId}
            label="E-mail"
            type="email"
            placeholder="Email *"
            register={register("email")}
            error={errors.email?.message}
          />

          <FormInput
            id={passwordFieldId}
            label="Password"
            type="password"
            placeholder="Password *"
            register={register("password")}
            error={errors.password?.message}
          />
          {authError && <p className={css.authErrorMessage}>{authError}</p>}
          <div className={css.registerButtonWrapper}>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Loading..." : "Register"}
            </button>
            <Link to="/login">
              <button type="button" className="btn-secondary">
                Log in
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;