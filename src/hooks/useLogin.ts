import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login } from "../services/authService";
import { useAuthStore } from "../store/authStore";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("No es un email valido")
    .required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

export const useLogin=()=>{
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage,seterrorMessage]=useState("");
  const loginUser = useAuthStore((state) => state.loginUser);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setLoginError(false); // Reset error state before making request
      
      try {
        const responseLogin = await login(values.email, values.password);
        
        if (!responseLogin) {
          console.log("Login failed - no response"); // Debug log
          setLoginError(true);
          formik.resetForm();
          return;
        }
        console.log(responseLogin)
        
        loginUser(responseLogin);
       
        navigate('/dashboard', {
          replace: true,
        });
        
      } catch (error) {
        console.error("Login error:", error); // Debug log
        setLoginError(true);
        if(error instanceof Error){
          seterrorMessage(error.message)
        }
        formik.resetForm();
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleToastClose = () => {
    setLoginError(false);
  };

  return({formik,showPassword,isLoading,loginError,errorMessage,handleToastClose,handleClickShowPassword,handleMouseDownPassword,handleMouseUpPassword,navigate})
}