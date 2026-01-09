import css from "./LoginForm.module.css";
import { useId, useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../FormInput/FormInput.jsx";
import {
  selectIsLoading,
  selectError,
} from "../../../redux/auth/authSelectors.js";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../../../redux/auth/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../../../redux/auth/authOperations.js";

// Validasyon şeması
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("E-mail is required"),
  password: yup
    .string()
    .matches(
      passwordPattern,
      "Password must be at least 8 characters, containing uppercase, lowercase, and a digit."
    )
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
});

// Varsayılan değerler
const initialValues = { email: "", password: "" };

const LoginForm = () => {
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(logIn(values)).unwrap();
      reset();
      navigate("/calculator");
    } catch {
    }
  };

  return (
    <div className={css.loginContainer}>
      <div className={css.loginWrapper}>
        <h2 className="auth-title">LOG IN</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={css.loginForm}>
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

          <div className={css.loginButtonWrapper}>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Loading..." : "Log In"}
            </button>
            <Link to="/register">
              <button type="button" className="btn-secondary">
                Register
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;